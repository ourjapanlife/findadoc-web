import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { Facility, MutationDeleteFacilityArgs, MutationUpdateFacilityArgs } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])

        async function getFacilities() {
            const facilityResults = await queryFacilities()
            facilityData.value = facilityResults
        }

        async function updateFacility(facility: MutationUpdateFacilityArgs) {
            try {
                return await graphQLClientRequestWithRetry(
                    gqlClient.request.bind(gqlClient),
                    updateExistingFacilityGqlMutation,
                    facility
                )
            } catch (error) {
                console.error('Failed to update facility:', error)
            }
        }

        async function deleteFacility(facilityId: MutationDeleteFacilityArgs) {
            try {
                return await graphQLClientRequestWithRetry(
                    gqlClient.request.bind(gqlClient),
                    deleteExistingFacilityGqlMutation,
                    facilityId
                )
            } catch (error) {
                console.error('Failed to delete facility:', error)
            }
        }

        return {
            getFacilities,
            facilityData,
            updateFacility,
            deleteFacility
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
        console.log(`Error querying the facilities: ${JSON.stringify(error)}`)
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

const updateExistingFacilityGqlMutation = gql`
mutation Mutation($updateFacilityId: ID!, $input: UpdateFacilityInput!) {
  updateFacility(id: $updateFacilityId, input: $input) {
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

const deleteExistingFacilityGqlMutation = gql`
mutation Mutation($deleteFacilityId: ID!) {
  deleteFacility(id: $deleteFacilityId) {
    isSuccessful
  }
}
`
