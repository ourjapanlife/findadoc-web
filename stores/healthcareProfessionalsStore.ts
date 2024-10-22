import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { HealthcareProfessional, MutationUpdateHealthcareProfessionalArgs } from '~/typedefs/gqlTypes'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])

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

        return {
            getHealthcareProfessionals,
            healthcareProfessionalsData,
            updateHealthcareProfessional
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
