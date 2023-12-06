import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineStore } from 'pinia'
import { Ref, ref, watch } from 'vue'
import { Facility, FacilitySearchFilters, Locale } from '~/typedefs/gqlTypes.js'
import { useLoadingStore } from './loadingStore.js'
import { useLocaleStore } from './localeStore.js'

export const useLocationsStore = defineStore('locationsStore', () => {
    const citiesDisplayOptions: Ref<string[]> = ref([])

    function fetchLocations() {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        //this is the async callback that will be called when the query is done (no async/await)
        const facilitiesRef = searchFacilities(citiesDisplayOptions)

        watch(facilitiesRef, facilitiesSearchResults => {
            console.log(`Fetched facilities: ${JSON.stringify(facilitiesSearchResults)}`)

            const searchResults = facilitiesSearchResults.facilities
            const allCitiesEnglishList = searchResults.map(facility => facility.contact?.address.cityEn)
            const allCitiesJapaneseList = searchResults.map(facility => facility.contact?.address.cityJa)

            const localeStore = useLocaleStore()
            //we want to have an empty display value for dropdowns, so we add an empty string to the list
            citiesDisplayOptions.value = localeStore.locale.code === Locale.EnUs
                ? ['----Any----', ...allCitiesEnglishList]
                : ['----Any----', ...allCitiesJapaneseList]
        })
    }

    return { citiesDisplayOptions, fetchLocations }
})

function searchFacilities(citiesDisplayOptions: Ref<string[]>): Ref<{ facilities: Facility[] }> {
    const loadingStore = useLoadingStore()

    const searchFacilitiesData = {
        filters: {
            limit: 1000,
            offset: 0,
            contact: undefined,
            createdDate: undefined,
            healthcareProfessionalIds: undefined,
            healthcareProfessionalName: undefined,
            nameEn: undefined,
            nameJa: undefined,
            orderBy: undefined,
            updatedDate: undefined,
        } satisfies FacilitySearchFilters
    }

    citiesDisplayOptions.value = ['Loading...']

    const { result, loading, error } = useQuery(searchFacilitiesQuery, searchFacilitiesData)

    //we want to set the app to a loading state while querying. This value is reactive
    watch(loading, (newValue) => {
        loadingStore.setIsLoading(newValue)
    })

    //we want to show an error message if the query fails. This value is reactive
    watch(error, (newValue) => {
        loadingStore.setIsLoading(false)
        console.log(`Error getting facilities: ${JSON.stringify(error.value)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
    })

    return result as Ref<{ facilities: Facility[] }>
}

const searchFacilitiesQuery = gql`query QueryFacilities($filters: FacilitySearchFilters!) {
    facilities(filters: $filters) {
      id
      contact {
        address {
          cityJa
          cityEn
        }
      }
    }
  }
  `
