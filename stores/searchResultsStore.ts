import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
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
    const isPrefetchingSearchResults: Ref<boolean> = ref(false)

    async function search() {
        //set the loading visual state and not prefetching results for better ux
        const loadingStore = useLoadingStore()

        // This is for the UI to only show loading when loading for a user search. On load it prefetches on screen
        const shouldTriggerLoadingState = !isPrefetchingSearchResults.value && searchResultsList.value.length

        // deep copy orignaly searchResultsList for future comparison
        const originalSearchResultList = [...searchResultsList.value]

        if (shouldTriggerLoadingState) loadingStore.setIsLoading(true)

        //get the facilities that match the professionals we found
        const facilitiesSearchResults = await queryFacilities(selectedCity.value)

        const professionalIds = facilitiesSearchResults.map(facility => facility.healthcareProfessionalIds).flat()

        const professionalsSearchResults = await queryProfessionals(selectedSpecialties.value ?? [],
                                                                    selectedLanguages.value ?? [], professionalIds)

        //combine the professionals and facilities into a single search result
        //then filter out any results that don't have any facilities
        const combinedResults = facilitiesSearchResults.flatMap(facilityResult => {
            //check from the facility perspective as data is populated in a one-way relationship (facility -> professionals)
            const associatedProfessionals = professionalsSearchResults.filter(professionalResult =>
                facilityResult.healthcareProfessionalIds.includes(professionalResult.id))

            return associatedProfessionals.length
                ? [{
                    ...facilityResult,
                    healthcareProfessionals: associatedProfessionals
                }]
                : []
        })

        //clear any active result when new search results are loaded
        clearActiveSearchResult()

        //update the state with the new results
        if (!arraysAreEqual(searchResultsList.value, originalSearchResultList)) searchResultsList.value = combinedResults
        //update the total results count
        totalResults.value = combinedResults.length

        //set the loading visual state back to normal
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
        search,
        setActiveFacility,
        setActiveProfessional,
        clearActiveSearchResult,
        clearActiveProfessional,
        selectedCity,
        selectedSpecialties,
        selectedLanguages,
        totalResults,
        isPrefetchingSearchResults
    }
})

async function queryProfessionals(searchSpecialties: Specialty[], searchLanguages: Locale[], professionalIDs?: string[]):
Promise<HealthcareProfessional[]> {
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

async function queryFacilities(searchCity?: string, heathcareProfessinalIDs?: string[]): Promise<Facility[]> {
    try {
        const searchFacilitiesData = {
            filters: {
                limit: 1000,
                offset: 0,
                healthcareProfessionalIds: heathcareProfessinalIDs ?? undefined,
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
            ? facilitiesSearchResults.filter(facility =>
                facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity)
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
