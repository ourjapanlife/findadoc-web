import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { useModalStore } from './modalStore'
import { useLoadingStore } from './loadingStore.js'
import type { Locale,
    Specialty,
    Facility,
    FacilitySearchFilters,
    HealthcareProfessional,
    HealthcareProfessionalSearchFilters } from '~/typedefs/gqlTypes.js'

type SearchResult = {
    professional: HealthcareProfessional
    facilities: Facility[]
}

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<string | undefined> = ref()
    const activeResult: Ref<SearchResult | undefined> = ref()
    const searchResultsList: Ref<SearchResult[]> = ref([])

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
        const combinedResults = professionalsSearchResults.map(professional => {
            const matchingFacilities = facilitiesSearchResults?.filter(facility =>
                facility.healthcareProfessionalIds.includes(professional.id)) ?? []

            return { professional, facilities: matchingFacilities } satisfies SearchResult
        }).filter(result => result.facilities.length > 0) satisfies SearchResult[]

        //update the state with the new results
        searchResultsList.value = combinedResults

        //set the loading visual state back to normal
        loadingStore.setIsLoading(false)
    }

    function setActiveSearchResult(selectedResultId: string) {
        const newResult = searchResultsList.value.find(resultItem => resultItem.professional.id === selectedResultId)

        activeResult.value = newResult
        activeResultId.value = newResult?.professional.id

        //show the search result details in a modal
        useModalStore().showModal()
    }

    function clearActiveSearchResult() {
        activeResultId.value = undefined
    }

    return {
        activeResultId,
        activeResult,
        searchResultsList,
        search,
        setActiveSearchResult,
        clearActiveSearchResult,
        selectedCity,
        selectedSpecialties,
        selectedLanguages
    }
})

async function queryProfessionals(searchSpecialties: Specialty[], searchLanguages: Locale[]):
Promise<HealthcareProfessional[]> {
    try {
        const searchProfessionalsData = {
            filters: {
                limit: 100,
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

        const serverResponse = await graphQLClientRequestWithRetry<{
            healthcareProfessionals: {
                healthcareProfessionals: HealthcareProfessional[]
                totalCount: number
            }
        }>(
            gqlClient.request.bind(gqlClient),
            searchProfessionalsQuery,
            searchProfessionalsData
        )

        const professionalsSearchResult = serverResponse.data?.healthcareProfessionals?.healthcareProfessionals ?? []
        return professionalsSearchResult
    } catch (error) {
        console.error(`Error getting professionals: ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert('Error getting data! Please contact our support team by clicking the bottom right link on the page!')
        return []
    }
}

async function queryFacilities(healthcareProfessionalIds: string[], searchCity?: string): Promise<Facility[]> {
    try {
        const searchFacilitiesData = {
            filters: {
                limit: 100,
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

        const serverResponse = await graphQLClientRequestWithRetry<{
            facilities: {
                facilities: Facility[]
                totalCount: number
            }
        }>(
            gqlClient.request.bind(gqlClient),
            searchFacilitiesQuery,
            searchFacilitiesData
        )

        const facilitiesSearchResults = serverResponse.data.facilities.facilities ?? []

        const locationFilteredSearchResults = searchCity
            ? facilitiesSearchResults.filter(facility =>
                facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity)
            : facilitiesSearchResults

        return locationFilteredSearchResults
    } catch (error) {
        console.error(`Error getting facilities: ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert('Error getting data! Please contact our support team by clicking the bottom right link on the page!')
        return []
    }
}

const searchProfessionalsQuery = gql`
  query searchHealthcareProfessionals($filters: HealthcareProfessionalSearchFilters!) {
    healthcareProfessionals(filters: $filters) {
      healthcareProfessionals {
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
      totalCount
    }
  }
`

const searchFacilitiesQuery = gql`
  query QueryFacilities($filters: FacilitySearchFilters!) {
    facilities(filters: $filters) {
      facilities {
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
      totalCount
    }
  }
`
