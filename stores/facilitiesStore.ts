import { defineStore } from 'pinia'
import { ref, type Ref, reactive } from 'vue'
import { gql } from 'graphql-request'
import { fetchFacilitiesWithCount } from '../utils/graphqlHelpers'
import type {
    Facility,
    HealthcareProfessional,
    Mutation,
    MutationDeleteFacilityArgs,
    MutationUpdateFacilityArgs,
    Relationship,
    FacilitySearchFilters,
    Contact,
    ContactInput,
    PhysicalAddress,
    PhysicalAddressInput,
    UpdateFacilityInput,
    MutationCreateFacilityArgs
} from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import type { ServerResponse } from '~/typedefs/serverResponse'
import { arraysAreEqual } from '~/utils/arrayUtils'
import { validateCreateFacility, validateUpdateFacility, validateRequiredNotEmpty } from '~/utils/facilitiesUtils'

export type FacilitySectionFields = {
    // contactFields
    nameEn: string
    nameJa: string
    phone: string
    website?: string
    email?: string

    // addressFields
    postalCode: string
    prefectureEn: string
    cityEn: string
    addressLine1En: string
    addressLine2En: string
    prefectureJa: string
    cityJa: string
    addressLine1Ja: string
    addressLine2Ja: string

    // googleMapsFields
    googlemapsURL: string
    mapLatitude: string
    mapLongitude: string

    healthcareProfessionalIds: string[]
    healthProfessionalsRelations: Relationship[]
}

function mapFacilityAddressToInput(address: PhysicalAddress): PhysicalAddressInput {
    return {
        postalCode: address.postalCode ?? '',
        prefectureEn: address.prefectureEn ?? '',
        cityEn: address.cityEn ?? '',
        addressLine1En: address.addressLine1En ?? '',
        addressLine2En: address.addressLine2En ?? '',
        prefectureJa: address.prefectureJa ?? '',
        cityJa: address.cityJa ?? '',
        addressLine1Ja: address.addressLine1Ja ?? '',
        addressLine2Ja: address.addressLine2Ja ?? ''
    }
}

function mapFacilityContactToInput(contact: Contact): ContactInput {
    return {
        phone: contact.phone ?? '',
        email: contact.email ?? '',
        website: contact.website ?? '',
        googleMapsUrl: contact.googleMapsUrl ?? '',
        address: mapFacilityAddressToInput(contact.address ?? {} as PhysicalAddress)
    }
}

export function getChangedFacilityFieldsForUpdate(
    current: FacilitySectionFields,
    original: Facility
): MutationUpdateFacilityArgs['input'] {
    const updatedFields: MutationUpdateFacilityArgs['input'] = {}

    if (current.nameEn !== original.nameEn) updatedFields.nameEn = current.nameEn
    if (current.nameJa !== original.nameJa) updatedFields.nameJa = current.nameJa

    const currentLatitude = parseFloat(current.mapLatitude)
    if (!isNaN(currentLatitude) && currentLatitude !== original.mapLatitude) {
        updatedFields.mapLatitude = currentLatitude
    }

    const currentLongitude = parseFloat(current.mapLongitude)
    if (!isNaN(currentLongitude) && currentLongitude !== original.mapLongitude) {
        updatedFields.mapLongitude = currentLongitude
    }

    if (current.healthProfessionalsRelations?.length) {
        updatedFields.healthcareProfessionalIds = current.healthProfessionalsRelations
    }

    const originalContactInput = mapFacilityContactToInput(original.contact as Contact)

    const requiredAddressKeys: (keyof PhysicalAddressInput)[] = [
        'postalCode', 'prefectureEn', 'cityEn', 'addressLine1En',
        'prefectureJa', 'cityJa', 'addressLine1Ja',
        'addressLine2En', 'addressLine2Ja'
    ]

    const updatedAddress: Partial<PhysicalAddressInput> = {}
    for (const key of requiredAddressKeys) {
        updatedAddress[key] = current[key] ?? ''
    }

    function isContactInfoPresent(contact: FacilitySectionFields): boolean {
        return (contact.phone ?? '') !== ''
          || (contact.email ?? '') !== ''
          || (contact.website ?? '') !== ''
          || (contact.googlemapsURL ?? '') !== ''
          || requiredAddressKeys.some(key => (contact[key] ?? '') !== '')
    }

    const contactChanged
        = current.phone !== originalContactInput.phone
          || current.googlemapsURL !== originalContactInput.googleMapsUrl
          || current.email !== originalContactInput.email
          || current.website !== originalContactInput.website
          || requiredAddressKeys.some(
              key => updatedAddress[key] !== originalContactInput.address[key]
          )

    if (contactChanged && isContactInfoPresent(current)) {
        const updatedContact: ContactInput = {
            phone: current.phone,
            googleMapsUrl: current.googlemapsURL,
            address: updatedAddress as PhysicalAddressInput
        }

        if (current.email !== originalContactInput.email) {
            updatedContact.email = current.email
        }

        if (current.website !== originalContactInput.website) {
            updatedContact.website = current.website
        }

        updatedFields.contact = updatedContact
    }

    return updatedFields
}

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
    const facilitySectionFields = ref<FacilitySectionFields>({
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

        facilitySectionFields.value.nameEn = data.nameEn
        facilitySectionFields.value.nameJa = data.nameJa
        facilitySectionFields.value.phone = data?.contact?.phone ?? ''
        facilitySectionFields.value.email = data?.contact?.email || undefined
        facilitySectionFields.value.website = data?.contact?.website || undefined

        facilitySectionFields.value.postalCode = data.contact?.address.postalCode ?? ''
        facilitySectionFields.value.prefectureEn = data?.contact?.address?.prefectureEn ?? ''
        facilitySectionFields.value.cityEn = data.contact?.address?.cityEn ?? ''
        facilitySectionFields.value.addressLine1En = data?.contact?.address?.addressLine1En ?? ''
        facilitySectionFields.value.addressLine2En = data?.contact?.address?.addressLine2En ?? ''
        facilitySectionFields.value.prefectureJa = data?.contact?.address?.prefectureJa ?? ''
        facilitySectionFields.value.cityJa = data?.contact?.address?.cityJa ?? ''
        facilitySectionFields.value.addressLine1Ja = data?.contact?.address?.addressLine1Ja ?? ''
        facilitySectionFields.value.addressLine2Ja = data?.contact?.address?.addressLine2Ja ?? ''
        facilitySectionFields.value.googlemapsURL = data?.contact?.googleMapsUrl ?? ''

        facilitySectionFields.value.healthcareProfessionalIds = data.healthcareProfessionalIds ?? []
        facilitySectionFields.value.mapLatitude = data.mapLatitude?.toString() ?? ''
        facilitySectionFields.value.mapLongitude = data.mapLongitude?.toString() ?? ''
    }

    function resetFacilitySectionFields() {
        facilitySectionFields.value = {
            nameEn: '',
            nameJa: '',
            phone: '',
            website: '' as string | undefined,
            email: '' as string | undefined,
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
            healthcareProfessionalIds: [] as string[],
            healthProfessionalsRelations: [] as Relationship[]
        }
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
        const { prefectureEn, prefectureJa } = createFacilityFields.contact.address

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
                        prefectureEn,
                        prefectureJa
                    },
                    email: createFacilityFields.contact.email,
                    phone: createFacilityFields.contact.phone,
                    website: createFacilityFields.contact.website,
                    googleMapsUrl: createFacilityFields.contact.googleMapsUrl
                },
                mapLatitude: Number(createFacilityFields.mapLatitude),
                mapLongitude: Number(createFacilityFields.mapLongitude),
                healthcareProfessionalIds: createFacilityFields.healthcareProfessionalIds
            }
        }

        /**
         * Validation on the client-side
         * (to prevent sending the data to the backend even though the prefecture names are mismatched)
         */
        const validation = validateCreateFacility(CreateFacilityInput.input)
        if (!validation.valid) {
            throw new Error(validation.errors.join('; '))
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
        const requiredValidation = validateRequiredNotEmpty(facilitySectionFields.value)
        if (!requiredValidation.valid) {
            throw new Error(requiredValidation.errors.join('; '))
        }

        const updatedFields = getChangedFacilityFieldsForUpdate(
            facilitySectionFields.value,
            selectedFacilityData.value!
        )

        /**
         * Validation on the client-side
         * (to prevent sending the data to the backend even though the prefecture names are mismatched)
         */
        const validation = validateUpdateFacility(updatedFields as UpdateFacilityInput)
        if (!validation.valid) {
            throw new Error(validation.errors.join('; '))
        }

        const updateFacilityInput: MutationUpdateFacilityArgs = {
            id: selectedFacilityId.value,
            input: updatedFields
        }

        const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
            gqlClient.request.bind(gqlClient),
            updateExistingFacilityGqlMutation,
            updateFacilityInput
        )

        const responseData = serverResponse.data?.updateFacility

        if (!serverResponse.errors?.length && responseData) {
            await getFacilities()

            selectedFacilityData.value = {
                ...selectedFacilityData.value,
                ...responseData
            }
            initializeFacilitySectionValues(responseData)
            // This block prevents a race condition: clear the array only if relations haven't changed while awaiting response
            if (
                arraysAreEqual(
                    facilitySectionFields.value.healthProfessionalsRelations,
                    updatedFields.contact?.address ? facilitySectionFields.value.healthProfessionalsRelations : []
                )
            ) {
                facilitySectionFields.value.healthProfessionalsRelations = []
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
