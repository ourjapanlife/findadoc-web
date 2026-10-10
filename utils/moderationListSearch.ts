type NamedFacility = {
    id: string
    nameEn: string
    nameJa: string
}

type NamedProfessional = {
    id: string
    names: Array<{
        firstName: string
        lastName: string
        middleName?: string | null
    }>
}

function includesQuery(value: string | null | undefined, query: string): boolean {
    return (value ?? '').toLowerCase().includes(query)
}

/** Match a facility on the loaded page by English name, Japanese name, or id. */
export function facilityMatchesSearch(facility: NamedFacility, rawQuery: string): boolean {
    const query = rawQuery.trim().toLowerCase()
    if (!query) { return true }
    return includesQuery(facility.id, query)
      || includesQuery(facility.nameEn, query)
      || includesQuery(facility.nameJa, query)
}

/** Match a professional on the loaded page by any name part or id. */
export function healthcareProfessionalMatchesSearch(professional: NamedProfessional, rawQuery: string): boolean {
    const query = rawQuery.trim().toLowerCase()
    if (!query) { return true }
    if (includesQuery(professional.id, query)) { return true }
    return professional.names.some(name => includesQuery(name.firstName, query)
      || includesQuery(name.lastName, query)
      || includesQuery(name.middleName, query))
}
