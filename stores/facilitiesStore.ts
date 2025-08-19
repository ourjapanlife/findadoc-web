import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import { fetchFacilitiesWithCount } from '../utils/graphqlHelpers'
import type {
    Facility,
    HealthcareProfessional,
    Mutation,
    MutationCreateFacilityArgs,
    MutationDeleteFacilityArgs,
    MutationUpdateFacilityArgs,
    Relationship,
    FacilitySearchFilters
} from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerResponse } from '~/typedefs/serverResponse'
import { arraysAreEqual } from '~/utils/arrayUtils'

export const useFacilitiesStore = defineStore('facilitiesStore', () => {
    const facilityData: Ref<Facility[]> = ref([])
    const selectedFacilityId: Ref<string> = ref('')
    const selectedFacilityData: Ref<Facility | undefined> = ref()
    // Used for store the total number of facility found by the current search query.
    const totalFacilitiesCount: Ref<number> = ref(0)
    // Used for store the starting index (offset) for the current page of results.
    const currentOffset: Ref<number> = ref(0)
    const itemsPerPage: Ref<number> = ref(25)
    const hasNextPage = computed(() => currentOffset.value + itemsPerPage.value < totalFacilitiesCount.value)
    const hasPrevPage = computed(() => currentOffset.value > 0)
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

    const healthProfessionalsRelationsForDisplay: Ref<
        HealthcareProfessional[]
    > = ref([])

    function setSelectedFacilityData(facilityId: string) {
        selectedFacilityId.value = facilityId
        selectedFacilityData.value = facilityData.value.find(
            (facility: Facility) => facility.id === facilityId
        )
    }

    // eslint-disable-next-line complexity
    function initializeFacilitySectionValues(data: Facility | undefined) {
        if (!data) return

        facilitySectionFields.nameEn = data.nameEn
        facilitySectionFields.nameJa = data.nameJa
        facilitySectionFields.phone = data?.contact?.phone ?? ''
        facilitySectionFields.email = data?.contact?.email || undefined
        facilitySectionFields.website = data?.contact?.website || undefined

        facilitySectionFields.postalCode = data.contact?.address.postalCode ?? ''
        facilitySectionFields.prefectureEn = data?.contact?.address?.prefectureEn ?? ''
        facilitySectionFields.cityEn = data.contact?.address?.cityEn ?? ''
        facilitySectionFields.addressLine1En = data?.contact?.address?.addressLine1En ?? ''
        facilitySectionFields.addressLine2En = data?.contact?.address?.addressLine2En ?? ''
        facilitySectionFields.prefectureJa = data?.contact?.address?.prefectureJa ?? ''
        facilitySectionFields.cityJa = data?.contact?.address?.cityJa ?? ''
        facilitySectionFields.addressLine1Ja = data?.contact?.address?.addressLine1Ja ?? ''
        facilitySectionFields.addressLine2Ja = data?.contact?.address?.addressLine2Ja ?? ''
        facilitySectionFields.googlemapsURL = data?.contact?.googleMapsUrl ?? ''

        facilitySectionFields.healthcareProfessionalIds = data.healthcareProfessionalIds ?? []
        facilitySectionFields.mapLatitude = data.mapLatitude?.toString() ?? ''
        facilitySectionFields.mapLongitude = data.mapLongitude?.toString() ?? ''
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
        const filters: FacilitySearchFilters = {
            offset: currentOffset.value,
            limit: itemsPerPage.value
        }
        try {
            // Call the utility function to fetch the paginated data and the total count.
            const { filteredSearchResults, totalCount } = await fetchFacilitiesWithCount(filters)
            facilityData.value = filteredSearchResults
            totalFacilitiesCount.value = totalCount
        } catch (error) {
            console.error(`Error fetching facilities: ${JSON.stringify(error)}`)
            // eslint-disable-next-line no-alert
            alert('Error during loading data of Facility, try again')
            facilityData.value = []
            totalFacilitiesCount.value = 0
        }
    }

    function setOffset(newOffset: number) {
        currentOffset.value = newOffset
        getFacilities()
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

        const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
            gqlClient.request.bind(gqlClient),
            createFacilityGqlMutation,
            CreateFacilityInput
        )

        const responseData = serverResponse.data?.createFacility

        if (!serverResponse.errors?.length && responseData) {
            await getFacilities()
            selectedFacilityData.value = responseData
            initializeFacilitySectionValues(responseData)
        }

        const mappedResponse: ServerResponse<Facility> = {
            ...serverResponse,
            data: responseData
        }

        return mappedResponse
    }

    async function updateFacility(): Promise<ServerResponse<Facility>> {
        const healthProfessionalRelationsBeforeMutation = facilitySectionFields.healthProfessionalsRelations

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
                healthcareProfessionalIds:
        facilitySectionFields.healthProfessionalsRelations.length > 0
            ? facilitySectionFields.healthProfessionalsRelations
            : undefined,
                mapLatitude: parseFloat(facilitySectionFields.mapLatitude),
                mapLongitude: parseFloat(facilitySectionFields.mapLongitude),
                nameEn: facilitySectionFields.nameEn,
                nameJa: facilitySectionFields.nameJa
            }
        }

        const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
            gqlClient.request.bind(gqlClient),
            updateExistingFacilityGqlMutation,
            updateFacilityInput
        )

        const responseData = serverResponse.data?.updateFacility

        if (!serverResponse.errors?.length && responseData) {
            await getFacilities()
            const facility = responseData

            selectedFacilityData.value = facility
            initializeFacilitySectionValues(facility)

            if (
                arraysAreEqual(
                    facilitySectionFields.healthProfessionalsRelations,
                    healthProfessionalRelationsBeforeMutation
                )
            ) {
                facilitySectionFields.healthProfessionalsRelations = []
            }
        }

        const mappedResponse: ServerResponse<Facility> = {
            ...serverResponse,
            data: responseData
        }

        return mappedResponse
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
    ): Promise<ServerResponse<Mutation>> {
        const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
            gqlClient.request.bind(gqlClient),
            deleteExistingFacilityGqlMutation,
            facilityId
        )

        if (
            !serverResponse.errors?.length
            && serverResponse.data?.deleteFacility?.isSuccessful
        ) {
            await getFacilities()
            if (selectedFacilityId.value === facilityId.id) {
                selectedFacilityId.value = ''
                selectedFacilityData.value = undefined
            }
        }

        return serverResponse
    }

    function setItemsPerPage(newLimit: number) {
        itemsPerPage.value = newLimit
    }

    return {
        getFacilities,
        createFacility,
        createFacilityFields,
        facilityData,
        totalFacilitiesCount,
        updateFacility,
        facilitySectionFields,
        selectedFacilityId,
        deleteFacility,
        selectedFacilityData,
        setSelectedFacilityData,
        initializeFacilitySectionValues,
        healthProfessionalsRelationsForDisplay,
        resetFacilitySectionFields,
        resetCreateFacilityFields,
        currentOffset,
        itemsPerPage,
        setOffset,
        hasNextPage,
        hasPrevPage,
        setItemsPerPage
    }
})

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
