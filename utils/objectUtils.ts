export function MapDefinedFields<T>(objectToCopyFrom: Partial<T>, objectToCopyTo: { [x: string]: object | null }) {
    for (const [key, value] of Object.entries(objectToCopyFrom)) {
        // we want to map null/0/'' as valid empty values, so we're only checking undefined
        if (value !== undefined && key in objectToCopyTo) {
            objectToCopyTo[key] = value
        }
    }
}

export function hasTruthyValues<T extends Record<string, unknown>>(obj: T): boolean {
    return Object.values(obj).some(val => {
        if (val === undefined || val === null) return false
        if (typeof val === 'string' && val.trim() === '') return false
        if (Array.isArray(val) && val.length === 0) return false
        if (val === 0) return false
        return true
    })
}
