import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import type { HealthcareProfessional } from '~/typedefs/gqlTypes'

export const useModerationSearchHealthcareProfessionalsStore = defineStore(
    'moderationSearchHealthcareProfessionalsStore',
    () => {
        const healthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])
        async function getHealthcareProfessionals() {
            const healthcareProfessionalsResult = await queryHealthcareProfessional()
            healthcareProfessionals.value = healthcareProfessionalsResult
        }
        return { getHealthcareProfessionals, healthcareProfessionals }
    }
)

async function queryHealthcareProfessional() {
    try {
        const healthcareProfessionalFilters = {
            filters: {}
        }
        const result = await gqlClient.request<{ healthcareProfessionals: HealthcareProfessional[] }>(
            getHealthcareProfessionalsGqlQuery,
            healthcareProfessionalFilters
        )
        return result.healthcareProfessionals ?? []
    } catch (error: unknown) {
        console.log(`Error querying the healthcare professionals: ${JSON.stringify(error)}`)
        return []
    }
}

const getHealthcareProfessionalsGqlQuery = gql`
    query Query($filters: HealthcareProfessionalSearchFilters!) {
  healthcareProfessionals(filters: $filters) {
    names {
      firstName
      lastName
    }
    id
    specialties
  }
}`
