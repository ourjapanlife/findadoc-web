import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { Facility, MutationUpdateFacilityArgs } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])
        const facilitySectionFields = {
            // contactFields
            nameEn: ref('') as Ref<string>,
            nameJa: ref('') as Ref<string>,
            phone: ref('') as Ref<string>,
            website: ref('') as Ref<string>,
            email: ref('') as Ref<string>,
            // addressesFields
            postalCode: ref('') as Ref<string>,
            prefectureEn: ref('') as Ref<string>,
            cityEn: ref('') as Ref<string>,
            addressLine1En: ref('') as Ref<string>,
            addressLine2En: ref('') as Ref<string>,
            prefectureJa: ref('') as Ref<string>,
            cityJa: ref('') as Ref<string>,
            addressLine1Ja: ref('') as Ref<string>,
            addressLine2Ja: ref('') as Ref<string>,
            // googleMapsFields
            googlemapsURL: ref('') as Ref<string>,
            mapLatitude: ref('') as Ref<string>,
            mapLongitude: ref('') as Ref<string>
        } as { [key: string]: Ref }

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

        return {
            getFacilities,
            facilityData,
            updateFacility,
            facilitySectionFields
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
