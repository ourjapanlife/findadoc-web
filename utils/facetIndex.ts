import {
    facetLanguageDocumentTitle,
    facetSpecialtyDocumentTitle,
    isIndexableFacet,
    languageFacetDisplayName,
    languageFacetPathFromSlugs,
    specialtyFacetDisplayName,
    specialtyFacetPathFromSlugs
} from './facetPath'
import { locationPrefectureSlug } from './clinicPath'
import { prefectureHubPathFromSlug } from './hubPath'
import type { FacilitySearchResult } from './searchDirectory'
import type { HealthcareProfessional, Locale, Specialty } from '../typedefs/gqlTypes'

export type FacetProfessional = Pick<HealthcareProfessional, 'id'> & {
    specialties?: HealthcareProfessional['specialties'] | null
    spokenLanguages?: HealthcareProfessional['spokenLanguages'] | null
    updatedDate?: string | null
}

export type FacetFacilitySource = {
    id: string
    nameEn?: string | null
    nameJa?: string | null
    updatedDate?: string | null
    contact?: {
        address?: {
            cityEn?: string | null
            cityJa?: string | null
            prefectureEn?: string | null
            prefectureJa?: string | null
        } | null
    } | null
    healthcareProfessionals?: FacetProfessional[] | null
}

export type FacetPage = {
    kind: 'specialty' | 'language'
    prefectureSlug: string
    prefectureEn: string
    prefectureJa: string
    path: string
    slug: string
    specialty?: Specialty
    locale?: Locale
    label: string
    professionalCount: number
    facilities: FacilitySearchResult[]
    updatedDate?: string
}

type MutableFacet = {
    kind: 'specialty' | 'language'
    prefectureSlug: string
    prefectureEnLabels: string[]
    prefectureJaLabels: string[]
    path: string
    slug: string
    specialty?: Specialty
    locale?: Locale
    label: string
    professionalIds: Set<string>
    facilitiesById: Map<string, FacilitySearchResult>
    updatedDates: string[]
}

function compareName(left: string, right: string): number {
    return left.localeCompare(right, 'en', { sensitivity: 'base' })
}

function majorityLabel(labels: readonly string[], fallback: string): string {
    const counts = new Map<string, number>()
    for (const label of labels) {
        const trimmed = label.trim()
        if (!trimmed) {
            continue
        }
        counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1)
    }

    let best = fallback
    let bestCount = 0
    for (const [label, count] of counts) {
        if (count > bestCount) {
            best = label
            bestCount = count
        }
    }

    return best
}

function latestTimestamp(values: readonly string[]): string | undefined {
    let best: string | undefined
    let bestMs = Number.NEGATIVE_INFINITY
    for (const value of values) {
        const milliseconds = Date.parse(value)
        if (!Number.isNaN(milliseconds) && milliseconds > bestMs) {
            best = value
            bestMs = milliseconds
        }
    }
    return best
}

function asSearchResult(
    facility: FacetFacilitySource,
    professionals: FacetProfessional[]
): FacilitySearchResult {
    return {
        ...facility,
        healthcareProfessionals: professionals
    } as FacilitySearchResult
}

function matchingProfessionals(
    facility: FacetFacilitySource,
    matches: (professional: FacetProfessional) => boolean
): FacetProfessional[] {
    return (facility.healthcareProfessionals ?? []).filter(matches)
}

function ensureFacet(
    facets: Map<string, MutableFacet>,
    key: string,
    init: Omit<MutableFacet, 'professionalIds' | 'facilitiesById' | 'updatedDates'>
): MutableFacet {
    const existing = facets.get(key)
    if (existing) {
        return existing
    }

    const created: MutableFacet = {
        ...init,
        professionalIds: new Set(),
        facilitiesById: new Map(),
        updatedDates: []
    }
    facets.set(key, created)
    return created
}

function addToFacet(
    facet: MutableFacet,
    facility: FacetFacilitySource,
    professionals: FacetProfessional[],
    address: NonNullable<NonNullable<FacetFacilitySource['contact']>['address']> | undefined
) {
    if (!professionals.length) {
        return
    }

    for (const professional of professionals) {
        facet.professionalIds.add(professional.id)
        if (professional.updatedDate) {
            facet.updatedDates.push(professional.updatedDate)
        }
    }
    if (facility.updatedDate) {
        facet.updatedDates.push(facility.updatedDate)
    }
    if (address?.prefectureEn) {
        facet.prefectureEnLabels.push(address.prefectureEn)
    }
    if (address?.prefectureJa) {
        facet.prefectureJaLabels.push(address.prefectureJa)
    }
    facet.facilitiesById.set(facility.id, asSearchResult(facility, professionals))
}

function finishFacet(facet: MutableFacet): FacetPage | undefined {
    if (!isIndexableFacet(facet.professionalIds.size)) {
        return undefined
    }

    const facilities = [...facet.facilitiesById.values()]
        .sort((left, right) => compareName(left.nameEn ?? '', right.nameEn ?? ''))

    return {
        kind: facet.kind,
        prefectureSlug: facet.prefectureSlug,
        prefectureEn: majorityLabel(facet.prefectureEnLabels, facet.prefectureSlug),
        prefectureJa: majorityLabel(facet.prefectureJaLabels, ''),
        path: facet.path,
        slug: facet.slug,
        specialty: facet.specialty,
        locale: facet.locale,
        label: facet.label,
        professionalCount: facet.professionalIds.size,
        facilities,
        updatedDate: latestTimestamp(facet.updatedDates)
    }
}

export function buildFacetIndex(
    facilities: readonly FacetFacilitySource[]
): { facets: FacetPage[], byPrefecture: Record<string, { specialties: FacetPage[], languages: FacetPage[] }> } {
    const facets = new Map<string, MutableFacet>()

    for (const facility of facilities) {
        const address = facility.contact?.address
        const prefectureSlug = locationPrefectureSlug(address?.prefectureEn)
        const prefecturePath = prefectureHubPathFromSlug(prefectureSlug)
        if (!prefecturePath) {
            continue
        }

        const professionals = facility.healthcareProfessionals ?? []

        for (const specialty of new Set(professionals.flatMap(professional => professional.specialties ?? []))) {
            const path = specialtyFacetPathFromSlugs(prefectureSlug, specialty)
            if (!path) {
                continue
            }
            const matched = matchingProfessionals(
                facility,
                professional => (professional.specialties ?? []).includes(specialty)
            )
            addToFacet(
                ensureFacet(facets, `${prefectureSlug}:specialty:${specialty}`, {
                    kind: 'specialty',
                    prefectureSlug,
                    prefectureEnLabels: [],
                    prefectureJaLabels: [],
                    path,
                    slug: path.slice(prefecturePath.length + 1),
                    specialty,
                    label: specialtyFacetDisplayName(specialty)
                }),
                facility,
                matched,
                address ?? undefined
            )
        }

        for (const locale of new Set(professionals.flatMap(professional => professional.spokenLanguages ?? []))) {
            const path = languageFacetPathFromSlugs(prefectureSlug, locale)
            if (!path) {
                continue
            }
            const matched = matchingProfessionals(
                facility,
                professional => (professional.spokenLanguages ?? []).includes(locale)
            )
            addToFacet(
                ensureFacet(facets, `${prefectureSlug}:language:${locale}`, {
                    kind: 'language',
                    prefectureSlug,
                    prefectureEnLabels: [],
                    prefectureJaLabels: [],
                    path,
                    slug: path.slice(prefecturePath.length + 1),
                    locale,
                    label: languageFacetDisplayName(locale)
                }),
                facility,
                matched,
                address ?? undefined
            )
        }
    }

    const resolved = [...facets.values()]
        .map(finishFacet)
        .filter((facet): facet is FacetPage => !!facet)
        .sort((left, right) => (
            compareName(left.label, right.label) || compareName(left.prefectureEn, right.prefectureEn)
        ))

    const byPrefecture: Record<string, { specialties: FacetPage[], languages: FacetPage[] }> = {}
    for (const facet of resolved) {
        const bucket = byPrefecture[facet.prefectureSlug] ?? { specialties: [], languages: [] }
        if (facet.kind === 'specialty') {
            bucket.specialties.push(facet)
        } else {
            bucket.languages.push(facet)
        }
        byPrefecture[facet.prefectureSlug] = bucket
    }

    for (const bucket of Object.values(byPrefecture)) {
        bucket.specialties.sort((left, right) => compareName(left.label, right.label))
        bucket.languages.sort((left, right) => compareName(left.label, right.label))
    }

    return { facets: resolved, byPrefecture }
}

export function facetPathsFromFacilities(facilities: readonly FacetFacilitySource[]): string[] {
    return buildFacetIndex(facilities).facets.map(facet => facet.path)
}

export function facetSitemapUrls(
    facilities: readonly FacetFacilitySource[]
): Array<{ loc: string, lastmod?: string }> {
    return buildFacetIndex(facilities).facets.map(facet => (
        facet.updatedDate ? { loc: facet.path, lastmod: facet.updatedDate } : { loc: facet.path }
    ))
}

export function attachProfessionalsToFacilities(
    facilities: readonly FacetFacilitySource[],
    professionals: readonly (FacetProfessional & { facilityIds?: string[] | null })[]
): FacetFacilitySource[] {
    const byFacility = new Map<string, FacetProfessional[]>()
    for (const professional of professionals) {
        for (const facilityId of professional.facilityIds ?? []) {
            const list = byFacility.get(facilityId) ?? []
            list.push(professional)
            byFacility.set(facilityId, list)
        }
    }

    return facilities.map(facility => ({
        ...facility,
        healthcareProfessionals: byFacility.get(facility.id) ?? facility.healthcareProfessionals ?? []
    }))
}

export function facetDocumentTitle(facet: Pick<FacetPage, 'kind' | 'label' | 'prefectureEn'>): string {
    return facet.kind === 'specialty'
        ? facetSpecialtyDocumentTitle(facet.label, facet.prefectureEn)
        : facetLanguageDocumentTitle(facet.label, facet.prefectureEn)
}
