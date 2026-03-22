import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { gqlClient } from '../utils/graphql.js'
import { useLoadingStore } from './loadingStore.js'
import { handleServerErrorMessaging } from '#imports'
import { useTranslation } from '~/composables/useTranslation.js'
import type { Locale,
    Specialty,
    Facility,
    FacilitySearchFilters,
    HealthcareProfessional,
    HealthcareProfessionalSearchFilters } from '~/typedefs/gqlTypes.js'

type FacilitySearchResult = Facility & {
    healthcareProfessionals: HealthcareProfessional[]
}
const toast = useToast()

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeFacilityId: Ref<string | undefined> = ref()
    const activeFacility: Ref<FacilitySearchResult | undefined> = ref()
    const activeProfessional: Ref<HealthcareProfessional | undefined> = ref()
    const searchResultsList: Ref<FacilitySearchResult[]> = ref([])
    const totalResults = ref(0)

    const selectedCity: Ref<string | undefined> = ref()
    const selectedSpecialties: Ref<Specialty[] | undefined> = ref()
    const selectedLanguages: Ref<Locale[] | undefined> = ref()

    const currentPage = ref(1)
    const itemsPerPage = 25

    const FETCH_BATCH_SIZE = 100

    const allMapPoints = ref<Array<{
        id: string
        nameEn: string
        nameJa: string
        mapLatitude: number
        mapLongitude: number
    }>>([])

    const paginatedResults = computed(() => {
        const endIndex = currentPage.value * itemsPerPage
        return searchResultsList.value.slice(0, endIndex)
    })

    const hasMore = computed(() => (itemsPerPage * currentPage.value) < totalResults.value)

    function loadMore() {
        if (hasMore.value) {
            currentPage.value++
        }
    }

    async function fetchAllFacilities(
        searchCity?: string,
        healthcareProfessionalIDs?: string[]
    ): Promise<Facility[]> {
        const allFacilities: Facility[] = []
        const batchSize = FETCH_BATCH_SIZE
        let offset = 0
        let hasMoreBatches = true

        while (hasMoreBatches) {
            const batch = await queryFacilities(searchCity, healthcareProfessionalIDs, batchSize, offset)

            allFacilities.push(...batch)

            // If we got less than batchSize, we've reached the end
            hasMoreBatches = batch.length === batchSize
            offset += batchSize
        }

        return allFacilities
    }

    // We have the numbers of HelathcareProfessional on runtime
    // Becuase fetchAllFacilities also cointain number of healthcareProfessional
    // Use Promise.all for work in parallel
    async function fetchAllProfessionals(
    searchSpecialties: Specialty[],
    searchLanguages: Locale[],
    professionalIDs: string[]
    ): Promise<HealthcareProfessional[]> {
        if (professionalIDs.length === 0) {
            return []
        }

        const batchSize = FETCH_BATCH_SIZE
        // Calculate number of batches
        const batchCount = Math.ceil(professionalIDs.length / batchSize)
        const batchIndices = Array.from({ length: batchCount }, (_, i) => i)
        // Fetch all batches in PARALLEL
        const batches = await Promise.all(
            batchIndices.map(async batchIndex => {
                const start = batchIndex * batchSize
                const batchIds = professionalIDs.slice(start, start + batchSize)
                return queryProfessionals(searchSpecialties, searchLanguages, batchIds)
            })
        )
        return batches.flat()
    }

    async function search() {
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        // Fetch lightweight map points FIRST
        const mapPointsResult = await graphQLClientRequestWithRetry<{
            facilities: Array<{
                id: string
                nameEn: string
                nameJa: string
                mapLatitude: number
                mapLongitude: number
            }>
        }>(
            gqlClient.request.bind(gqlClient),
            mapPointsQuery,
            { filters: { limit: 1000 } }
        )

        allMapPoints.value = mapPointsResult.data.facilities ?? []

        // Fetch ALL facilities using automatic pagination
        const facilitiesSearchResults = await fetchAllFacilities(selectedCity.value)

        // Extract all unique professional IDs
        const allProfessionalIds = facilitiesSearchResults
            .map(facility => facility.healthcareProfessionalIds)
            .flat()

        const uniqueProfessionalIds = [...new Set(allProfessionalIds)]

        // Fetch ALL professionals using automatic batching
        const professionalsSearchResults = await fetchAllProfessionals(
            selectedSpecialties.value ?? [],
            selectedLanguages.value ?? [],
            uniqueProfessionalIds
        )

        // Combine the professionals and facilities into a single search result
        // Filter out any facilities that don't have any matching professionals
        const combinedResults = facilitiesSearchResults.flatMap(facilityResult => {
            const associatedProfessionals = professionalsSearchResults.filter(professionalResult =>
                facilityResult.healthcareProfessionalIds.includes(professionalResult.id))

            return associatedProfessionals.length
                ? [{
                    ...facilityResult,
                    healthcareProfessionals: associatedProfessionals
                }]
                : []
        })

        // Clear any active result when new search results are loaded
        clearActiveSearchResult()

        currentPage.value = 1

        // Update the state with the new results
        searchResultsList.value = combinedResults
        totalResults.value = combinedResults.length

        loadingStore.setIsLoading(false)
    }

    function setActiveFacility(facilityId: string) {
        const newFacility = searchResultsList.value.find(facilityItem => facilityItem.id === facilityId)

        activeFacility.value = newFacility
        activeFacilityId.value = newFacility?.id

        activeProfessional.value = undefined
    }

    function setActiveProfessional(professionalId: string) {
        if (!activeFacility.value) return

        const newProfessional = activeFacility.value.healthcareProfessionals.find(
            professional => professional.id === professionalId
        )

        activeProfessional.value = newProfessional
    }

    function clearActiveSearchResult() {
        activeFacilityId.value = undefined
        activeFacility.value = undefined
        activeProfessional.value = undefined
    }

    function clearActiveProfessional() {
        activeProfessional.value = undefined
    }

    return {
        activeFacilityId,
        activeFacility,
        activeProfessional,
        searchResultsList,
        paginatedResults,
        allMapPoints,
        search,
        setActiveFacility,
        setActiveProfessional,
        clearActiveSearchResult,
        clearActiveProfessional,
        selectedCity,
        selectedSpecialties,
        selectedLanguages,
        totalResults,
        loadMore,
        hasMore
    }
})

async function queryProfessionals(
    searchSpecialties: Specialty[],
    searchLanguages: Locale[],
    professionalIDs?: string[]
): Promise<HealthcareProfessional[]> {
    try {
        const searchProfessionalsData = {
            filters: {
                limit: 1000,
                offset: 0,
                ids: professionalIDs ?? undefined,
                specialties: searchSpecialties,
                spokenLanguages: searchLanguages,
                acceptedInsurance: undefined,
                degrees: undefined,
                names: undefined,
                orderBy: undefined,
                createdDate: undefined,
                updatedDate: undefined
            } satisfies HealthcareProfessionalSearchFilters
        }

        const serverResponse = await graphQLClientRequestWithRetry<
            { healthcareProfessionals: HealthcareProfessional[] }
        >(
            gqlClient.request.bind(gqlClient),
            searchProfessionalsQuery,
            searchProfessionalsData
        )

        if (serverResponse.errors?.length) {
            handleServerErrorMessaging(serverResponse.errors, toast, useTranslation)
        }

        const professionalsSearchResult = serverResponse.data.healthcareProfessionals ?? []
        return professionalsSearchResult
    } catch (error) {
        console.error(useTranslation('searchResultsErrors.gettingProfessionals'), ` ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert(useTranslation('searchResultsErrors.gettingData'))
        return []
    }
}

async function queryFacilities(
    searchCity?: string,
    healthcareProfessionalIDs?: string[],
    limit: number = 100,
    offset: number = 0
): Promise<Facility[]> {
    try {
        const searchFacilitiesData = {
            filters: {
                limit: limit,
                offset: offset,
                healthcareProfessionalIds: healthcareProfessionalIDs ?? undefined,
                contact: undefined,
                createdDate: undefined,
                healthcareProfessionalName: undefined,
                nameEn: undefined,
                nameJa: undefined,
                orderBy: undefined,
                updatedDate: undefined
            } satisfies FacilitySearchFilters
        }

        const serverResponse = await graphQLClientRequestWithRetry<
            { facilities: Facility[] }
        >(
            gqlClient.request.bind(gqlClient),
            searchFacilitiesQuery,
            searchFacilitiesData
        )

        if (serverResponse.errors?.length) {
            handleServerErrorMessaging(serverResponse.errors, toast, useTranslation)
        }

        const facilitiesSearchResults = serverResponse.data.facilities ?? []

        const locationFilteredSearchResults = searchCity
            ? facilitiesSearchResults.filter(facility => {
                const cityEn = facility.contact.address.cityEn
                const cityJa = facility.contact.address.cityJa
                const englishMatches = cityEn.includes(searchCity) || searchCity.includes(cityEn)
                const japaneseMatches = cityJa.includes(searchCity) || searchCity.includes(cityJa)
                return englishMatches || japaneseMatches
            })
            : facilitiesSearchResults

        return locationFilteredSearchResults
    } catch (error) {
        console.error(useTranslation('searchResultsErrors.gettingFacilities'), `${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert(useTranslation('searchResultsErrors.gettingData'))
        return []
    }
}

const searchProfessionalsQuery = gql`
    query searchHealthcareProfessionals($filters: HealthcareProfessionalSearchFilters!) {
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
const mapPointsQuery = gql`
    query MapPoints($filters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            nameEn
            nameJa
            mapLatitude
            mapLongitude
        }
    }
`

const searchFacilitiesQuery = gql`
    query QueryFacilities($filters: FacilitySearchFilters!) {
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
        }
    }
`
