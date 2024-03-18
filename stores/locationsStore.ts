import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Facility, FacilitySearchFilters, Locale } from '~/typedefs/gqlTypes.js'
import { useLoadingStore } from './loadingStore.js'
import { useLocaleStore } from './localeStore.js'
import { gqlClient } from '../utils/graphql.js'

export const useLocationsStore = defineStore('locationsStore', () => {
    const citiesDisplayOptions: Ref<string[]> = ref([])

    async function fetchLocations() {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)
        citiesDisplayOptions.value = ['Loading...']

        //this is the async callback that will be called when the query is done (no async/await)
        const facilitiesSearchResults = await queryFacilities()
        console.log(`Fetched facilities: ${JSON.stringify(facilitiesSearchResults)}`)

        const allCitiesEnglishList = facilitiesSearchResults.map(facility => facility.contact?.address.cityEn)
        const allCitiesJapaneseList = facilitiesSearchResults.map(facility => facility.contact?.address.cityJa)

        const localeStore = useLocaleStore()
        //we want to have an empty display value for dropdowns, so we add an empty string to the list
        citiesDisplayOptions.value = localeStore.locale.code === Locale.EnUs
            ? ['----Any----', ...allCitiesEnglishList]
            : ['----Any----', ...allCitiesJapaneseList]

        //set the loading visual state back to normal
        loadingStore.setIsLoading(false)
    }

    return { citiesDisplayOptions, fetchLocations }
})

async function queryFacilities(): Promise<Facility[]> {
    try {
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

        const result = await gqlClient.request<{ facilities: Facility[] }>(searchFacilitiesQuery, searchFacilitiesData)
        return result?.facilities ?? []
    } catch (error) {
        console.log(`Error getting facilities for dropdown: ${JSON.stringify(error)}`)
        alert(`Error getting data! Please contact our support team by clicking the bottom right link on the page!`)
        return []
    }
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
