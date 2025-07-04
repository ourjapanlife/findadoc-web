import type { Maybe } from 'graphql/jsutils/Maybe'
import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
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
import { ErrorCode, type ServerError, type ServerResponse } from '~/typedefs/serverResponse'
import { arraysAreEqual } from '~/utils/arrayUtils'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const localeStore = useLocaleStore()

        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const selectedHealthcareProfessionalData: Ref<HealthcareProfessional | undefined> = ref()
        const healthcareProfessionalSectionFields = reactive<HealthcareProfessional>({
            __typename: 'HealthcareProfessional', // Optional if you're working with GraphQL
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
            spokenLanguages: [] as Locale[]
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
            const healthcareProfessionalResults = await queryHealthcareProfessionals()
            healthcareProfessionalsData.value = healthcareProfessionalResults
        }

        async function updateHealthcareProfessional():
        Promise<ServerResponse<HealthcareProfessional>> {
            const facilitiesForRelationshipCreationArray = selectedFacilities.value

            // Fetch the current healthcare professional data for comparison
            const currentProfessionalData = healthcareProfessionalsData.value.find(
                (hp: HealthcareProfessional) =>
                    hp.id === selectedHealthcareProfessionalId.value
            )

            // return out if no current professional data found
            if (!currentProfessionalData) {
                console.error(`No data found for currentProfessionalData with id ${selectedHealthcareProfessionalId.value}`)
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

            const currentProfessionalDataCopy = { ...currentProfessionalData }

            // This is the array to be sent to the backend if there is a change in the relations
            let facilitiesRelationsToSelectedHealthcareProfessional: Relationship[] = []

            if (facilitiesForRelationshipCreationArray.length) {
                facilitiesRelationsToSelectedHealthcareProfessional = facilitiesForRelationshipCreationArray
                    .map(createFacilityRelation)
            }

            //if section field and current value are the same (no updates), use undefined in payload
            // otherwise, use new section field value to update that field
            const updateHealthcareProfessionalInput: MutationUpdateHealthcareProfessionalArgs = {
                id: selectedHealthcareProfessionalId.value,
                input: {
                    acceptedInsurance: !arraysAreEqual(
                        healthcareProfessionalSectionFields.acceptedInsurance,
                        currentProfessionalDataCopy.acceptedInsurance
                    )
                        ? undefined
                        : healthcareProfessionalSectionFields.acceptedInsurance,
                    additionalInfoForPatients: healthcareProfessionalSectionFields.additionalInfoForPatients
                      === currentProfessionalDataCopy.additionalInfoForPatients
                        ? undefined
                        : healthcareProfessionalSectionFields.additionalInfoForPatients,
                    degrees: !arraysAreEqual(
                        healthcareProfessionalSectionFields.degrees,
                        currentProfessionalDataCopy.degrees
                    )
                        ? undefined
                        : healthcareProfessionalSectionFields.degrees,
                    facilityIds: facilitiesRelationsToSelectedHealthcareProfessional.length
                        ? facilitiesRelationsToSelectedHealthcareProfessional
                        : undefined,
                    names: !arraysAreEqual(
                        healthcareProfessionalSectionFields.names,
                        currentProfessionalDataCopy.names
                    )
                        ? undefined
                        : healthcareProfessionalSectionFields.names,
                    specialties: !arraysAreEqual(
                        healthcareProfessionalSectionFields.specialties,
                        currentProfessionalDataCopy.specialties
                    )
                        ? undefined
                        : healthcareProfessionalSectionFields.specialties,
                    spokenLanguages: !arraysAreEqual(
                        healthcareProfessionalSectionFields.spokenLanguages,
                        currentProfessionalDataCopy.spokenLanguages
                    )
                        ? undefined
                        : healthcareProfessionalSectionFields.spokenLanguages
                }
            }

            const hasUpdates = !!Object.values(updateHealthcareProfessionalInput.input).find(value => value !== undefined)

            if (!hasUpdates) {
                return {
                    data: currentProfessionalData,
                    hasErrors: true,
                    errors: [{
                        message: 'No updates found',
                        fieldWithError: undefined,
                        code: ErrorCode.NO_UPDATES_FOUND
                    }]
                }
            }

            const serverResponse = await graphQLClientRequestWithRetry<Mutation['updateHealthcareProfessional']>(
                gqlClient.request.bind(gqlClient),
                updateHealthcareProfessionalGqlMutation,
                updateHealthcareProfessionalInput
            )

            const responseData = serverResponse.data

            if (!serverResponse.errors?.length && serverResponse.data) {
                //This finds the index of the healthcare professional so we can replace the ones we have already queried
                const outdatedHealthcareProfessionalIndex = healthcareProfessionalsData.value.findIndex(
                    (healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === responseData!.id
                )

                //This will replace the data we had from the index with the new data
                if (outdatedHealthcareProfessionalIndex !== -1) {
                    healthcareProfessionalsData.value[outdatedHealthcareProfessionalIndex] = responseData!
                }

                //This will update the data with what was returned from the server and is in our database
                updateHealthcareProfessionalSectionFields(responseData!)

                /*This resets the names we removed and kept track of in
                order to change Locales if the wrong name for a locale was chosen */
                removedHealthcareProfessionalNames.value = []
            }

            return serverResponse
        }

        /* This function will create the relationships that need to be sent in the backend for
        updating facilities the healthcare professional works at */
        function createFacilityRelation(facility: Facility): Relationship {
            return {
                otherEntityId: facility.id,
                action: healthcareProfessionalSectionFields.facilityIds.includes(facility.id)
                    ? RelationshipAction.Delete
                    : RelationshipAction.Create
            }
        }

        async function createHealthcareProfessional():
        Promise<ServerResponse<Maybe<HealthcareProfessional>>> {
            const serverResponse = { data: {} as Maybe<HealthcareProfessional>, errors: [] as ServerError[], hasErrors: false }

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

            serverResponse.data = response.data?.createHealthcareProfessional
            serverResponse.errors = response.errors ? response.errors : []
            serverResponse.hasErrors = response.hasErrors

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

        async function deleteHealthcareProfessional(healthcareProfessionalId: MutationDeleteHealthcareProfessionalArgs):
        Promise<ServerResponse<DeleteResult>> {
            const serverResponse = await graphQLClientRequestWithRetry<Mutation['deleteHealthcareProfessional']>(
                gqlClient.request.bind(gqlClient),
                deleteHealthcareProfessionalGqlMutation,
                healthcareProfessionalId
            )

            return serverResponse
        }

        const displayChosenLocaleForHealthcareProfessional = (
            healthcareProfessional: HealthcareProfessional | CreateHealthcareProfessionalInput
        ) => {
            // find the name of the healthcare professional from the chosen display locale
            const nameFromChosenLocaleDisplay = healthcareProfessional.names.find(name =>
                name.locale === localeStore.activeLocale.code)
            // return the name of the healthcare professional of chosen locale or default to the 0 indexed recorded name
            return nameFromChosenLocaleDisplay ? nameFromChosenLocaleDisplay : healthcareProfessional.names[0]
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
            resetHealthcareProfessionalSectionFields
        }
    }
)

async function queryHealthcareProfessionals(): Promise<HealthcareProfessional[]> {
    const searchHealthcareProfessionalsData = {
        filters: {
            limit: 400
        }
    }
    try {
        const response = await graphQLClientRequestWithRetry<Query['healthcareProfessionals']>(
            gqlClient.request.bind(gqlClient),
            getAllHealthcareProfessionalsData,
            searchHealthcareProfessionalsData
        )

        return response?.data ?? []
    } catch (error) {
        console.error(`Error querying the healthcare professionals: ${JSON.stringify(error)}`)
        return []
    }
}

export async function getHealthcareProfessionalById(id: string): Promise<HealthcareProfessional[]> {
    try {
        const queryData = {
            healthcareProfessionalId: id
        }
        const result = await graphQLClientRequestWithRetry<Query['healthcareProfessionals']>(
            gqlClient.request.bind(gqlClient),
            getHealthcareProfessionalByIdGqlQuery,
            queryData
        )

        if (!result.data) {
            throw new Error('The Healthcare Professional ID doesn\'t exist')
        }
        return result.data
    } catch (error: unknown) {
        console.error(`Error retrieving healthcare professional by id: ${id}: ${JSON.stringify(error)}`)
        return []
    }
}

const getAllHealthcareProfessionalsData = gql`
query Query($filters: HealthcareProfessionalSearchFilters!) {
  healthcareProfessionals(filters: $filters) {
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
}`

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
