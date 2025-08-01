import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import type {
    DeleteResult,
    Facility,
    HealthcareProfessional,
    Mutation,
    MutationCreateFacilityArgs,
    MutationDeleteFacilityArgs,
    MutationUpdateFacilityArgs,
    Query,
    Relationship
} from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerResponse } from '~/typedefs/serverResponse'
import { arraysAreEqual } from '~/utils/arrayUtils'
import {
    getChangedFacilityFieldsForUpdate,
    type FacilitySectionFields
} from '~/utils/facilityUtils'

export const useFacilitiesStore = defineStore('facilitiesStore', () => {
    const facilityData: Ref<Facility[]> = ref([])
    const selectedFacilityId: Ref<string> = ref('')
    const selectedFacilityData: Ref<Facility | undefined> = ref()

    const facilitySectionFields = ref<FacilitySectionFields>({
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
        selectedFacilityData.value = facilityData.value.find(
            (facility: Facility) => facility.id === facilityId
        )
    }

    function initializeFacilitySectionValues(data: Facility | undefined) {
        if (!data) return

        facilitySectionFields.value.nameEn = data.nameEn
        facilitySectionFields.value.nameJa = data.nameJa
        facilitySectionFields.value.phone = data.contact?.phone
        facilitySectionFields.value.email = data.contact?.email || undefined
        facilitySectionFields.value.website = data.contact?.website || undefined
        facilitySectionFields.value.postalCode = data.contact?.address.postalCode
        facilitySectionFields.value.prefectureEn = data.contact?.address.prefectureEn
        facilitySectionFields.value.cityEn = data.contact?.address.cityEn
        facilitySectionFields.value.addressLine1En = data.contact?.address.addressLine1En
        facilitySectionFields.value.addressLine2En = data.contact?.address.addressLine2En ?? ''
        facilitySectionFields.value.prefectureJa = data.contact?.address.prefectureJa
        facilitySectionFields.value.cityJa = data.contact?.address.cityJa
        facilitySectionFields.value.addressLine1Ja = data.contact?.address.addressLine1Ja
        facilitySectionFields.value.addressLine2Ja = data.contact?.address.addressLine2Ja ?? ''
        facilitySectionFields.value.googlemapsURL = data.contact?.googleMapsUrl
        facilitySectionFields.value.healthcareProfessionalIds = data.healthcareProfessionalIds
        facilitySectionFields.value.mapLatitude = data.mapLatitude.toString()
        facilitySectionFields.value.mapLongitude = data.mapLongitude.toString()
    }

    function resetFacilitySectionFields() {
        facilitySectionFields.value = {
            nameEn: '',
            nameJa: '',
            phone: '',
            website: undefined,
            email: undefined,
            postalCode: '',
            prefectureEn: '',
            cityEn: '',
            addressLine1En: '',
            addressLine2En: '',
            prefectureJa: '',
            cityJa: '',
            addressLine1Ja: '',
            addressLine2Ja: '',
            googlemapsURL: '',
            mapLatitude: '',
            mapLongitude: '',
            healthcareProfessionalIds: [],
            healthProfessionalsRelations: []
        }
    }

    async function getFacilities() {
        const facilityResults = await queryFacilities()
        facilityData.value = facilityResults
    }

    async function createFacility(): Promise<ServerResponse<Facility>> {
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

    async function updateFacility(): Promise<ServerResponse<Facility>> {
        const facilitySectionFieldsBeforeMutation = selectedFacilityData.value!
        const healthProfessionalRelationsBeforeMutation
        = facilitySectionFields.value.healthProfessionalsRelations

        const updatedFields = getChangedFacilityFieldsForUpdate(
            facilitySectionFields.value,
            facilitySectionFieldsBeforeMutation
        )

        const updateFacilityInput: MutationUpdateFacilityArgs = {
            id: selectedFacilityId.value,
            input: updatedFields
        }

        const serverResponse = await graphQLClientRequestWithRetry<Mutation['updateFacility']>(
            gqlClient.request.bind(gqlClient),
            updateExistingFacilityGqlMutation,
            updateFacilityInput
        )

        if (!serverResponse.errors?.length) {
            initializeFacilitySectionValues(serverResponse.data)

            // This block prevents a race condition: clear the array only if relations haven't changed while awaiting response
            if (
                arraysAreEqual(
                    facilitySectionFields.value.healthProfessionalsRelations,
                    healthProfessionalRelationsBeforeMutation
                )
            ) {
                facilitySectionFields.value.healthProfessionalsRelations = []
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

    async function deleteFacility(
        facilityId: MutationDeleteFacilityArgs
    ): Promise<ServerResponse<DeleteResult>> {
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
})

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
