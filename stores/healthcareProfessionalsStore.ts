import type { Maybe } from 'graphql/jsutils/Maybe'
import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import { type Facility, type DeleteResult, type HealthcareProfessional,
    type LocalizedNameInput,
    type Mutation,
    type MutationDeleteHealthcareProfessionalArgs,
    type MutationUpdateHealthcareProfessionalArgs,
    type Relationship,
    RelationshipAction } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import { useLocaleStore } from '~/stores/localeStore'
import type { ServerError, ServerResponse } from '~/typedefs/serverResponse'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const localeStore = useLocaleStore()

        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const healthcareProfessionalSectionFields = reactive<HealthcareProfessional>({
            __typename: 'HealthcareProfessional', // Optional if you're working with GraphQL
            acceptedInsurance: [],
            createdDate: '',
            degrees: [],
            facilityIds: [],
            id: '', // Empty string, assuming the ID will be set later
            names: [],
            specialties: [],
            spokenLanguages: [],
            updatedDate: ''
        })
        const selectedFacilities: Ref<Set<Facility>> = ref(new Set())
        // This is the array to be sent to the backend if there is a change in the relations
        const facilitiesRelationsToSelectedHealthcareProfessional: Ref<Relationship[]> = ref([])
        // This helps users easily add name locales back to a healthcare professional by keeping track of removed ones
        const removedHealthcareProfessionalNames: Ref<LocalizedNameInput[]> = ref([])

        function setSelectedHealthcareProfessional(healthcareProfessionalId: string) {
            selectedHealthcareProfessionalId.value = healthcareProfessionalId
            const selectedHealthcareProfessionalData = healthcareProfessionalsData.value
                .find((healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === healthcareProfessionalId)
            if (selectedHealthcareProfessionalData) {
                updateHealthcareProfessionalSectionFields(selectedHealthcareProfessionalData)
            }
        }

        function updateHealthcareProfessionalSectionFields(healthcareProfessional: HealthcareProfessional) {
            // eslint-disable-next-line no-underscore-dangle
            healthcareProfessionalSectionFields.__typename = 'HealthcareProfessional'
            healthcareProfessionalSectionFields.acceptedInsurance = healthcareProfessional.acceptedInsurance
            healthcareProfessionalSectionFields.createdDate = healthcareProfessional.createdDate
            healthcareProfessionalSectionFields.degrees = healthcareProfessional.degrees
            healthcareProfessionalSectionFields.facilityIds = healthcareProfessional.facilityIds
            healthcareProfessionalSectionFields.id = healthcareProfessional.id
            healthcareProfessionalSectionFields.names = healthcareProfessional.names
            healthcareProfessionalSectionFields.specialties = healthcareProfessional.specialties
            healthcareProfessionalSectionFields.spokenLanguages = healthcareProfessional.spokenLanguages
            healthcareProfessionalSectionFields.updatedDate = healthcareProfessional.updatedDate
        }

        async function getHealthcareProfessionals() {
            const healthcareProfessionalResults = await queryHealthcareProfessionals()
            healthcareProfessionalsData.value = healthcareProfessionalResults
        }

        async function updateHealthcareProfessional():
        Promise<ServerResponse<Maybe<HealthcareProfessional>>> {
            const serverResponse = { data: {} as Maybe<HealthcareProfessional>, errors: [] as ServerError[], hasErrors: false }

            const facilitiesForRelationshipCreationArray = Array.from(selectedFacilities.value)

            if (facilitiesForRelationshipCreationArray.length) {
                //For each is used here to only add the necessary actions to the already created ref array of relationships
                facilitiesForRelationshipCreationArray.forEach(facility => createFacilitiesRelationArray(facility))
            }
            const updateHealthcareProfessionalInput: MutationUpdateHealthcareProfessionalArgs = {
                id: selectedHealthcareProfessionalId.value,
                input: {
                    acceptedInsurance: healthcareProfessionalSectionFields.acceptedInsurance,
                    degrees: healthcareProfessionalSectionFields.degrees,
                    facilityIds: facilitiesRelationsToSelectedHealthcareProfessional.value.length
                      > 0
                        ? facilitiesRelationsToSelectedHealthcareProfessional.value
                        : undefined,
                    names: healthcareProfessionalSectionFields.names,
                    specialties: healthcareProfessionalSectionFields.specialties,
                    spokenLanguages: healthcareProfessionalSectionFields.spokenLanguages
                }
            }

            const response = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                updateHealthcareProfessionalGqlMutation,
                updateHealthcareProfessionalInput
            )

            serverResponse.data = response.data?.updateHealthcareProfessional
            serverResponse.errors = response.errors
                ? response.errors
                : []
            serverResponse.hasErrors = response.hasErrors

            if (!serverResponse.errors.length && serverResponse.data) {
                //This resets the relations so that way we can have a user update multiple times without duplicating values
                facilitiesRelationsToSelectedHealthcareProfessional.value = []
                //This finds the index of the healthcare professional so we can replace the ones we have already queried
                const outdatedHealthcareProfessionalIndex = healthcareProfessionalsData.value.findIndex(
                    (healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === serverResponse.data!.id
                )

                //This will replace the data we had from the index with the new data
                if (outdatedHealthcareProfessionalIndex !== -1) {
                    healthcareProfessionalsData.value[outdatedHealthcareProfessionalIndex] = serverResponse.data!
                }

                //This will update the data with what was returned from the server and is in our database
                updateHealthcareProfessionalSectionFields(serverResponse.data!)

                /*This resets the names we removed and kept track of in
                order to change Locales if the wrong name for a locale was chosen */
                removedHealthcareProfessionalNames.value = []
            }

            return serverResponse
        }

        /* This function will create the relationships that need to be sent in the backend for
        updating facilities the healthcare professional works at */
        function createFacilitiesRelationArray(facilityForRelationship: Facility) {
            if (healthcareProfessionalSectionFields.facilityIds.includes(facilityForRelationship.id)) {
                facilitiesRelationsToSelectedHealthcareProfessional.value.push({
                    otherEntityId: facilityForRelationship.id,
                    action: RelationshipAction.Delete
                })

                return
            }

            facilitiesRelationsToSelectedHealthcareProfessional.value.push(
                {
                    otherEntityId: facilityForRelationship.id,
                    action: RelationshipAction.Create
                }
            )

            return
        }

        async function deleteHealthcareProfessional(healthcareProfessionalId: MutationDeleteHealthcareProfessionalArgs):
        Promise<ServerResponse<Maybe<DeleteResult>>> {
            const serverResponse = { data: {} as Maybe<DeleteResult>, errors: [] as ServerError[], hasErrors: false }

            const response = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                deleteHealthcareProfessionalGqlMutation,
                healthcareProfessionalId
            )

            serverResponse.data = response.data?.deleteHealthcareProfessional
            serverResponse.errors = response.errors ? response.errors : []
            serverResponse.hasErrors = response.hasErrors

            return serverResponse
        }

        const displayChosenLocaleForHealthcareProfessional = (healthcareProfessional: HealthcareProfessional) => {
            // find the name of the healthcare professional from the chosen display locale
            const nameFromChosenLocaleDisplay = healthcareProfessional.names.find(name => name.locale === localeStore.locale.code)
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
            removedHealthcareProfessionalNames,
            facilitiesRelationsToSelectedHealthcareProfessional,
            selectedFacilities
        }
    }
)

async function queryHealthcareProfessionals() {
    const searchHealthcareProfessionalsData = {
        filters: {
            limit: 400
        }
    }
    try {
        const response = await gqlClient
            .request<{ healthcareProfessionals: HealthcareProfessional[] }>
            (getAllHealthcareProfessionalsData, searchHealthcareProfessionalsData)
        return response?.healthcareProfessionals ?? []
    } catch (error) {
        console.error(`Error querying the healthcare professionals: ${JSON.stringify(error)}`)
        return []
    }
}

export async function getHealthcareProfessionalById(id: string) {
    try {
        const queryData = {
            healthcareProfessionalId: id
        }
        const result = await gqlClient.request<{ healthcareProfessional: HealthcareProfessional[] }>(
            getHealthcareProfessionalByIdGqlQuery,
            queryData
        )

        if (!result.healthcareProfessional) {
            throw new Error('The Healthcare Professional ID doesn\'t exist')
        }
        return result.healthcareProfessional
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
