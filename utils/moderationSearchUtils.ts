import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'

function normalizeInput(value: string): string {
    return value.toLowerCase().trim()
}

export function matchesFacilitySearch(facility: Facility, rawInput: string): boolean {
    const input = normalizeInput(rawInput)
    if (!input) {
        return true
    }

    return facility.nameEn.toLowerCase().includes(input)
      || facility.nameJa.toLowerCase().includes(input)
      || facility.id.toLowerCase().includes(input)
}

export function matchesHealthcareProfessionalSearch(
    healthcareProfessional: HealthcareProfessional,
    rawInput: string
): boolean {
    const input = normalizeInput(rawInput)
    if (!input) {
        return true
    }

    const idMatches = healthcareProfessional.id.toLowerCase().startsWith(input)
    const nameMatches = healthcareProfessional.names.some(name => {
        const firstNameMatch = name.firstName.toLowerCase().includes(input)
        const middleNameMatch = name.middleName?.toLowerCase().includes(input)
        const lastNameMatch = name.lastName.toLowerCase().includes(input)
        return firstNameMatch || middleNameMatch || lastNameMatch
    })

    return idMatches || nameMatches
}

export function filterByCaseInsensitiveIncludes<T extends string>(items: T[], rawInput: string): T[] {
    const input = normalizeInput(rawInput)
    if (!input) {
        return items
    }

    return items.filter(item => item.toLowerCase().includes(input))
}

export function mapIdsToEntities<T extends { id: string }>(ids: string[], entities: T[]): T[] {
    const byId = new Map(entities.map(entity => [entity.id, entity] as const))
    return ids
        .map(id => byId.get(id))
        .filter((entity): entity is T => entity !== undefined)
}
