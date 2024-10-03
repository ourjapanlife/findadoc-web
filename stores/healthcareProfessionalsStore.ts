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

