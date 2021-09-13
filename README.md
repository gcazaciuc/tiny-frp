# TinyFRP (TFRP)

A tiny transparent function reactive library built for didactic purposes. 

Originally meant to illustrate the points about transparent reactive programming during ProgrammersWeek 2021 event, so it's definitely not production ready.

## API

The library exports 3 functions: `observable`, `effect` and `computed` , the building blocks of any reactive library.
It does not offer wrappers around various used land frameworks since their implementation it's pretty simple and can be easily achieved using used land code.

### observable(data)

Wraps any data, either primitive or objects and turns it into an observable entity.

Wrapping a primitive returns an object with a single property: `value`.

### effect(fn)

Executes a function a tracks the observables used inside it. It re-runs the `fn` function whenever any read observable property changes.

```js
        const o = observable({firstName: 'a', lastName: 'b'});
        const effectFn = () => { console.log(`${o.firstName}-${o.lastName}`); };
        const unsubscribe = effect(effectFn);
        unsubscribe();
```

Returns a function that, when called, it removes the watches on any tracked observable properties.

### computed(fn)

A variation of the `effect` function that is meant to compute derived values. Just as `effect` it auto-magically tracks any read observables inside the `fn` function but it also memoizes the return value of `fn()` until any tracked observables change.

As such `fn` is deemed to be a PURE function and return a value.

```js
        const o = observable({firstName: 'a', lastName: 'b'});
        const computedFn = () => `${o.firstName}-${o.lastName}`;
        const fullName = computed(computedFn);
        console.log(fullName.value);
```

It returns an `observable` instance wrapping whatever value `fn()` returned.