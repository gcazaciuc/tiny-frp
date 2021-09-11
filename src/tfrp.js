export function observable(data) {
    return data;
}

export function computed(fn) {
    return fn();
}

export function effect(fn) {
    return fn();
}