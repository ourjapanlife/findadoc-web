import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import type { HealthcareProfessional } from '~/typedefs/gqlTypes'
import { gqlClient } from '~/utils/graphql'

export const useHealthcareProfessionalsStore = defineStore(
    'healthcareProfessionalsStore',
    () => {
        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])

        async function getHealthcareProfessionals() {
            const healthcareProfessionalResults = await queryHealthcareProfessionals()
            healthcareProfessionalsData.value = healthcareProfessionalResults
        }

        return {
            getHealthcareProfessionals,
            healthcareProfessionalsData
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
        console.log(`Error querying the submissions: ${JSON.stringify(error)}`)
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
