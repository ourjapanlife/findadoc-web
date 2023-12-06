import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineStore } from 'pinia'
import { Ref, ref, watch } from 'vue'
import { Facility, FacilitySearchFilters, HealthcareProfessional, HealthcareProfessionalSearchFilters, Locale, Specialty } from '~/typedefs/gqlTypes.js'
import { useModalStore } from './modalStore'
import { useLoadingStore } from './loadingStore.js'
import { useReadQuery } from '@apollo/client'

type searchResult = {
    professional: HealthcareProfessional,
    facilities: Facility[]
}

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<String | undefined> = ref()
    const activeResult: Ref<searchResult | undefined> = ref()
    const searchResultsList: Ref<searchResult[]> = ref([])

    let refetchProfessionalsHandle: () => void
    let refetchFacilitiesHandle: () => void

    function search(searchCity?: string, searchSpecialty?: Specialty, searchLanguage?: Locale) {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        const { professionalsRef, refetchProfessionals } = searchProfessionals(searchSpecialty, searchLanguage)

        refetchProfessionalsHandle = refetchProfessionals

        //this is the async callback that will be called when the query is done (no async/await)
        watch(professionalsRef, professionalsSearchResult => {
            console.log(`Fetched professionals: ${JSON.stringify(professionalsSearchResult)}`)

            const filteredSpecialtyProfessionals = searchSpecialty
                ? professionalsSearchResult.healthcareProfessionals?.filter(professional => professional.specialties.includes(searchSpecialty as Specialty))
                : professionalsSearchResult.healthcareProfessionals

            const professionalIds = filteredSpecialtyProfessionals?.map(professional => professional.id) ?? []

            const { facilitiesRef, refetchFacilities } = searchFacilities(professionalIds, searchCity)

            watch(facilitiesRef, facilitiesSearchResults => {
                console.log(`Fetched facilities: ${JSON.stringify(facilitiesSearchResults)}`)

                const searchResults = filteredSpecialtyProfessionals?.map(professional => {
                    const matchingFacilities = facilitiesSearchResults.facilities?.filter(facility => facility.healthcareProfessionalIds.includes(professional.id))
                    return { professional, facilities: matchingFacilities } satisfies searchResult
                })

                //filter the search results by location if a location is selected (and not the default '----Any----' value)
                const locationFilteredSearchResults = searchCity
                    ? searchResults?.filter(item =>
                        item.facilities.some(facility =>
                            facility.contact?.address.cityEn === searchCity || facility.contact?.address.cityJa === searchCity))
                    : searchResults

                searchResultsList.value = locationFilteredSearchResults

            })

            refetchFacilitiesHandle = refetchFacilities
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

 function searchProfessionals(searchSpecialty?: Specialty, searchLanguage?: Locale) {
    const loadingStore = useLoadingStore()

    const searchProfessionalsData = {
        filters: {
            limit: 100,
            offset: 0,
            // we can't do more than 1 array contains filter in a single query, so we have to do this on the client side
            // specialties: searchSpecialty ? [searchSpecialty] : undefined,
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
    const { result, loading, error, refetch } = useQuery(searchProfessionalsQuery, searchProfessionalsData)

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, (newValue) => {
        loadingStore.setIsLoading(false)
        console.log(`Error getting professionals: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })

    return { professionalsRef: result as Ref<{ healthcareProfessionals: HealthcareProfessional[] }>, refetchProfessionals: refetch }
}

function searchFacilities(healthcareProfessionalIds: string[], searchLocation?: string) {
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
    const { result, loading, error, refetch } = useQuery(searchFacilitiesQuery, searchFacilitiesData)

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

    return { facilitiesRef: result as Ref<{ facilities: Facility[] }>, refetchFacilities: refetch }
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
