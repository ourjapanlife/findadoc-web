import type { Maybe } from 'graphql/jsutils/Maybe'
import { defineStore } from 'pinia'
import { reactive, ref, type Ref, computed } from 'vue'
import { gql } from 'graphql-request'
import { fetchHealthcareProfessionalsWithCount } from '../utils/graphqlHelpers'
import { type Insurance,
    type Degree,
    type Specialty,
    type Locale, type Facility, type DeleteResult, type HealthcareProfessional,
    type LocalizedNameInput,
    type Mutation,
    type MutationDeleteHealthcareProfessionalArgs,
    type MutationUpdateHealthcareProfessionalArgs,
    type Relationship,
    RelationshipAction,
    type CreateHealthcareProfessionalInput,
    type MutationCreateHealthcareProfessionalArgs,
    type Query } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import { useLocaleStore } from '~/stores/localeStore'
import type { ServerResponse } from '~/typedefs/serverResponse'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const localeStore = useLocaleStore()

        const healthcareProfessionalsData: Ref<HealthcareProfessional[]> = ref([])
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const selectedHealthcareProfessionalData: Ref<HealthcareProfessional | undefined> = ref()
        // Used for store the total number of healthcare professionals found by the current search query.
        const totalHealthcareProfessionalsCount: Ref<number> = ref(0)
        // Used for store the starting index (offset) for the current page of results.
        const currentOffset: Ref<number> = ref(0)
        const itemsPerPage: Ref<number> = ref(25)
        const hasNextPage = computed(() => currentOffset.value + itemsPerPage.value < totalHealthcareProfessionalsCount.value)
        const hasPrevPage = computed(() => currentOffset.value > 0)
        const healthcareProfessionalSectionFields = reactive<HealthcareProfessional>({
            __typename: 'HealthcareProfessional',
            acceptedInsurance: [],
            additionalInfoForPatients: '',
            createdDate: '',
            degrees: [],
            facilityIds: [],
            id: '', // Empty string, assuming the ID will be set later
            names: [],
            specialties: [],
            spokenLanguages: [],
            updatedDate: ''
        })

        const createHealthcareProfessionalSectionFields: CreateHealthcareProfessionalInput = reactive({
            acceptedInsurance: [] as Insurance[],
            degrees: [] as Degree[],
            facilityIds: [] as string[],
            names: [] as LocalizedNameInput[],
            specialties: [] as Specialty[],
            spokenLanguages: [] as Locale[],
            additionalInfoForPatients: ''
        })

        const selectedFacilities: Ref<Facility[]> = ref([])
        // This helps users easily add name locales back to a healthcare professional by keeping track of removed ones
        const removedHealthcareProfessionalNames: Ref<LocalizedNameInput[]> = ref([])

        function setSelectedHealthcareProfessional(healthcareProfessionalId: string) {
            selectedHealthcareProfessionalId.value = healthcareProfessionalId
            selectedHealthcareProfessionalData.value = healthcareProfessionalsData.value
                .find((healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === healthcareProfessionalId)
            if (selectedHealthcareProfessionalData.value) {
                updateHealthcareProfessionalSectionFields(selectedHealthcareProfessionalData.value)
            }
        }

        function updateHealthcareProfessionalSectionFields(healthcareProfessional: HealthcareProfessional) {
            // eslint-disable-next-line no-underscore-dangle
            healthcareProfessionalSectionFields.__typename = 'HealthcareProfessional'
            healthcareProfessionalSectionFields.acceptedInsurance = healthcareProfessional.acceptedInsurance
            healthcareProfessionalSectionFields.additionalInfoForPatients = healthcareProfessional.additionalInfoForPatients
            healthcareProfessionalSectionFields.createdDate = healthcareProfessional.createdDate
            healthcareProfessionalSectionFields.degrees = healthcareProfessional.degrees
            healthcareProfessionalSectionFields.facilityIds = healthcareProfessional.facilityIds
            healthcareProfessionalSectionFields.id = healthcareProfessional.id
            healthcareProfessionalSectionFields.names = healthcareProfessional.names
            healthcareProfessionalSectionFields.specialties = healthcareProfessional.specialties
            healthcareProfessionalSectionFields.spokenLanguages = healthcareProfessional.spokenLanguages
            healthcareProfessionalSectionFields.updatedDate = healthcareProfessional.updatedDate
        }

        function resetHealthcareProfessionalSectionFields() {
            // eslint-disable-next-line no-underscore-dangle
            healthcareProfessionalSectionFields.__typename = 'HealthcareProfessional'
            healthcareProfessionalSectionFields.acceptedInsurance = []
            healthcareProfessionalSectionFields.additionalInfoForPatients = ''
            healthcareProfessionalSectionFields.createdDate = ''
            healthcareProfessionalSectionFields.degrees = []
            healthcareProfessionalSectionFields.facilityIds = []
            healthcareProfessionalSectionFields.id = ''
            healthcareProfessionalSectionFields.names = []
            healthcareProfessionalSectionFields.specialties = []
            healthcareProfessionalSectionFields.spokenLanguages = []
            healthcareProfessionalSectionFields.updatedDate = ''
        }

        async function getHealthcareProfessionals() {
            const filters = {
                offset: currentOffset.value,
                limit: itemsPerPage.value
            }
            try {
                // Call the utility function to fetch the paginated data and the total count
                const { filteredSearchResults, totalCount } = await fetchHealthcareProfessionalsWithCount(filters)
                healthcareProfessionalsData.value = filteredSearchResults
                totalHealthcareProfessionalsCount.value = totalCount
            } catch (error) {
                console.error(`Error fetching healthcare professionals: ${JSON.stringify(error)}`)
                // eslint-disable-next-line no-alert
                alert('Error loading submissions. Please try again later.')
                healthcareProfessionalsData.value = []
                totalHealthcareProfessionalsCount.value = 0
            }
        }

        function setOffset(newOffset: number) {
            currentOffset.value = newOffset
            getHealthcareProfessionals()
        }

        // helper — create the relationship object to send to the API
        function createFacilityRelation(facility: Facility): Relationship {
            return {
                otherEntityId: facility.id,
                action: healthcareProfessionalSectionFields.facilityIds.includes(facility.id)
                    ? RelationshipAction.Delete
                    : RelationshipAction.Create
            }
        }

        async function updateHealthcareProfessional(): Promise<ServerResponse<HealthcareProfessional>> {
            const facilitiesForRelationshipCreationArray = selectedFacilities.value

            const currentProfessionalData = healthcareProfessionalsData.value.find(
                hp => hp.id === selectedHealthcareProfessionalId.value
            )

            if (!currentProfessionalData) {
                console.error(useNuxtApp().$i18n.t('healthcareProfessionalsErrors.noCurrentProfessionalDataFound'), `${selectedHealthcareProfessionalId.value}`)
                return {
                    data: {
                        acceptedInsurance: [],
                        additionalInfoForPatients: '',
                        createdDate: '',
                        degrees: [],
                        facilityIds: [],
                        id: '',
                        names: [],
                        specialties: [],
                        spokenLanguages: [],
                        updatedDate: ''
                    },
                    hasErrors: true
                }
            }

            // Map facilities to relationships, but send full array even if empty
            const facilitiesRelationsToSelectedHealthcareProfessional: Relationship[]
            = facilitiesForRelationshipCreationArray.map(createFacilityRelation)

            const updateInput: MutationUpdateHealthcareProfessionalArgs = {
                id: selectedHealthcareProfessionalId.value,
                input: {
                    acceptedInsurance: healthcareProfessionalSectionFields.acceptedInsurance ?? [],
                    additionalInfoForPatients: healthcareProfessionalSectionFields.additionalInfoForPatients ?? '',
                    degrees: healthcareProfessionalSectionFields.degrees ?? [],
                    facilityIds: facilitiesRelationsToSelectedHealthcareProfessional,
                    names: healthcareProfessionalSectionFields.names ?? [],
                    specialties: healthcareProfessionalSectionFields.specialties ?? [],
                    spokenLanguages: healthcareProfessionalSectionFields.spokenLanguages ?? []
                }
            }

            const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                updateHealthcareProfessionalGqlMutation,
                updateInput
            )

            const responseData = serverResponse.data?.updateHealthcareProfessional

            if (!serverResponse.errors?.length && responseData) {
                const index = healthcareProfessionalsData.value.findIndex(hp => hp.id === responseData.id)
                if (index !== -1) healthcareProfessionalsData.value[index] = responseData
                updateHealthcareProfessionalSectionFields(responseData)
                removedHealthcareProfessionalNames.value = []
            }

            return {
                ...serverResponse,
                data: responseData
            }
        }

        async function createHealthcareProfessional():
        Promise<ServerResponse<Maybe<HealthcareProfessional>>> {
            const serverResponse: ServerResponse<Maybe<HealthcareProfessional>> = {
                data: null,
                errors: [],
                hasErrors: false
            }

            const createHealthcareProfessionalInput: MutationCreateHealthcareProfessionalArgs = {
                input: {
                    acceptedInsurance: createHealthcareProfessionalSectionFields.acceptedInsurance,
                    additionalInfoForPatients: createHealthcareProfessionalSectionFields.additionalInfoForPatients,
                    degrees: createHealthcareProfessionalSectionFields.degrees,
                    facilityIds: createHealthcareProfessionalSectionFields.facilityIds,
                    names: createHealthcareProfessionalSectionFields.names,
                    specialties: createHealthcareProfessionalSectionFields.specialties,
                    spokenLanguages: createHealthcareProfessionalSectionFields.spokenLanguages
                }
            }
            const response = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                createHealthcareProfessionalGqMutation,
                createHealthcareProfessionalInput
            )

            serverResponse.data = response.data?.createHealthcareProfessional ?? null
            serverResponse.errors = response.errors ?? []
            serverResponse.hasErrors = response.hasErrors ?? !!serverResponse.errors.length

            return serverResponse
        }

        function resetCreateHealthcareProfessionalFields() {
            createHealthcareProfessionalSectionFields.acceptedInsurance = []
            createHealthcareProfessionalSectionFields.additionalInfoForPatients = ''
            createHealthcareProfessionalSectionFields.degrees = []
            createHealthcareProfessionalSectionFields.facilityIds = []
            createHealthcareProfessionalSectionFields.names = []
            createHealthcareProfessionalSectionFields.specialties = []
            createHealthcareProfessionalSectionFields.spokenLanguages = []
        }

        async function deleteHealthcareProfessional(
      healthcareProfessionalId: MutationDeleteHealthcareProfessionalArgs
        ): Promise<ServerResponse<DeleteResult>> {
            const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                deleteHealthcareProfessionalGqlMutation,
                healthcareProfessionalId
            )

            const deleteResult = serverResponse.data?.deleteHealthcareProfessional as DeleteResult | undefined

            const mappedResponse: ServerResponse<DeleteResult> = {
                ...serverResponse,
                data: deleteResult as DeleteResult
            }

            if (!serverResponse.errors?.length && deleteResult?.isSuccessful) {
                await getHealthcareProfessionals()
                if (selectedHealthcareProfessionalId.value === healthcareProfessionalId.id) {
                    selectedHealthcareProfessionalId.value = ''
                    selectedHealthcareProfessionalData.value = undefined
                }
            }

            return mappedResponse
        }

        const displayChosenLocaleForHealthcareProfessional = (
            healthcareProfessional: HealthcareProfessional | CreateHealthcareProfessionalInput
        ) => {
            // Find the name of the healthcare professional from the chosen display locale
            const nameFromChosenLocaleDisplay = healthcareProfessional.names.find(name =>
                name.locale === localeStore.activeLocale.code)
            // Return the name of the healthcare professional of chosen locale or default to the 0 indexed recorded name
            return nameFromChosenLocaleDisplay ? nameFromChosenLocaleDisplay : healthcareProfessional.names[0]
        }

        function setItemsPerPage(newLimit: number) {
            itemsPerPage.value = newLimit
        }

        return {
            getHealthcareProfessionals,
            healthcareProfessionalsData,
            updateHealthcareProfessional,
            selectedHealthcareProfessionalId,
            deleteHealthcareProfessional,
            healthcareProfessionalSectionFields,
            displayChosenLocaleForHealthcareProfessional,
            setSelectedHealthcareProfessional,
            selectedHealthcareProfessionalData,
            removedHealthcareProfessionalNames,
            selectedFacilities,
            createHealthcareProfessional,
            createHealthcareProfessionalSectionFields,
            resetCreateHealthcareProfessionalFields,
            resetHealthcareProfessionalSectionFields,
            totalHealthcareProfessionalsCount,
            currentOffset,
            itemsPerPage,
            setOffset,
            hasNextPage,
            hasPrevPage,
            setItemsPerPage
        }
    }
)

export async function getHealthcareProfessionalById(id: string): Promise<HealthcareProfessional[]> {
    try {
        const queryData = {
            healthcareProfessionalId: id
        }
        const result = await graphQLClientRequestWithRetry<Query>(
            gqlClient.request.bind(gqlClient),
            getHealthcareProfessionalByIdGqlQuery,
            queryData
        )

        if (!result.data?.healthcareProfessional) {
            throw new Error(useNuxtApp().$i18n.t('healthcareProfessionalsErrors.idDoesNotExist'))
        }

        return [result.data.healthcareProfessional]
    } catch (error: unknown) {
        console.error(useNuxtApp().$i18n.t('healthcareProfessionalsErrors.retrievingById'), `${id}: ${JSON.stringify(error)}`)
        return []
    }
}

const getHealthcareProfessionalByIdGqlQuery = gql`
    query HealthcareProfessionals($healthcareProfessionalId: ID!) {
        healthcareProfessional(id: $healthcareProfessionalId) {
        names {
            firstName
            lastName
        }
        id
        specialties
    }
}`

const updateHealthcareProfessionalGqlMutation = gql`
mutation Mutation($id: ID!, $input: UpdateHealthcareProfessionalInput!) {
  updateHealthcareProfessional(id: $id, input: $input) {
    id
    names {
      firstName
      middleName
      lastName
      locale
    }
    spokenLanguages
    degrees
    specialties
    acceptedInsurance
    additionalInfoForPatients
    facilityIds
    createdDate
    updatedDate
  }
}
`

const deleteHealthcareProfessionalGqlMutation = gql`
mutation Mutation($id: ID!) {
  deleteHealthcareProfessional(id: $id) {
    isSuccessful
  }
}
`

const createHealthcareProfessionalGqMutation = gql`
mutation Mutation($input: CreateHealthcareProfessionalInput!) {
  createHealthcareProfessional(input: $input) {
    id
    names {
      firstName
      middleName
      lastName
      locale
    }
    spokenLanguages
    degrees
    specialties
    acceptedInsurance
    additionalInfoForPatients
    facilityIds
    createdDate
    updatedDate
  }
}
`
