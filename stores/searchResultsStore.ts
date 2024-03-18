import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Facility, FacilitySearchFilters, HealthcareProfessional, HealthcareProfessionalSearchFilters, Locale, Specialty } from '~/typedefs/gqlTypes.js'
import { useModalStore } from './modalStore'
import { useLoadingStore } from './loadingStore.js'
import { gqlClient } from '../utils/graphql.js'

type SearchResult = {
    professional: HealthcareProfessional,
    facilities: Facility[]
}

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<string | undefined> = ref()
    const activeResult: Ref<SearchResult | undefined> = ref()
    const searchResultsList: Ref<SearchResult[]> = ref([])

    const searchCity: Ref<string | undefined> = ref()
    const searchSpecialty: Ref<Specialty | undefined> = ref()
    const searchLanguage: Ref<Locale | undefined> = ref()

    async function search(selectedSearchCity?: string, selectedSearchSpecialty?: Specialty, selectedSearchLanguage?: Locale) {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        //set the state variables
        searchCity.value = selectedSearchCity
        searchSpecialty.value = selectedSearchSpecialty
        searchLanguage.value = selectedSearchLanguage

        const professionalsSearchResults = await queryProfessionals(searchSpecialty.value, searchLanguage.value)

        const professionalIds = professionalsSearchResults.map(professional => professional.id)

        //get the facilities that match the professionals we found
        const facilitiesSearchResults = await queryFacilities(professionalIds, searchCity.value)

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

    return { activeResultId, activeResult, searchResultsList, search, setActiveSearchResult, clearActiveSearchResult }
})


async function queryProfessionals(searchSpecialty?: Specialty, searchLanguage?: Locale): Promise<HealthcareProfessional[]> {
    try {
        const searchProfessionalsData = {
            filters: {
                limit: 100,
                offset: 0,
                specialties: searchSpecialty ? [searchSpecialty] : undefined,
                spokenLanguages: searchLanguage ? [searchLanguage] : undefined,
                acceptedInsurance: undefined,
                degrees: undefined,
                names: undefined,
                orderBy: undefined,
                createdDate: undefined,
                updatedDate: undefined
            } satisfies HealthcareProfessionalSearchFilters
        }

        console.log('searching professionals')
        const response = await gqlClient.request<{ healthcareProfessionals: HealthcareProfessional[] }>(searchProfessionalsQuery, searchProfessionalsData)
        console.log(`Fetched professionals: ${JSON.stringify(response)}`)

        const professionalsSearchResult = (response?.healthcareProfessionals ?? []) as HealthcareProfessional[]
        return professionalsSearchResult
    } catch (error) {
        console.log(`Error getting professionals: ${JSON.stringify(error)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
        return []
    }
}

async function queryFacilities(healthcareProfessionalIds: string[], searchCity?: string): Promise<Facility[]> {
    try {
        //TODO: add search by location
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

        console.log('searching facilities')
        const response = await gqlClient.request<{ facilities: Facility[] }>(searchFacilitiesQuery, searchFacilitiesData)
        console.log(`Fetched facilities: ${JSON.stringify(response)}`)
        const facilitiesSearchResults = (response?.facilities ?? []) as Facility[]

        //filter the search results by location if a location is selected
        const locationFilteredSearchResults = searchCity
            ? facilitiesSearchResults.filter(facility =>
                facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity)
            : facilitiesSearchResults

        return locationFilteredSearchResults
    } catch (error) {
        console.log(`Error getting facilities: ${JSON.stringify(error)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
        return []
    }
}


const searchProfessionalsQuery = gql`query searchHealthcareProfessionals($filters: HealthcareProfessionalSearchFilters!) {
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
        createdDate
        updatedDate
    }
}`

const searchFacilitiesQuery = gql`query QueryFacilities($filters: FacilitySearchFilters!) {
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
