import { describe, it, expect } from 'vitest'
import { stableStringify } from '~/utils/stableStringify'

describe('stableStringify', () => {
    it('stringifies primitives consistently', () => {
        expect(stableStringify('a')).toBe('"a"')
        expect(stableStringify(123)).toBe('123')
        expect(stableStringify(true)).toBe('true')
        expect(stableStringify(null)).toBe('null')
    })

    it('sorts object keys deterministically', () => {
        const a = { b: 2, a: 1, c: 3 }
        const b = { c: 3, b: 2, a: 1 }
        expect(stableStringify(a)).toBe('{"a":1,"b":2,"c":3}')
        expect(stableStringify(b)).toBe('{"a":1,"b":2,"c":3}')
    })

    it('drops undefined/function/symbol keys from objects (JSON-like)', () => {
        const sym = Symbol('x')
        const obj: { a: number, u?: undefined, f?: () => number, s?: symbol } = {
            a: 1,
            u: undefined,
            f: () => 1,
            s: sym
        }

        expect(stableStringify(obj)).toBe('{"a":1}')
    })

    it('converts undefined/function/symbol in arrays to null (JSON-like)', () => {
        const sym = Symbol('x')
        const arr: Array<unknown> = [1, undefined, () => 1, sym, 'x']
        expect(stableStringify(arr)).toBe('[1,null,null,null,"x"]')
    })

    it('treats BigInt as null', () => {
        expect(stableStringify(10n)).toBe('null')
        expect(stableStringify({ a: 10n })).toBe('{"a":null}')
        expect(stableStringify([10n])).toBe('[null]')
    })

    it('serializes Date as ISO string', () => {
        const d = new Date('2020-01-02T03:04:05.678Z')
        expect(stableStringify(d)).toBe('"2020-01-02T03:04:05.678Z"')
        expect(stableStringify({ d })).toBe('{"d":"2020-01-02T03:04:05.678Z"}')
    })

    it('serializes RegExp as string form', () => {
        const r = /abc/gi
        expect(stableStringify(r)).toBe('"/abc/gi"')
        expect(stableStringify({ r })).toBe('{"r":"/abc/gi"}')
    })

    it('handles nested objects + arrays with stable ordering', () => {
        const x = {
            z: [{ b: 2, a: 1 }, { d: 4, c: 3 }],
            a: { y: 2, x: 1 }
        }

        expect(stableStringify(x)).toBe(
            '{"a":{"x":1,"y":2},"z":[{"a":1,"b":2},{"c":3,"d":4}]}'
        )
    })

    it('drops undefined inside nested objects (and keeps others)', () => {
        const obj = {
            a: {
                keep: 1,
                drop: undefined as undefined | number
            },
            b: 2
        }

        expect(stableStringify(obj)).toBe('{"a":{"keep":1},"b":2}')
    })

    it('converts undefined inside nested arrays to null', () => {
        const obj: { a: Array<unknown> } = { a: [1, undefined, { b: undefined, c: 3 }] }
        expect(stableStringify(obj)).toBe('{"a":[1,null,{"c":3}]}')
    })

    it('represents direct circular references with a sentinel (does not throw)', () => {
        type Node = { x: number, self?: Node }
        const a: Node = { x: 1 }
        a.self = a

        expect(() => stableStringify(a)).not.toThrow()
        expect(stableStringify(a)).toBe('{"self":"[circular]","x":1}')
    })

    it('represents indirect circular references with a sentinel (does not throw)', () => {
        type A = { name: string, b?: B }
        type B = { name: string, a: A }

        const a: A = { name: 'a' }
        const b: B = { name: 'b', a }
        a.b = b // a -> b -> a

        expect(() => stableStringify(a)).not.toThrow()
        expect(stableStringify(a)).toBe('{"b":{"a":"[circular]","name":"b"},"name":"a"}')
    })

    it('stringifies shared references twice (not treated as circular)', () => {
        type Shared = { x: number }
        type Root = { a: Shared, b: Shared }

        const shared: Shared = { x: 1 }
        const root: Root = { a: shared, b: shared }

        expect(stableStringify(root)).toBe('{"a":{"x":1},"b":{"x":1}}')
    })
})
