
// Keep track of the derivation stack
const stack = [];

export function observable(data) {
    let dependencies = [];
    const targetData = typeof data === 'object' ? data : { value: data };
    const handler = {
        get: function(target, key, receiver) {
            // Record subscriptions
            const runningEffect = stack[stack.length - 1];
            if (runningEffect) {
                dependencies.push({runningEffect, key})
                runningEffect.cleanup.push(() => {
                    dependencies = dependencies.filter((d) => d.key === key && d.runningEffect.fn === runningEffect.fn);
                });
            }
            return Reflect.get(target, key, receiver);
        },
        set: function(target, key, value, receiver) {
            // Notify subscribers
            const result = Reflect.set(target, key, value, receiver)
            dependencies.filter((d) => d.key === key).forEach((d) => d.runningEffect.run());
            return result;
        }
    }

    return new Proxy(targetData, handler);
}

export function effect(fn) {
    const run = () => {
        const r = fn();
        fn.__cache__ = fn.__cache__ ? fn.__cache__ : observable(r);
        fn.__cache__.value = r;
    }
    const cleanup = () => {
        // Unsubscribe from all tracked observables
        if (fn.__cleanup__) {
            fn.__cleanup__.forEach((c) => c());
        }
    };
    
    cleanup();
    const stackEntry = { run, cleanup: [], fn };
    stack.push(stackEntry);
    run();
    fn.__cleanup__ = stackEntry.cleanup;
    stack.pop();

    return cleanup;
}

export function computed(fn) {
    if (fn.__cache__) {
        return fn.__cache__;
    }
    effect(fn);

    return fn.__cache__;
}