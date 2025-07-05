import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import type { DeleteResult, Facility,
    HealthcareProfessional,
    Mutation,
    MutationCreateFacilityArgs,
    MutationDeleteFacilityArgs,
    MutationUpdateFacilityArgs,
    Query,
    Relationship } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerResponse } from '~/typedefs/serverResponse'
import { arraysAreEqual } from '~/utils/arrayUtils'

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

        const createFacilityFields = reactive({
            nameEn: '',
            nameJa: '',
            contact: {
                address: {
                    postalCode: '',
                    prefectureEn: '',
                    cityEn: '',
                    addressLine1En: '',
                    addressLine2En: '',
                    prefectureJa: '',
                    cityJa: '',
                    addressLine1Ja: '',
                    addressLine2Ja: ''
                },
                email: '' as string | undefined,
                googleMapsUrl: '',
                phone: '',
                website: '' as string | undefined
            },
            mapLatitude: '',
            mapLongitude: '',
            healthcareProfessionalIds: [] as string[]
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

            Object.assign(facilitySectionFieldsBeforeMutation, facilitySectionFields)
        }

        function resetFacilitySectionFields() {
            facilitySectionFields.nameEn = ''
            facilitySectionFields.nameJa = ''
            facilitySectionFields.phone = ''
            facilitySectionFields.website = undefined
            facilitySectionFields.email = undefined

            facilitySectionFields.postalCode = ''
            facilitySectionFields.prefectureEn = ''
            facilitySectionFields.cityEn = ''
            facilitySectionFields.addressLine1En = ''
            facilitySectionFields.addressLine2En = ''
            facilitySectionFields.prefectureJa = ''
            facilitySectionFields.cityJa = ''
            facilitySectionFields.addressLine1Ja = ''
            facilitySectionFields.addressLine2Ja = ''

            facilitySectionFields.googlemapsURL = ''
            facilitySectionFields.mapLatitude = ''
            facilitySectionFields.mapLongitude = ''

            facilitySectionFields.healthcareProfessionalIds = []
            facilitySectionFields.healthProfessionalsRelations = []
        }

        async function getFacilities() {
            const facilityResults = await queryFacilities()
            facilityData.value = facilityResults
        }

        async function createFacility():
        Promise<ServerResponse<Facility>> {
            const CreateFacilityInput: MutationCreateFacilityArgs = {
                input: {
                    nameEn: createFacilityFields.nameEn,
                    nameJa: createFacilityFields.nameJa,
                    contact: {
                        address: {
                            addressLine1En: createFacilityFields.contact.address.addressLine1En,
                            addressLine1Ja: createFacilityFields.contact.address.addressLine1Ja,
                            addressLine2En: createFacilityFields.contact.address.addressLine2En,
                            addressLine2Ja: createFacilityFields.contact.address.addressLine2Ja,
                            cityEn: createFacilityFields.contact.address.cityEn,
                            cityJa: createFacilityFields.contact.address.cityJa,
                            postalCode: createFacilityFields.contact.address.postalCode,
                            prefectureEn: createFacilityFields.contact.address.prefectureEn,
                            prefectureJa: createFacilityFields.contact.address.prefectureJa
                        },
                        email: createFacilityFields.contact.email,
                        phone: createFacilityFields.contact.phone,
                        website: createFacilityFields.contact.website,
                        googleMapsUrl: createFacilityFields.contact.googleMapsUrl
                    },
                    mapLatitude: parseFloat(createFacilityFields.mapLatitude),
                    mapLongitude: parseFloat(createFacilityFields.mapLongitude),
                    healthcareProfessionalIds: createFacilityFields.healthcareProfessionalIds
                }
            }
            const serverResponse = await graphQLClientRequestWithRetry<Mutation['createFacility']>(
                gqlClient.request.bind(gqlClient),
                createFacilityGqlMutation,
                CreateFacilityInput
            )

            if (!serverResponse.errors?.length) {
                selectedFacilityData.value = serverResponse.data!
                initializeFacilitySectionValues(serverResponse.data!)
            }

            return serverResponse
        }

        const facilitySectionFieldsBeforeMutation = reactive({ ...facilitySectionFields })

        async function updateFacility(): Promise<ServerResponse<Facility>> {
            const input: MutationUpdateFacilityArgs['input'] = {}

            if (facilitySectionFields.nameEn !== facilitySectionFieldsBeforeMutation.nameEn)
                input.nameEn = facilitySectionFields.nameEn

            if (facilitySectionFields.nameJa !== facilitySectionFieldsBeforeMutation.nameJa)
                input.nameJa = facilitySectionFields.nameJa

            if (
                parseFloat(facilitySectionFields.mapLatitude) !== parseFloat(facilitySectionFieldsBeforeMutation.mapLatitude)
            )
                input.mapLatitude = parseFloat(facilitySectionFields.mapLatitude)

            if (
                parseFloat(facilitySectionFields.mapLongitude) !== parseFloat(facilitySectionFieldsBeforeMutation.mapLongitude)
            )
                input.mapLongitude = parseFloat(facilitySectionFields.mapLongitude)

            if (!arraysAreEqual(facilitySectionFields.healthProfessionalsRelations,
                                facilitySectionFieldsBeforeMutation.healthProfessionalsRelations))
                input.healthcareProfessionalIds = facilitySectionFields.healthProfessionalsRelations

            if (
                facilitySectionFields.email !== facilitySectionFieldsBeforeMutation.email
                || facilitySectionFields.phone !== facilitySectionFieldsBeforeMutation.phone
                || facilitySectionFields.website !== facilitySectionFieldsBeforeMutation.website
                || facilitySectionFields.googlemapsURL !== facilitySectionFieldsBeforeMutation.googlemapsURL
                || facilitySectionFields.postalCode !== facilitySectionFieldsBeforeMutation.postalCode
                || facilitySectionFields.prefectureEn !== facilitySectionFieldsBeforeMutation.prefectureEn
                || facilitySectionFields.cityEn !== facilitySectionFieldsBeforeMutation.cityEn
                || facilitySectionFields.addressLine1En !== facilitySectionFieldsBeforeMutation.addressLine1En
                || facilitySectionFields.addressLine2En !== facilitySectionFieldsBeforeMutation.addressLine2En
                || facilitySectionFields.prefectureJa !== facilitySectionFieldsBeforeMutation.prefectureJa
                || facilitySectionFields.cityJa !== facilitySectionFieldsBeforeMutation.cityJa
                || facilitySectionFields.addressLine1Ja !== facilitySectionFieldsBeforeMutation.addressLine1Ja
                || facilitySectionFields.addressLine2Ja !== facilitySectionFieldsBeforeMutation.addressLine2Ja
            ) {
                input.contact = {
                    phone: facilitySectionFields.phone,
                    googleMapsUrl: facilitySectionFields.googlemapsURL,
                    email: facilitySectionFields.email,
                    website: facilitySectionFields.website,
                    address: {
                        postalCode: facilitySectionFields.postalCode,
                        prefectureEn: facilitySectionFields.prefectureEn,
                        cityEn: facilitySectionFields.cityEn,
                        addressLine1En: facilitySectionFields.addressLine1En,
                        addressLine2En: facilitySectionFields.addressLine2En,
                        prefectureJa: facilitySectionFields.prefectureJa,
                        cityJa: facilitySectionFields.cityJa,
                        addressLine1Ja: facilitySectionFields.addressLine1Ja,
                        addressLine2Ja: facilitySectionFields.addressLine2Ja
                    }
                }
            }

            const updateFacilityInput: MutationUpdateFacilityArgs = {
                id: selectedFacilityId.value,
                input
            }

            const serverResponse = await graphQLClientRequestWithRetry<Mutation['updateFacility']>(
                gqlClient.request.bind(gqlClient),
                updateExistingFacilityGqlMutation,
                updateFacilityInput
            )

            if (!serverResponse.errors?.length) {
                selectedFacilityData.value = serverResponse.data
                initializeFacilitySectionValues(serverResponse.data)

                if (
                    arraysAreEqual(
                        facilitySectionFields.healthProfessionalsRelations,
                        facilitySectionFieldsBeforeMutation.healthProfessionalsRelations
                    )
                ) {
                    facilitySectionFields.healthProfessionalsRelations = []
                }
            }

            return serverResponse
        }

        function resetCreateFacilityFields() {
            createFacilityFields.nameEn = ''
            createFacilityFields.nameJa = ''
            createFacilityFields.contact = {
                address: {
                    addressLine1En: '',
                    addressLine1Ja: '',
                    addressLine2En: '',
                    addressLine2Ja: '',
                    postalCode: '',
                    prefectureEn: '',
                    prefectureJa: '',
                    cityEn: '',
                    cityJa: ''
                },
                email: '',
                googleMapsUrl: '',
                phone: '',
                website: ''
            }
            createFacilityFields.mapLatitude = ''
            createFacilityFields.mapLongitude = ''
            createFacilityFields.healthcareProfessionalIds = []
        }

        async function deleteFacility(facilityId: MutationDeleteFacilityArgs):
        Promise<ServerResponse<DeleteResult>> {
            const serverResponse = await graphQLClientRequestWithRetry<Mutation['deleteFacility']>(
                gqlClient.request.bind(gqlClient),
                deleteExistingFacilityGqlMutation,
                facilityId
            )

            return serverResponse
        }

        return {
            getFacilities,
            createFacility,
            createFacilityFields,
            facilityData,
            updateFacility,
            facilitySectionFields,
            selectedFacilityId,
            deleteFacility,
            selectedFacilityData,
            setSelectedFacilityData,
            initializeFacilitySectionValues,
            healthProfessionalsRelationsForDisplay,
            resetFacilitySectionFields,
            resetCreateFacilityFields
        }
    }
)

async function queryFacilities(): Promise<Facility[]> {
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

        return response.data ?? []
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
const createFacilityGqlMutation = gql`
mutation Mutation($input: CreateFacilityInput!) {
  createFacility(input: $input) {
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
