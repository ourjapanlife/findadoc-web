import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { useLoadingStore } from './loadingStore.js'
import type { Locale,
    Specialty,
    Facility,
    FacilitySearchFilters,
    HealthcareProfessional,
    HealthcareProfessionalSearchFilters } from '~/typedefs/gqlTypes.js'

type FacilitySearchResult = Facility & {
    healthcareProfessionals: HealthcareProfessional[]
}

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeFacilityId: Ref<string | undefined> = ref()
    const activeFacility: Ref<FacilitySearchResult | undefined> = ref()
    const activeProfessional: Ref<HealthcareProfessional | undefined> = ref()
    const searchResultsList: Ref<FacilitySearchResult[]> = ref([])
    const totalResults = ref(0)

    const selectedCity: Ref<string | undefined> = ref()
    const selectedSpecialties: Ref<Specialty[] | undefined> = ref()
    const selectedLanguages: Ref<Locale[] | undefined> = ref()

    async function search() {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        const professionalsSearchResults = await queryProfessionals(selectedSpecialties.value ?? [],
                                                                    selectedLanguages.value ?? [])

        const professionalIds = professionalsSearchResults.map(professional => professional.id)

        //get the facilities that match the professionals we found
        const facilitiesSearchResults = await queryFacilities(professionalIds, selectedCity.value)

        //combine the professionals and facilities into a single search result
        //then filter out any results that don't have any facilities
        const combinedResults = facilitiesSearchResults.flatMap(facilityResult => {
            const associatedProfessionals = professionalsSearchResults.filter(professionalResult =>
                professionalResult.facilityIds.includes(facilityResult.id))

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
        searchResultsList.value = combinedResults
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

    return {
        activeFacilityId,
        activeFacility,
        activeProfessional,
        searchResultsList,
        search,
        setActiveFacility,
        setActiveProfessional,
        clearActiveSearchResult,
        selectedCity,
        selectedSpecialties,
        selectedLanguages,
        totalResults
    }
})

async function queryProfessionals(searchSpecialties: Specialty[], searchLanguages: Locale[]):
Promise<HealthcareProfessional[]> {
    try {
        const searchProfessionalsData = {
            filters: {
                limit: 1000,
                offset: 0,
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

        const professionalsSearchResult = serverResponse.data.healthcareProfessionals ?? []
        return professionalsSearchResult
    } catch (error) {
        console.error(useNuxtApp().$i18n.t('searchResultsErrors.gettingProfessionals'), ` ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert(useNuxtApp().$i18n.t('searchResultsErrors.gettingData'))
        return []
    }
}

async function queryFacilities(healthcareProfessionalIds: string[], searchCity?: string): Promise<Facility[]> {
    try {
        const searchFacilitiesData = {
            filters: {
                limit: 1000,
                offset: 0,
                healthcareProfessionalIds: healthcareProfessionalIds,
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

        const facilitiesSearchResults = serverResponse.data.facilities ?? []

        const locationFilteredSearchResults = searchCity
            ? facilitiesSearchResults.filter(facility =>
                facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity)
            : facilitiesSearchResults

        return locationFilteredSearchResults
    } catch (error) {
        console.error(useNuxtApp().$i18n.t('searchResultsErrors.gettingFacilities'), `${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert(useNuxtApp().$i18n.t('searchResultsErrors.gettingData'))
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
