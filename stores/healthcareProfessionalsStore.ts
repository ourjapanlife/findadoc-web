import type { Maybe } from 'graphql/jsutils/Maybe'
import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import { type DeleteResult, type HealthcareProfessional,
    type Mutation,
    type MutationDeleteHealthcareProfessionalArgs,
    type MutationUpdateHealthcareProfessionalArgs,
    Locale } from '~/typedefs/gqlTypes'
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

        const selectedNameLocaleToUpdate = reactive({
            localizedFirstName: '',
            localizedMiddleName: '',
            localizedLastName: '',
            nameLocale: Locale.Und,
            nameLocaleToChange: Locale.Und
        })

        function setSelectedHealthcareProfessional(healthcareProfessionalId: string) {
            selectedHealthcareProfessionalId.value = healthcareProfessionalId
            const selectedHealthcareProfessionalData = healthcareProfessionalsData.value
                .find((healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === healthcareProfessionalId)
            if (selectedHealthcareProfessionalData) {
                updateHealthcareProfessionalSectionFields(selectedHealthcareProfessionalData)
            }
        }

        function updateHealthcareProfessionalSectionFields(healthcareProfessional: HealthcareProfessional) {
            healthcareProfessionalSectionFields.__typename = healthcareProfessional.__typename
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

        function setSelectedNameLocaleToUpdate(nameLocale: Locale) {
            if (!healthcareProfessionalSectionFields.names.length) return

            const nameLocaleToEdit = healthcareProfessionalSectionFields.names.find(name => name.locale === nameLocale)

            if (!nameLocaleToEdit) return
            selectedNameLocaleToUpdate.localizedFirstName = nameLocaleToEdit.firstName
            selectedNameLocaleToUpdate.localizedLastName = nameLocaleToEdit.lastName
            selectedNameLocaleToUpdate.localizedMiddleName = nameLocaleToEdit.middleName
                ? nameLocaleToEdit.middleName
                : ''
            selectedNameLocaleToUpdate.nameLocale = nameLocale
            selectedNameLocaleToUpdate.nameLocaleToChange = nameLocale
        }

        function updateHealthcareProfessionalNameValues() {
            if (!healthcareProfessionalSectionFields) return

            if (!healthcareProfessionalSectionFields.names) return

            const localeIndex = healthcareProfessionalSectionFields.names
                .findIndex(nameObject => nameObject.locale === selectedNameLocaleToUpdate.nameLocaleToChange)
            if (localeIndex === -1) return
            console.log(selectedNameLocaleToUpdate)
            healthcareProfessionalSectionFields.names[localeIndex].firstName = selectedNameLocaleToUpdate.localizedFirstName
            healthcareProfessionalSectionFields.names[localeIndex].middleName
            = selectedNameLocaleToUpdate.localizedMiddleName
                    ? selectedNameLocaleToUpdate.localizedMiddleName
                    : ''
            healthcareProfessionalSectionFields.names[localeIndex].lastName = selectedNameLocaleToUpdate.localizedLastName
            healthcareProfessionalSectionFields.names[localeIndex].locale = selectedNameLocaleToUpdate.nameLocale

            // Once the name is updated in the array we want to reset the values in case we need to edit a different one
            selectedNameLocaleToUpdate.localizedFirstName = ''
            selectedNameLocaleToUpdate.localizedLastName = ''
            selectedNameLocaleToUpdate.localizedMiddleName = ''
            selectedNameLocaleToUpdate.nameLocale = Locale.Und
            selectedNameLocaleToUpdate.nameLocaleToChange = Locale.Und
        }

        async function getHealthcareProfessionals() {
            const healthcareProfessionalResults = await queryHealthcareProfessionals()
            healthcareProfessionalsData.value = healthcareProfessionalResults
        }

        async function updateHealthcareProfessional(healthcareProfessional: MutationUpdateHealthcareProfessionalArgs) {
            try {
                return await graphQLClientRequestWithRetry(
                    gqlClient.request.bind(gqlClient),
                    updateHealthcareProfessionalGqlMutation,
                    healthcareProfessional
                )
            } catch (error) {
                console.error('Failed to update healthcare professional:', error)
            }
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
            updateHealthcareProfessionalNameValues,
            selectedNameLocaleToUpdate,
            setSelectedNameLocaleToUpdate
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
            throw new Error(`The Healthcare Professional ID doesn't exist`)
        }
        return result.healthcareProfessional
    } catch (error: unknown) {
        console.log(`Error retrieving healthcare professional by id: ${id}: ${JSON.stringify(error)}`)
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
mutation Mutation($updateHealthcareProfessionalId: ID!, $input: UpdateHealthcareProfessionalInput!) {
  updateHealthcareProfessional(id: $updateHealthcareProfessionalId, input: $input) {
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
