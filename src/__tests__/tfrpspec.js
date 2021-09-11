import { observable, computed, effect } from '../tfrp';

describe("TinyState", () => {
    test("Should allow creating observables out of data", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        expect(o.firstName).toBe('a');
        expect(o.lastName).toBe('b');
    })

    test("Should allow creating computeds", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const c = computed(() => `${o.firstName}-${o.lastName}`);
        expect(c).toBe('a-b');
    })

    test("Should allow creating effects", () => {
        const o = observable({firstName: 'a', lastName: 'b'});
        const c = effect(() => `${o.firstName}-${o.lastName}`);
        expect(c).toBe('a-b');
    })
})