import { useRuntimeConfig } from '#imports'
import { graphqlEndpoint } from './graphqlEndpoint'
import { buildFacetIndex, type FacetPage } from './facetIndex'
import type { FacetIndexByPrefecture } from './directoryLinks'
import { parsePrefectureSecondSegment } from './facetPath'
import { buildHubIndex, type HubCity, type HubPrefecture } from './hubIndex'
import type { FacilitySearchResult } from './searchDirectory'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'

const PAGE_SIZE = 100
const LIVE_FETCH_TIMEOUT_MS = 10000

const FACILITIES_QUERY = `
    query HubFacilities($filters: FacilitySearchFilters!, $countFilters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            nameEn
            nameJa
            mapLatitude
            mapLongitude
            healthcareProfessionalIds
            contact {
                address {
                    addressLine1En
                    addressLine2En
                    addressLine1Ja
                    addressLine2Ja
                    cityJa
                    cityEn
                    prefectureJa
                    prefectureEn
                    postalCode
                }
                email
                googleMapsUrl
                phone
                website
            }
            createdDate
            updatedDate
        }
        facilitiesTotalCount(filters: $countFilters)
    }
`

const PROFESSIONALS_QUERY = `
    query HubProfessionals($filters: HealthcareProfessionalSearchFilters!) {
        healthcareProfessionals(filters: $filters) {
            id
            names {
                lastName
                firstName
                middleName
                locale
            }
            degrees
            specialties
            facilityIds
            spokenLanguages
            acceptedInsurance
            additionalInfoForPatients
            createdDate
            updatedDate
        }
    }
`

function directoryValues(
    directory: Record<string, FacilitySearchResult> | undefined | null
): FacilitySearchResult[] | undefined {
    if (directory == null) {
        return undefined
    }
    return Object.values(directory)
}

async function directoryFromBundle(): Promise<FacilitySearchResult[] | undefined> {
    try {
        const mod = await import('#clinic-directory')
        return directoryValues((mod.default ?? mod) as Record<string, FacilitySearchResult>)
    } catch {
        return undefined
    }
}

async function graphqlPost<T>(query: string, variables: unknown): Promise<T | null> {
    try {
        const response = await fetch(graphqlEndpoint(), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query, variables }),
            signal: AbortSignal.timeout(LIVE_FETCH_TIMEOUT_MS)
        })
        if (!response.ok) {
            return null
        }
        const json = await response.json() as { data?: T, errors?: unknown[] }
        if (json.errors?.length || !json.data) {
            return null
        }
        return json.data
    } catch {
        return null
    }
}

function chunkIds(ids: readonly string[], size: number): string[][] {
    const chunks: string[][] = []
    for (let index = 0; index < ids.length; index += size) {
        chunks.push([...ids.slice(index, index + size)])
    }
    return chunks
}

function joinFacilities(
    facilities: readonly Facility[],
    professionals: readonly HealthcareProfessional[]
): FacilitySearchResult[] {
    const byId = new Map(professionals.map(professional => [professional.id, professional]))
    const reverseIds = new Map<string, string[]>()

    for (const professional of professionals) {
        for (const facilityId of professional.facilityIds ?? []) {
            const ids = reverseIds.get(facilityId)
            if (ids) {
                ids.push(professional.id)
            } else {
                reverseIds.set(facilityId, [professional.id])
            }
        }
    }

    return facilities.map(facility => {
        const seen = new Set<string>()
        const healthcareProfessionals: HealthcareProfessional[] = []

        for (const id of [
            ...(facility.healthcareProfessionalIds ?? []),
            ...(reverseIds.get(facility.id) ?? [])
        ]) {
            if (seen.has(id)) {
                continue
            }
            seen.add(id)
            const professional = byId.get(id)
            if (professional) {
                healthcareProfessionals.push(professional)
            }
        }

        return { ...facility, healthcareProfessionals }
    })
}

async function fetchProfessionalsByIds(ids: readonly string[]): Promise<HealthcareProfessional[] | null> {
    if (!ids.length) {
        return []
    }

    const professionals: HealthcareProfessional[] = []

    for (const idsChunk of chunkIds(ids, PAGE_SIZE)) {
        const data = await graphqlPost<{ healthcareProfessionals?: HealthcareProfessional[] }>(
            PROFESSIONALS_QUERY,
            { filters: { ids: idsChunk, limit: PAGE_SIZE } }
        )
        if (!data) {
            return null
        }
        professionals.push(...(data.healthcareProfessionals ?? []))
    }

    const byId = new Map(professionals.map(professional => [professional.id, professional]))
    return ids
        .map(id => byId.get(id))
        .filter((professional): professional is HealthcareProfessional => !!professional)
}

async function fetchFacilitiesLive(): Promise<FacilitySearchResult[] | null> {
    const rows: Facility[] = []
    let totalCount = 0

    for (let offset = 0; ; offset += PAGE_SIZE) {
        const data = await graphqlPost<{
            facilities?: Facility[]
            facilitiesTotalCount?: number
        }>(FACILITIES_QUERY, {
            filters: { limit: PAGE_SIZE, offset },
            countFilters: {}
        })
        if (!data) {
            return null
        }
        const page = data.facilities ?? []
        totalCount = data.facilitiesTotalCount ?? page.length
        rows.push(...page)
        if (!page.length || rows.length >= totalCount) {
            break
        }
    }

    const professionalIds = [...new Set(rows.flatMap(facility => facility.healthcareProfessionalIds ?? []))]
    const professionals = await fetchProfessionalsByIds(professionalIds)
    if (!professionals) {
        return null
    }
    return joinFacilities(rows, professionals)
}

export async function loadFacilityDirectory(): Promise<FacilitySearchResult[] | null> {
    if (import.meta.server) {
        const fromConfig = directoryValues(
            useRuntimeConfig().clinicPrerenderDirectory as Record<string, FacilitySearchResult> | undefined
        )
        if (fromConfig?.length) {
            return fromConfig
        }

        const fromBundle = await directoryFromBundle()
        if (fromBundle?.length) {
            return fromBundle
        }
    }

    return fetchFacilitiesLive()
}

type DirectoryIndexes = {
    hub: ReturnType<typeof buildHubIndex>
    facets: ReturnType<typeof buildFacetIndex>
}

let cachedIndexes: DirectoryIndexes | undefined
let indexesLoad: Promise<DirectoryIndexes | null> | undefined

async function loadDirectoryIndexes(): Promise<DirectoryIndexes | null> {
    if (cachedIndexes) {
        return cachedIndexes
    }

    indexesLoad ??= (async () => {
        try {
            const facilities = await loadFacilityDirectory()
            if (!facilities?.length) {
                return null
            }
            cachedIndexes = {
                hub: buildHubIndex(facilities),
                facets: buildFacetIndex(facilities)
            }
            return cachedIndexes
        } finally {
            if (!cachedIndexes) {
                indexesLoad = undefined
            }
        }
    })()

    return indexesLoad
}

export async function loadPrefectureHub(prefectureSlug: string): Promise<HubPrefecture | null> {
    const indexes = await loadDirectoryIndexes()
    return indexes?.hub.byPrefecture[prefectureSlug] ?? null
}

export async function loadCityHub(prefectureSlug: string, citySlug: string): Promise<HubCity | null> {
    const prefecture = await loadPrefectureHub(prefectureSlug)
    return prefecture?.cities.find(city => city.citySlug === citySlug) ?? null
}

async function loadFacetIndex(): Promise<ReturnType<typeof buildFacetIndex> | null> {
    const indexes = await loadDirectoryIndexes()
    return indexes?.facets ?? null
}

function withoutFacilities(facet: FacetPage): Omit<FacetPage, 'facilities'> {
    return {
        kind: facet.kind,
        prefectureSlug: facet.prefectureSlug,
        prefectureEn: facet.prefectureEn,
        prefectureJa: facet.prefectureJa,
        path: facet.path,
        slug: facet.slug,
        specialty: facet.specialty,
        locale: facet.locale,
        label: facet.label,
        professionalCount: facet.professionalCount,
        updatedDate: facet.updatedDate
    }
}

let cachedLinkCatalog: FacetIndexByPrefecture | undefined
let linkCatalogLoad: Promise<FacetIndexByPrefecture | null> | undefined

/**
 * Prefecture → specialty/language paths without nested facilities. Doctor pages
 * must use this (not `loadFacetIndex`) so prerender does not JSON-serialize the
 * whole directory into every `/doctor/…` payload.
 */
export async function loadFacetLinkCatalog(): Promise<FacetIndexByPrefecture | null> {
    if (cachedLinkCatalog) {
        return cachedLinkCatalog
    }

    linkCatalogLoad ??= (async () => {
        try {
            const index = await loadFacetIndex()
            if (!index) {
                return null
            }

            const byPrefecture: FacetIndexByPrefecture = {}
            for (const [slug, bucket] of Object.entries(index.byPrefecture)) {
                byPrefecture[slug] = {
                    specialties: bucket.specialties.map(withoutFacilities),
                    languages: bucket.languages.map(withoutFacilities)
                }
            }
            cachedLinkCatalog = byPrefecture
            return cachedLinkCatalog
        } finally {
            if (!cachedLinkCatalog) {
                linkCatalogLoad = undefined
            }
        }
    })()

    return linkCatalogLoad
}

export async function loadPrefectureFacets(
    prefectureSlug: string
): Promise<{ specialties: FacetPage[], languages: FacetPage[] }> {
    const index = await loadFacetIndex()
    return index?.byPrefecture[prefectureSlug] ?? { specialties: [], languages: [] }
}

export async function loadPrefectureLeaf(
    prefectureSlug: string,
    secondSlug: string
): Promise<{ type: 'city', city: HubCity } | { type: 'facet', facet: FacetPage } | null> {
    const parsed = parsePrefectureSecondSegment(secondSlug)
    if (!parsed) {
        return null
    }

    if (parsed.kind === 'specialty' || parsed.kind === 'language') {
        const facets = await loadPrefectureFacets(prefectureSlug)
        const list = parsed.kind === 'specialty' ? facets.specialties : facets.languages
        const facet = list.find(entry => entry.slug === parsed.slug)
        return facet ? { type: 'facet', facet } : null
    }

    const city = await loadCityHub(prefectureSlug, parsed.slug)
    return city ? { type: 'city', city } : null
}
