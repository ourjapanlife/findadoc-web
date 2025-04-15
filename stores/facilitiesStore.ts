import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import type { Maybe } from 'graphql/jsutils/Maybe'
import type { DeleteResult, Facility,
    HealthcareProfessional,
    Mutation, MutationDeleteFacilityArgs, MutationUpdateFacilityArgs, Query, Relationship } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerError, ServerResponse } from '~/typedefs/serverResponse'

export const useFacilitiesStore = defineStore(
    'facilitiesStore',
    () => {
        const facilityData: Ref<Facility[]> = ref([])
        const selectedFacilityId: Ref<string> = ref('')
        const selectedFacilityData: Ref<Facility | undefined> = ref()
        // This reactive object is used to share data changes of the updated facility or submission across the components
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

        function initializeFacilitySectionValues(data: Facility | undefined) {
            if (!data) return

            facilitySectionFields.nameEn = data.nameEn
            facilitySectionFields.nameJa = data.nameJa
            facilitySectionFields.phone = data?.contact?.phone
            facilitySectionFields.email = data?.contact?.email || undefined
            facilitySectionFields.website = data?.contact?.website || undefined
            facilitySectionFields.postalCode = data.contact?.address.postalCode
            facilitySectionFields.prefectureEn = data?.contact?.address?.prefectureEn
            facilitySectionFields.cityEn = data?.contact?.address?.cityEn
            facilitySectionFields.addressLine1En = data?.contact?.address?.addressLine1En
            facilitySectionFields.addressLine2En = data?.contact?.address?.addressLine2En
            facilitySectionFields.prefectureJa = data?.contact?.address?.prefectureJa
            facilitySectionFields.cityJa = data?.contact?.address?.cityJa
            facilitySectionFields.addressLine1Ja = data?.contact?.address?.addressLine1Ja
            facilitySectionFields.addressLine2Ja = data?.contact?.address?.addressLine2Ja
            facilitySectionFields.googlemapsURL = data?.contact?.googleMapsUrl
            facilitySectionFields.healthcareProfessionalIds = data.healthcareProfessionalIds
            facilitySectionFields.mapLatitude = data.mapLatitude.toString()
            facilitySectionFields.mapLongitude = data.mapLongitude.toString()
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
                        : undefined,
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
                // update the necessary values with the updated response
                selectedFacilityData.value = serverResponse.data!
                initializeFacilitySectionValues(serverResponse.data!)
                facilitySectionFields.healthProfessionalsRelations = []
            }

            return serverResponse
        }

        async function deleteFacility(facilityId: MutationDeleteFacilityArgs):
        Promise<ServerResponse<Maybe<DeleteResult>>> {
            const serverResponse = { data: {} as Maybe<DeleteResult>, errors: [] as ServerError[], hasErrors: false }

            const response = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                deleteExistingFacilityGqlMutation,
                facilityId
            )

            serverResponse.data = response.data?.deleteFacility
            serverResponse.errors = response.errors ? response.errors : []
            serverResponse.hasErrors = response.hasErrors

            return serverResponse
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
        const response = await graphQLClientRequestWithRetry<Query['facilities']>(
            gqlClient.request.bind(gqlClient),
            getAllFacilitiesForModeration,
            searchFacilitiesData
        )

        return response?.data as Facility[] ?? []
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
mutation Mutation($id: ID!) {
  deleteFacility(id: $id) {
    isSuccessful
  }
}
`
