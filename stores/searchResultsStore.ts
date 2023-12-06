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

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<String | undefined> = ref()
    const activeResult: Ref<searchResult | undefined> = ref()
    const searchResultsList: Ref<searchResult[]> = ref([])

    function search(searchCity?: string, searchSpecialty?: Specialty, searchLanguage?: Locale) {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        const professionalsRef = searchProfessionals(searchSpecialty, searchLanguage)

        //this is the async callback that will be called when the query is done (no async/await)
        watch(professionalsRef, professionalsSearchResult => {
            console.log(`Fetched professionals: ${JSON.stringify(professionalsSearchResult)}`)

            const professionalIds = professionalsSearchResult?.map(professional => professional.id) ?? []

            const facilitiesRef = searchFacilities(professionalIds, searchCity)

            watch(facilitiesRef, facilitiesSearchResults => {
                console.log(`Fetched facilities: ${JSON.stringify(facilitiesSearchResults)}`)

                const searchResults = professionalsSearchResult.map(professional => {
                    const matchingFacilities = facilitiesSearchResults.filter(facility => facility.healthcareProfessionalIds.includes(professional.id))
                    return { professional, facilities: matchingFacilities } satisfies searchResult
                })

                const locationFilteredSearchResults = searchCity
                    ? searchResults?.filter(item =>
                        item.facilities.some(facility =>
                            facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity))
                    : searchResults

                searchResultsList.value = locationFilteredSearchResults
            })
        })
    }

    function setActiveSearchResult(selectedResultId: String) {
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

function searchProfessionals(searchSpecialty?: Specialty, searchLanguage?: Locale): Ref<HealthcareProfessional[]> {
    const searchProfessionalsData = {
        input: {
            filters: {
                limit: 100,
                offset: 0,
                specialties: searchSpecialty ? [searchSpecialty] : undefined,
                spokenLanguages: searchLanguage ? [searchLanguage] : undefined,
            } satisfies HealthcareProfessionalSearchFilters
        }
    }

    const { result, loading, error } = useQuery(searchProfessionalsQuery, searchProfessionalsData)

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, (newValue) => {
        console.log(`Error getting professionals: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })


    return result
}

function searchFacilities(healthcareProfessionalIds: string[], searchLocation?: string): Ref<Facility[]> {
    //TODO: add search by location
    const searchFacilitiesData = {
        input: {
            filters: {
                limit: 100,
                offset: 0,
                healthcareProfessionalIds: healthcareProfessionalIds
            } satisfies FacilitySearchFilters
        }
    }

    const { result, loading, error } = useQuery(searchFacilitiesQuery, searchFacilitiesData)

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, (newValue) => {
        console.log(`Error getting facilities: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })

    return result
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
        degrees {
            nameJa
            nameEn
            abbreviation
        }
        specialties {
            names {
                name
                locale
            }
        }
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
      healthcareProfessionalIds
      contact {
        address {
          addressLine1En
          addressLine2En
          addressLine1Ja
          cityJa
          cityEn
        }
        email
        googleMapsUrl
        phone
        website
      }
    }
  }
  `
