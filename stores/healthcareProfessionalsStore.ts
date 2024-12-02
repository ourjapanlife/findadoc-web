import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { HealthcareProfessional,
    MutationDeleteHealthcareProfessionalArgs,
    MutationUpdateHealthcareProfessionalArgs } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])
        const selectedHealthcareProfessionalId: Ref<string> = ref('')

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

        return {
            getHealthcareProfessionals,
            healthcareProfessionalsData,
            updateHealthcareProfessional,
            selectedHealthcareProfessionalId,
            deleteHealthcareProfessional
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
        console.log(`Error querying the healthcare professionals: ${JSON.stringify(error)}`)
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
