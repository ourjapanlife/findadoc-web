import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { HealthcareProfessional,
    MutationDeleteHealthcareProfessionalArgs,
    MutationUpdateHealthcareProfessionalArgs,
    Insurance,
    Degree,
    Specialty,
    LocalizedNameInput } from '~/typedefs/gqlTypes'
import { Locale } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'
import { useLocaleStore } from '~/stores/localeStore'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const localeStore = useLocaleStore()

        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const selectedHealthcareProfessionalData: Ref<HealthcareProfessional | undefined> = ref()
        const healthcareProfessionalSectionFields = reactive({
            healthcareProfessionalNameArray: [] as Array<LocalizedNameInput>,
            localizedFirstName: '' as string,
            localizedLastName: '' as string,
            localizedMiddleName: '' as string,
            nameLocale: Locale.EnUs as Locale,
            healthcareProfessionalAcceptedInsurances: [] as Array<Insurance>,
            healthcareProfessionalDegrees: [] as Array<Degree>,
            healthcareProfessionalSpecialties: [] as Array<Specialty>,
            healthcareProfessionalLocales: [] as Array<Locale>
        })

        function setSelectedHealthcareProfessional(healthcareProfessionalId: string) {
            selectedHealthcareProfessionalData.value = healthcareProfessionalsData.value
                .find((healthcareProfessional: HealthcareProfessional) => healthcareProfessional.id === healthcareProfessionalId)
        }

        function initializeHealthcareProfessionalValues(selectedHealthcareProfessionalData: HealthcareProfessional | undefined) {
            if (!selectedHealthcareProfessionalData) return

            healthcareProfessionalSectionFields.healthcareProfessionalNameArray = selectedHealthcareProfessionalData.names
            healthcareProfessionalSectionFields.localizedFirstName = selectedHealthcareProfessionalData.names[0].firstName
            healthcareProfessionalSectionFields.localizedMiddleName = selectedHealthcareProfessionalData.names[0].middleName
                ? selectedHealthcareProfessionalData.names[0].middleName
                : ''
            healthcareProfessionalSectionFields.localizedLastName = selectedHealthcareProfessionalData.names[0].lastName
            healthcareProfessionalSectionFields.nameLocale = selectedHealthcareProfessionalData.names[0].locale
            healthcareProfessionalSectionFields.healthcareProfessionalAcceptedInsurances
                = selectedHealthcareProfessionalData.acceptedInsurance
            healthcareProfessionalSectionFields.healthcareProfessionalDegrees
                = selectedHealthcareProfessionalData.degrees
            healthcareProfessionalSectionFields.healthcareProfessionalSpecialties
                = selectedHealthcareProfessionalData.specialties
            healthcareProfessionalSectionFields.healthcareProfessionalLocales
                = selectedHealthcareProfessionalData.spokenLanguages
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

        async function deleteHealthcareProfessional(healthcareProfessionalId: MutationDeleteHealthcareProfessionalArgs) {
            try {
                return await graphQLClientRequestWithRetry(
                    gqlClient.request.bind(gqlClient),
                    deleteHealthcareProfessionalGqlMutation,
                    healthcareProfessionalId
                )
            } catch (error) {
                console.error('Failed to delete healthcare professional:', error)
            }
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
            selectedHealthcareProfessionalData,
            initializeHealthcareProfessionalValues
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
mutation Mutation($deleteHealthcareProfessionalId: ID!) {
  deleteHealthcareProfessional(id: $deleteHealthcareProfessionalId) {
    isSuccessful
  }
}
`
