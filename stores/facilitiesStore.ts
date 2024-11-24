import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { Facility, MutationDeleteFacilityArgs, MutationUpdateFacilityArgs } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import { graphql } from '~/typedefs/client'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])
        const selectedFacilityId: Ref<string> = ref('')
        const selectedFacilityData: Ref<Facility | undefined> = ref()
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
            mapLongitude: ref('') as Ref<string>,
            healthcareProfessionalIds: ref([]) as Ref<string[]>
        } as { [key: string]: Ref }

        function setSelectedFacilityData(facilityId: string) {
            selectedFacilityData.value = facilityData.value
                .find((facility: Facility) => facility.id === facilityId)
        }

        function initializeFacilitySectionValues(facilityData: Facility | undefined) {
            if (!facilityData) return

            facilitySectionFields.nameEn.value = facilityData.nameEn
            facilitySectionFields.nameJa.value = facilityData.nameJa
            facilitySectionFields.phone.value = facilityData?.contact?.phone
            facilitySectionFields.email.value = facilityData?.contact?.email
            facilitySectionFields.website.value = facilityData?.contact?.website
            facilitySectionFields.postalCode.value = facilityData.contact?.address.postalCode
            facilitySectionFields.prefectureEn.value = facilityData?.contact?.address?.prefectureEn
            facilitySectionFields.cityEn.value = facilityData?.contact?.address?.cityEn
            facilitySectionFields.addressLine1En.value = facilityData?.contact?.address?.addressLine1En
            facilitySectionFields.addressLine2En.value = facilityData?.contact?.address?.addressLine2En
            facilitySectionFields.prefectureJa.value = facilityData?.contact?.address?.prefectureJa
            facilitySectionFields.cityJa.value = facilityData?.contact?.address?.cityJa
            facilitySectionFields.addressLine1Ja.value = facilityData?.contact?.address?.addressLine1Ja
            facilitySectionFields.addressLine2Ja.value = facilityData?.contact?.address?.addressLine2Ja
            facilitySectionFields.googlemapsURL.value = facilityData?.contact?.googleMapsUrl
            facilitySectionFields.healthcareProfessionalIds.value = facilityData.healthcareProfessionalIds
            facilitySectionFields.mapLatitude.value = facilityData.mapLatitude.toString()
            facilitySectionFields.mapLongitude.value = facilityData.mapLongitude.toString()
        }

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
            facilitySectionFields,
            selectedFacilityId,
            deleteFacility,
            selectedFacilityData,
            setSelectedFacilityData,
            initializeFacilitySectionValues
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
        console.error(`Error querying the facilities: ${JSON.stringify(error)}`)
        return []
    }
}

const getAllFacilitiesForModeration = graphql(`
query GetAllFacilities($filters: FacilitySearchFilters!) {
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
}`)

const updateExistingFacilityGqlMutation = graphql(`
mutation UpdateFacility($updateFacilityId: ID!, $input: UpdateFacilityInput!) {
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
}`)

const deleteExistingFacilityGqlMutation = graphql(`
mutation DeleteFacility($deleteFacilityId: ID!) {
    deleteFacility(id: $deleteFacilityId) {
        isSuccessful
    }
}`)
