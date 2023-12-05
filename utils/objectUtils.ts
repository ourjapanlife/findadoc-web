export function MapDefinedFields<T>(objectToCopyFrom: Partial<T>, objectToCopyTo: any) {
    for (const [key, value] of Object.entries(objectToCopyFrom)) {
        // we want to map null/0/'' as valid empty values, so we're only checking undefined
        if (value !== undefined && key in objectToCopyTo) {
            objectToCopyTo[key] = value
        }
    }

}
