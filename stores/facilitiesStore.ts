import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { Facility } from '~/typedefs/gqlTypes'
import { gqlClient } from '~/utils/graphql'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])

        async function getFacilities() {
            const facilityResults = await queryFacilities()
            facilityData.value = facilityResults
        }

        return {
            getFacilities,
            facilityData
        }
    }
)

async function queryFacilities() {
    const searchFacilitiesData = {
        filters: {
            limit: 400
        }
    }
    try {
        const response = await gqlClient.request<{ facilities: Facility[] }>(getAllFacilitiesForModeration, searchFacilitiesData)
        return response?.facilities ?? []
    } catch (error) {
        console.log(`Error querying the submissions: ${JSON.stringify(error)}`)
        return []
    }
}

const getAllFacilitiesForModeration = gql`
query Facilities($filters: FacilitySearchFilters!) {
    facilities(filters: $filters) {
        id
        nameEn
        nameJa
        contact {
            googleMapsUrl
            email
            phone
            website
            address {
                postalCode
                prefectureEn
                cityEn
                addressLine1En
                addressLine2En
                prefectureJa
                cityJa
                addressLine1Ja
                addressLine2Ja
            }
        }
        mapLatitude
        mapLongitude
        healthcareProfessionalIds
        createdDate
        updatedDate
    }
}
`
