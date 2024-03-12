import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineStore } from 'pinia'
import { Ref, ref, watch } from 'vue'
import { Facility, FacilitySearchFilters, HealthcareProfessional, HealthcareProfessionalSearchFilters, Locale, Specialty } from '~/typedefs/gqlTypes.js'
import { useModalStore } from './modalStore'
import { useLoadingStore } from './loadingStore.js'

type searchResult = {
    professional: HealthcareProfessional,
    facilities: Facility[]
}

let searchProfessionalsVariablesRef: Ref<{
    filters: {
        limit: number;
        offset: number;
        specialties: Specialty[] | undefined;
        spokenLanguages: Locale[] | undefined;
        acceptedInsurance: undefined;
        degrees: undefined;
        names: undefined;
        orderBy: undefined;
        createdDate: undefined;
        updatedDate: undefined;
    };
} | undefined>

let searchFacilitiesVariablesRef: Ref<{
    filters: {
        limit: number;
        offset: number;
        healthcareProfessionalIds: string[];
        contact: undefined;
        createdDate: undefined;
        healthcareProfessionalName: undefined;
        nameEn: undefined;
        nameJa: undefined;
        orderBy: undefined;
        updatedDate: undefined;
    };
} | undefined>

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<string | undefined> = ref()
    const activeResult: Ref<searchResult | undefined> = ref()
    const searchResultsList: Ref<searchResult[]> = ref([])

    const searchCity: Ref<string | undefined> = ref()
    const searchSpecialty: Ref<Specialty | undefined> = ref()
    const searchLanguage: Ref<Locale | undefined> = ref()

    function search(selectedSearchCity?: string, selectedSearchSpecialty?: Specialty, selectedSearchLanguage?: Locale) {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        searchCity.value = selectedSearchCity
        searchSpecialty.value = selectedSearchSpecialty
        searchLanguage.value = selectedSearchLanguage

        //if we have already fetched data once, to trigger a new query, we can just update the query variables ref. This will trigger the watch function again
        if (searchProfessionalsVariablesRef && searchProfessionalsVariablesRef.value) {
            console.log('refetching professionals')
            searchProfessionalsVariablesRef.value.filters = {
                ...searchProfessionalsVariablesRef?.value?.filters,
                specialties: searchSpecialty.value ? [searchSpecialty.value] : undefined,
                spokenLanguages: searchLanguage.value ? [searchLanguage.value] : undefined
            }

            return
        }

        const professionalsRef = searchProfessionals(searchSpecialty.value, searchLanguage.value)

        //this is the async callback that will be called when the query is done (no async/await)
        watch(professionalsRef, professionalsSearchResult => {
            console.log(`Fetched professionals: ${JSON.stringify(professionalsSearchResult)}`)

            const professionalIds = professionalsSearchResult?.healthcareProfessionals?.map(professional => professional.id) ?? []

            //if we have already fetched data once, to trigger a new query, we can just update the query variables ref. This will trigger the watch function again
            if (searchFacilitiesVariablesRef && searchFacilitiesVariablesRef.value) {
                console.log('refetching facilities')
                searchFacilitiesVariablesRef.value.filters.healthcareProfessionalIds = professionalIds
                return
            }

            //get the facilities that match the professionals we found
            const facilitiesRef = searchFacilities(professionalIds)

            watch(facilitiesRef, facilitiesSearchResults => {
                console.log(`Fetched facilities: ${JSON.stringify(facilitiesSearchResults)}`)

                const searchResults = professionalsSearchResult?.healthcareProfessionals?.map(professional => {
                    const matchingFacilities = facilitiesSearchResults?.facilities?.filter(facility => facility.healthcareProfessionalIds.includes(professional.id)) ?? []

                    return { professional, facilities: matchingFacilities } satisfies searchResult
                })

                //filter the search results by location if a location is selected
                const locationFilteredSearchResults = searchCity.value
                    ? searchResults?.filter(item =>
                        item.facilities.some(facility =>
                            facility.contact?.address.cityEn === searchCity.value || facility.contact?.address.cityJa === searchCity.value))
                    : searchResults

                searchResultsList.value = locationFilteredSearchResults

                loadingStore.setIsLoading(false)
            })
        })
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


function searchProfessionals(searchSpecialty?: Specialty, searchLanguage?: Locale) {
    const loadingStore = useLoadingStore()

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
    const { result, loading, error, variables } = useQuery(searchProfessionalsQuery, searchProfessionalsData, { fetchPolicy: 'no-cache' })

    searchProfessionalsVariablesRef = variables

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, () => {
        loadingStore.setIsLoading(false)
        console.log(`Error getting professionals: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })

    return result as Ref<{ healthcareProfessionals: HealthcareProfessional[] }>
}

function searchFacilities(healthcareProfessionalIds: string[]) {
    //TODO: add search by location
    const searchFacilitiesData = ref({
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
    })

    console.log('searching facilities')
    const { result, loading, error, variables } = useQuery(searchFacilitiesQuery, searchFacilitiesData, { fetchPolicy: 'no-cache' })

    searchFacilitiesVariablesRef = variables

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, () => {
        console.log(`Error getting facilities: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })

    return result as Ref<{ facilities: Facility[] }>
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
