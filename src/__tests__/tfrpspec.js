import { jest } from '@jest/globals';
import { observable, computed, effect } from '../tfrp';

describe("TinyState", () => {
    test("Should allow creating observables out of object data", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        expect(o.firstName).toBe('a');
        expect(o.lastName).toBe('b');
    })

    test("Should allow creating observables out of primitive data", () => {
        const o = observable(1);
        expect(o.value).toBe(1);
        o.value = 2;
        expect(o.value).toBe(2);
    })

    test("Should allow creating computeds", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const c = computed(() => `${o.firstName}-${o.lastName}`);
        expect(c.value).toBe('a-b');
    })

    test("Computed should re-run when any observed property changes", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const computedFn = jest.fn(() => {
            return `${o.firstName}-${o.lastName}`;
        })
        const r = computed(computedFn);
        expect(r.value).toBe('a-b');
        o.lastName = 'c';
        expect(r.value).toBe('a-c');
    })

    test("Computed should not re-run if the dependencies have not changed", () => {
        const o = observable({firstName: 'a', lastName: 'b', email: 'test@test.com'});
        const computedFn = jest.fn(() => {
            return `${o.firstName}-${o.lastName}`;
        })
        const r = computed(computedFn);
        expect(computedFn).toHaveBeenCalledTimes(1);
        expect(r.value).toBe('a-b');
        o.email = 'test2@test.com';
        expect(computedFn).toHaveBeenCalledTimes(1);
        expect(r.value).toBe('a-b');
    })

    test("Computed should cache it's value until the dependencies have changed", () => {
        const o = observable({firstName: 'a', lastName: 'b', email: 'test@test.com'});
        const computedFn = jest.fn(() => {
            return `${o.firstName}-${o.lastName}`;
        })
        const r = computed(computedFn);
        expect(computedFn).toHaveBeenCalledTimes(1);
        expect(r.value).toBe('a-b');
        expect(r.value).toBe('a-b');
        o.lastName = 'c';
        expect(computedFn).toHaveBeenCalledTimes(2);
        expect(r.value).toBe('a-c');
    })

    test("Computed should be observable by themselves", () => {
        const o = observable({firstName: 'a', lastName: 'b', email: 'test@test.com'});
        const computedFn = jest.fn(() => {
            return `${o.firstName}-${o.lastName}`;
        })
        const r = computed(computedFn);
        const nestedComputedFn = jest.fn(() => {
            return r.value + 'd';
        })
        const n = computed(nestedComputedFn);
        expect(computedFn).toHaveBeenCalledTimes(1);
        expect(r.value).toBe('a-b');
        expect(n.value).toBe('a-bd');
        o.lastName = 'c';
        expect(computedFn).toHaveBeenCalledTimes(2);
        expect(nestedComputedFn).toHaveBeenCalledTimes(2);
        expect(r.value).toBe('a-c');
        expect(n.value).toBe('a-cd');
    })

    test("Should allow creating effects", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const effectFn = jest.fn(() => `${o.firstName}-${o.lastName}`);
        expect(effectFn).not.toBeCalled();
        effect(effectFn);
        expect(effectFn).toBeCalled();
    })

    test("Effects should re-run when any observed property changes", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const effectFn = jest.fn(() => `${o.firstName}-${o.lastName}`);
        expect(effectFn).not.toBeCalled();
        effect(effectFn);
        expect(effectFn).toBeCalled();
        o.lastName = 'c';
        expect(effectFn).toHaveBeenCalledTimes(2);
    })

    test("Effects should allow un-subscribing when any observed property changes", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const effectFn = jest.fn(() => `${o.firstName}-${o.lastName}`);
        expect(effectFn).not.toBeCalled();
        const unsubscribe = effect(effectFn);
        expect(effectFn).toHaveBeenCalledTimes(1);
        unsubscribe();
        o.lastName = 'c';
        expect(effectFn).toHaveBeenCalledTimes(1);
    })
})