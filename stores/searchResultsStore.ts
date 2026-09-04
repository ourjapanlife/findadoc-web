import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { computed, ref, watch, type Ref } from 'vue'
import { gqlClient, graphQLClientRequestWithRetry } from '../utils/graphql.js'
import { filterDirectory, type FacilitySearchResult, type SearchFilters } from '~/utils/searchDirectory'
import type { Facility,
    FacilitySearchFilters,
    HealthcareProfessional,
    HealthcareProfessionalSearchFilters,
    Locale,
    Specialty } from '~/typedefs/gqlTypes.js'

export type DirectoryStatus = 'idle' | 'loading' | 'ready' | 'error'

/**
 * 100 rows a page for both tables.
 *
 * Facilities are clamped to 100 server-side whatever we ask for (findadoc-server
 * `facilityService.searchFacilities`). Professionals are *validated* up to 1000, but the
 * endpoint actually fails somewhere between 300 and 400 rows — measured against
 * api.findadoc.jp, which holds 400 professionals, so a single "give me everything" page could
 * never succeed. It returns a 200 carrying a `Validation Failed` / `INTERNAL_SERVER_ERROR`
 * body rather than a clean limit error, so there is nothing to detect and back off from.
 *
 * 100 is the size the previous implementation used in production, and it is verified here at
 * every offset across the whole table. Do not raise it to the validator's ceiling: that number
 * describes what the input parser accepts, not what the query can serve.
 *
 * Both loaders page on the *count the server reports*, never on the length of a filtered
 * batch — that is how #1807 lost 79% of the directory.
 */
const FACILITY_PAGE_SIZE = 100
const PROFESSIONAL_PAGE_SIZE = 100

/** Ceiling on in-flight page requests, so a larger directory cannot become a thundering herd. */
const MAX_CONCURRENT_PAGE_REQUESTS = 6

/**
 * Anonymous reads: no Auth0 wait, a short gap between retries so a dead API fails in seconds
 * rather than 15, and a hard per-attempt deadline so a hung connection surfaces the error state
 * instead of leaving the page on skeletons indefinitely.
 */
const PUBLIC_REQUEST_OPTIONS = {
    skipAuth: true,
    retryAmount: 2,
    requestTimeoutInMilliseconds: 1500,
    abortAfterMs: 10000
}

interface Page<T> {
    rows: T[]
    totalCount: number
}

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    // -- Directory (loaded once, then filtered locally) --

    const directoryFacilities: Ref<Facility[]> = ref([])
    const directoryProfessionals: Ref<HealthcareProfessional[]> = ref([])
    const directoryStatus: Ref<DirectoryStatus> = ref('idle')
    let inFlightLoad: Promise<void> | null = null

    // -- Filters --

    const selectedCity: Ref<string | undefined> = ref()
    const selectedPrefecture: Ref<string | undefined> = ref()
    const selectedSpecialties: Ref<Specialty[] | undefined> = ref()
    const selectedLanguages: Ref<Locale[] | undefined> = ref()

    const filters = computed<SearchFilters>(() => ({
        city: selectedCity.value,
        prefecture: selectedPrefecture.value,
        specialties: selectedSpecialties.value,
        languages: selectedLanguages.value
    }))

    // -- Results --

    const searchResultsList = computed<FacilitySearchResult[]>(() =>
        filterDirectory(directoryFacilities.value, directoryProfessionals.value, filters.value))

    const totalResults = computed(() => searchResultsList.value.length)

    const currentPage = ref(1)
    const itemsPerPage = 25

    const paginatedResults = computed(() => searchResultsList.value.slice(0, currentPage.value * itemsPerPage))
    const hasMore = computed(() => paginatedResults.value.length < totalResults.value)

    const isLoading = computed(() => directoryStatus.value === 'loading')
    const hasLoadError = computed(() => directoryStatus.value === 'error')
    const isReady = computed(() => directoryStatus.value === 'ready')

    // A new filter combination starts from the first page.
    watch(filters, () => {
        currentPage.value = 1
    })

    function loadMore() {
        if (hasMore.value) {
            currentPage.value++
        }
    }

    // -- Active result --

    const activeFacilityId: Ref<string | undefined> = ref()

    /**
     * Resolved from the current results first, then from the whole directory: a shared link
     * to a facility should still open even when the link's filters exclude every professional
     * there. In that case the panel shows everyone at the facility.
     */
    const activeFacility = computed<FacilitySearchResult | undefined>(() => {
        const id = activeFacilityId.value
        if (!id) return undefined

        const fromResults = searchResultsList.value.find(facility => facility.id === id)
        if (fromResults) return fromResults

        const facility = directoryFacilities.value.find(candidate => candidate.id === id)
        if (!facility) return undefined

        const professionalIds = new Set(facility.healthcareProfessionalIds)
        return {
            ...facility,
            healthcareProfessionals: directoryProfessionals.value.filter(professional => professionalIds.has(professional.id))
        }
    })

    function setActiveFacility(facilityId: string) {
        activeFacilityId.value = facilityId
    }

    function clearActiveSearchResult() {
        activeFacilityId.value = undefined
    }

    function clearFilters() {
        selectedCity.value = undefined
        selectedPrefecture.value = undefined
        selectedSpecialties.value = undefined
        selectedLanguages.value = undefined
    }

    // -- Loading --

    /**
     * Fetches the directory once. Concurrent callers share the same request; a completed load
     * is never repeated for the lifetime of the store, so navigating away and back is free.
     */
    async function loadDirectory(): Promise<void> {
        if (directoryStatus.value === 'ready') return
        if (inFlightLoad) return inFlightLoad

        directoryStatus.value = 'loading'

        inFlightLoad = (async () => {
            try {
                // Independent tables, so both loads start at once instead of one behind the other.
                const [facilities, professionals] = await Promise.all([
                    fetchAllFacilities(),
                    fetchAllProfessionals()
                ])

                directoryFacilities.value = facilities
                directoryProfessionals.value = professionals
                directoryStatus.value = 'ready'
            } catch (error) {
                console.error('Loading the directory failed', error)
                directoryStatus.value = 'error'
            } finally {
                inFlightLoad = null
            }
        })()

        return inFlightLoad
    }

    /** Retry after a failed load. */
    async function reloadDirectory(): Promise<void> {
        if (directoryStatus.value === 'error') {
            directoryStatus.value = 'idle'
        }
        return loadDirectory()
    }

    /**
     * Kept as the entry point components call: ensures the directory is loaded and resets the
     * view. Results themselves are derived from the filters, so there is nothing else to run.
     */
    async function search(): Promise<void> {
        currentPage.value = 1
        clearActiveSearchResult()
        await loadDirectory()
    }

    /**
     * First page tells us the total; the remaining pages are fetched together. The page size
     * is taken from what the server actually returned, so a lower server-side cap still pages
     * correctly rather than silently truncating.
     */
    async function fetchAllPages<T>(requestPage: (offset: number) => Promise<Page<T>>): Promise<T[]> {
        const first = await requestPage(0)
        const pageSize = first.rows.length

        if (!pageSize || first.totalCount <= pageSize) {
            return first.rows
        }

        const offsets: number[] = []
        for (let offset = pageSize; offset < first.totalCount; offset += pageSize) {
            offsets.push(offset)
        }

        const rest = await fetchWithLimitedConcurrency(offsets, requestPage)
        return [...first.rows, ...rest.flatMap(page => page.rows)]
    }

    /**
     * Runs the page requests a few at a time rather than all at once. At today's five pages the
     * difference is nil, but the number of pages grows with the directory and this endpoint has
     * already shown it fails under load rather than degrading.
     */
    async function fetchWithLimitedConcurrency<T>(
        offsets: number[],
        requestPage: (offset: number) => Promise<Page<T>>
    ): Promise<Page<T>[]> {
        const pages: Page<T>[] = new Array(offsets.length)
        let next = 0

        const worker = async () => {
            while (next < offsets.length) {
                const index = next++
                pages[index] = await requestPage(offsets[index]!)
            }
        }

        const workerCount = Math.min(MAX_CONCURRENT_PAGE_REQUESTS, offsets.length)
        await Promise.all(Array.from({ length: workerCount }, worker))

        return pages
    }

    function fetchAllFacilities(): Promise<Facility[]> {
        return fetchAllPages(async offset => {
            const filtersInput = {
                limit: FACILITY_PAGE_SIZE,
                offset
            } satisfies FacilitySearchFilters

            const response = await graphQLClientRequestWithRetry<{
                facilities: Facility[]
                facilitiesTotalCount: number
            }>(
                gqlClient.request.bind(gqlClient),
                searchFacilitiesPageQuery,
                { filters: filtersInput, countFilters: {} satisfies FacilitySearchFilters },
                PUBLIC_REQUEST_OPTIONS
            )

            if (response.hasErrors) {
                throw new Error(response.errors.map(error => error.message).join('; ') || 'facilities request failed')
            }

            return {
                rows: response.data.facilities ?? [],
                totalCount: response.data.facilitiesTotalCount ?? response.data.facilities?.length ?? 0
            }
        })
    }

    function fetchAllProfessionals(): Promise<HealthcareProfessional[]> {
        return fetchAllPages(async offset => {
            const filtersInput = {
                limit: PROFESSIONAL_PAGE_SIZE,
                offset
            } satisfies HealthcareProfessionalSearchFilters

            const response = await graphQLClientRequestWithRetry<{
                healthcareProfessionals: HealthcareProfessional[]
                healthcareProfessionalsTotalCount: number
            }>(
                gqlClient.request.bind(gqlClient),
                searchProfessionalsPageQuery,
                { filters: filtersInput, countFilters: {} satisfies HealthcareProfessionalSearchFilters },
                PUBLIC_REQUEST_OPTIONS
            )

            if (response.hasErrors) {
                throw new Error(response.errors.map(error => error.message).join('; ') || 'professionals request failed')
            }

            return {
                rows: response.data.healthcareProfessionals ?? [],
                totalCount: response.data.healthcareProfessionalsTotalCount
                  ?? response.data.healthcareProfessionals?.length
                  ?? 0
            }
        })
    }

    return {
        // directory
        directoryStatus,
        isLoading,
        isReady,
        hasLoadError,
        loadDirectory,
        reloadDirectory,
        // filters
        selectedCity,
        selectedPrefecture,
        selectedSpecialties,
        selectedLanguages,
        filters,
        clearFilters,
        // results
        search,
        searchResultsList,
        paginatedResults,
        totalResults,
        hasMore,
        loadMore,
        // active
        activeFacilityId,
        activeFacility,
        setActiveFacility,
        clearActiveSearchResult
    }
})

const searchFacilitiesPageQuery = gql`
    query SearchFacilitiesPage($filters: FacilitySearchFilters!, $countFilters: FacilitySearchFilters!) {
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
            updatedDate
        }
        facilitiesTotalCount(filters: $countFilters)
    }
`

const searchProfessionalsPageQuery = gql`
    query SearchProfessionalsPage(
        $filters: HealthcareProfessionalSearchFilters!
        $countFilters: HealthcareProfessionalSearchFilters!
    ) {
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
            updatedDate
        }
        healthcareProfessionalsTotalCount(filters: $countFilters)
    }
`
