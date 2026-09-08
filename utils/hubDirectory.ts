import { useRuntimeConfig } from '#imports'
import { graphqlEndpoint } from './graphqlEndpoint'
import { buildHubIndex, type HubCity, type HubPrefecture } from './hubIndex'
import type { FacilitySearchResult } from './searchDirectory'
import type { Facility } from '~/typedefs/gqlTypes'

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

function directoryValues(
    directory: Record<string, FacilitySearchResult> | undefined | null
): FacilitySearchResult[] | undefined {
    if (!directory || Object.keys(directory).length === 0) {
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

async function fetchFacilitiesLive(): Promise<FacilitySearchResult[] | null> {
    const rows: Facility[] = []
    let totalCount = 0

    for (let offset = 0; ; offset += PAGE_SIZE) {
        try {
            const response = await fetch(graphqlEndpoint(), {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    query: FACILITIES_QUERY,
                    variables: {
                        filters: { limit: PAGE_SIZE, offset },
                        countFilters: {}
                    }
                }),
                signal: AbortSignal.timeout(LIVE_FETCH_TIMEOUT_MS)
            })
            if (!response.ok) {
                return null
            }
            const json = await response.json() as {
                data?: { facilities?: Facility[], facilitiesTotalCount?: number }
                errors?: unknown[]
            }
            if (json.errors?.length || !json.data) {
                return null
            }
            const page = json.data.facilities ?? []
            totalCount = json.data.facilitiesTotalCount ?? page.length
            rows.push(...page)
            if (!page.length || rows.length >= totalCount) {
                break
            }
        } catch {
            return null
        }
    }

    return rows.map(facility => ({ ...facility, healthcareProfessionals: [] }))
}

export async function loadFacilityDirectory(): Promise<FacilitySearchResult[] | null> {
    if (import.meta.server) {
        const fromConfig = directoryValues(
            useRuntimeConfig().clinicPrerenderDirectory as Record<string, FacilitySearchResult> | undefined
        )
        if (fromConfig) {
            return fromConfig
        }

        const fromBundle = await directoryFromBundle()
        if (fromBundle) {
            return fromBundle
        }
    }

    return fetchFacilitiesLive()
}

type HubIndex = ReturnType<typeof buildHubIndex>

let cachedHubIndex: HubIndex | undefined
let hubIndexLoad: Promise<HubIndex | null> | undefined

async function loadHubIndex(): Promise<HubIndex | null> {
    if (cachedHubIndex) {
        return cachedHubIndex
    }

    hubIndexLoad ??= (async () => {
        try {
            const facilities = await loadFacilityDirectory()
            if (!facilities?.length) {
                return null
            }
            cachedHubIndex = buildHubIndex(facilities)
            return cachedHubIndex
        } finally {
            if (!cachedHubIndex) {
                hubIndexLoad = undefined
            }
        }
    })()

    return hubIndexLoad
}

export async function loadPrefectureHub(prefectureSlug: string): Promise<HubPrefecture | null> {
    const index = await loadHubIndex()
    return index?.byPrefecture[prefectureSlug] ?? null
}

export async function loadCityHub(prefectureSlug: string, citySlug: string): Promise<HubCity | null> {
    const prefecture = await loadPrefectureHub(prefectureSlug)
    return prefecture?.cities.find(city => city.citySlug === citySlug) ?? null
}
