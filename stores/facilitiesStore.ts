import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import type { Maybe } from 'graphql/jsutils/Maybe'
import type { Facility,
    HealthcareProfessional,
    Mutation, MutationDeleteFacilityArgs, MutationUpdateFacilityArgs, Relationship } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerError, ServerResponse } from '~/typedefs/serverResponse'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])
        const selectedFacilityId: Ref<string> = ref('')
        const selectedFacilityData: Ref<Facility | undefined> = ref()
        const facilitySectionFields = reactive({
            // contactFields
            nameEn: '',
            nameJa: '',
            phone: '',
            website: '' as string | undefined,
            email: '' as string | undefined,
            // addressesFields
            postalCode: '',
            prefectureEn: '',
            cityEn: '',
            addressLine1En: '',
            addressLine2En: '',
            prefectureJa: '',
            cityJa: '',
            addressLine1Ja: '',
            addressLine2Ja: '',
            // googleMapsFields
            googlemapsURL: '',
            mapLatitude: '',
            mapLongitude: '',
            healthcareProfessionalIds: [] as string[],
            healthProfessionalsRelations: [] as Relationship[]
        })

        const healthProfessionalsRelationsForDisplay: Ref<HealthcareProfessional[]> = ref([])

        function setSelectedFacilityData(facilityId: string) {
            selectedFacilityData.value = facilityData.value
                .find((facility: Facility) => facility.id === facilityId)
        }

        function initializeFacilitySectionValues(facilityData: Facility | undefined) {
            if (!facilityData) return

            facilitySectionFields.nameEn = facilityData.nameEn
            facilitySectionFields.nameJa = facilityData.nameJa
            facilitySectionFields.phone = facilityData?.contact?.phone
            facilitySectionFields.email = facilityData?.contact?.email || undefined
            facilitySectionFields.website = facilityData?.contact?.website || undefined
            facilitySectionFields.postalCode = facilityData.contact?.address.postalCode
            facilitySectionFields.prefectureEn = facilityData?.contact?.address?.prefectureEn
            facilitySectionFields.cityEn = facilityData?.contact?.address?.cityEn
            facilitySectionFields.addressLine1En = facilityData?.contact?.address?.addressLine1En
            facilitySectionFields.addressLine2En = facilityData?.contact?.address?.addressLine2En
            facilitySectionFields.prefectureJa = facilityData?.contact?.address?.prefectureJa
            facilitySectionFields.cityJa = facilityData?.contact?.address?.cityJa
            facilitySectionFields.addressLine1Ja = facilityData?.contact?.address?.addressLine1Ja
            facilitySectionFields.addressLine2Ja = facilityData?.contact?.address?.addressLine2Ja
            facilitySectionFields.googlemapsURL = facilityData?.contact?.googleMapsUrl
            facilitySectionFields.healthcareProfessionalIds = facilityData.healthcareProfessionalIds
            facilitySectionFields.mapLatitude = facilityData.mapLatitude.toString()
            facilitySectionFields.mapLongitude = facilityData.mapLongitude.toString()
        }

        async function getFacilities() {
            const facilityResults = await queryFacilities()
            facilityData.value = facilityResults
        }

        async function updateFacility():
        Promise<ServerResponse<Maybe<Facility>>> {
            const serverResponse = { data: {} as Maybe<Facility>, errors: [] as ServerError[], hasErrors: false }

            const updateFacilityInput: MutationUpdateFacilityArgs = {
                id: selectedFacilityId.value,
                input: {
                    contact: {
                        address: {
                            addressLine1En: facilitySectionFields.addressLine1En,
                            addressLine1Ja: facilitySectionFields.addressLine1Ja,
                            addressLine2En: facilitySectionFields.addressLine2En,
                            addressLine2Ja: facilitySectionFields.addressLine2Ja,
                            cityEn: facilitySectionFields.cityEn,
                            cityJa: facilitySectionFields.cityJa,
                            postalCode: facilitySectionFields.postalCode,
                            prefectureEn: facilitySectionFields.prefectureEn,
                            prefectureJa: facilitySectionFields.prefectureJa
                        },
                        email: facilitySectionFields.email,
                        googleMapsUrl: facilitySectionFields.googlemapsURL,
                        phone: facilitySectionFields.phone,
                        website: facilitySectionFields.website
                    },
                    healthcareProfessionalIds: facilitySectionFields.healthProfessionalsRelations.length > 0
                        ? facilitySectionFields.healthProfessionalsRelations
                        : [],
                    mapLatitude: parseFloat(facilitySectionFields.mapLatitude),
                    mapLongitude: parseFloat(facilitySectionFields.mapLongitude),
                    nameEn: facilitySectionFields.nameEn,
                    nameJa: facilitySectionFields.nameJa
                }
            }

            const response = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                updateExistingFacilityGqlMutation,
                updateFacilityInput
            )

            serverResponse.data = response.data?.updateFacility
            serverResponse.errors = response.errors ? response.errors : []
            serverResponse.hasErrors = response.hasErrors

            if (!serverResponse.errors.length) {
                facilitySectionFields.healthProfessionalsRelations = []
                facilitySectionFields.healthcareProfessionalIds = serverResponse.data!.healthcareProfessionalIds
            }

            return serverResponse
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
            initializeFacilitySectionValues,
            healthProfessionalsRelationsForDisplay
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
mutation Mutation($id: ID!, $input: UpdateFacilityInput!) {
  updateFacility(id: $id, input: $input) {
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
