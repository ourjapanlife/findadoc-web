export const stableStringify = (input: unknown): string => {
    const seen = new WeakSet<object>()

    const normalize = (value: unknown): unknown => {
        if (value === null) return null

        const t = typeof value

        if (t === 'string' || t === 'number' || t === 'boolean') return value

        if (t === 'bigint') return null

        // JSON-like: drop from objects; arrays become null (handled below)
        if (t === 'undefined' || t === 'function' || t === 'symbol') return undefined

        if (value instanceof Date) return value.toISOString()
        if (value instanceof RegExp) return value.toString()

        if (Array.isArray(value)) {
            return value.map(v => {
                const n = normalize(v)
                return n === undefined ? null : n
            })
        }

        if (t === 'object' && value) {
            const obj = value as Record<string, unknown>

            if (seen.has(obj)) throw new TypeError('stableStringify: circular structure')
            seen.add(obj)

            const out: Record<string, unknown> = {}
            for (const key of Object.keys(obj).sort()) {
                const n = normalize(obj[key])
                if (n !== undefined) out[key] = n // JSON drops undefined in objects
            }

            seen.delete(obj)
            return out
        }

        return value
    }

    return JSON.stringify(normalize(input))
}
