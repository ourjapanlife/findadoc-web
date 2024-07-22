import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import type { Submission, Facility, HealthcareProfessional } from '~/typedefs/gqlTypes.js'

export enum SelectedSubmissionListViewTab {
    ForReview = 'FOR_REVIEW',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export enum SelectedModerationListView {
    Facilities = 'FACILITIES',
    HealthcareProfessionals = 'HEALTHCARE_PROFESSIONALS',
    Submissions = 'SUBMISSIONS'
}

export const useModerationSubmissionsListStore = defineStore(
    'submissionsListStore',
    () => {
        const submissionsData: Ref<Submission[]> = ref([])
        const healthcareProfessionalsData: Ref<HealthcareProfessional[]>
        = ref([])
        const facilityData: Ref<Facility[]> = ref([])
        const selectedModerationListViewChosen: Ref<SelectedModerationListView> = ref(SelectedModerationListView.Submissions)
        const selectedSubmissionId: Ref<string> = ref('')
        const selectedFacilityId: Ref<string> = ref('')
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const selectedSubmissionData: Ref<Submission | undefined> = ref()
        const filteredSubmissionDataForListComponent: Ref<Submission[]> = ref([])

        async function getSubmissions() {
            const submissionsSearchResults = await querySubmissions()
            submissionsData.value = submissionsSearchResults
        }

        async function getFacilities() {
            const facilityResults = await queryFacilities()
            facilityData.value = facilityResults
        }

        async function getHealthcareProfessionals() {
            const healthcareProfessionalResults = await queryHealthcareProfessionals()
            healthcareProfessionalsData.value = healthcareProfessionalResults
        }

        function setSelectedModerationListViewChosen(selectedOption: SelectedModerationListView) {
            selectedModerationListViewChosen.value = selectedOption
        }

        function filterSelectedSubmission(submissionId: string | undefined) {
            selectedSubmissionData.value = submissionsData.value.find(submission => submission.id === submissionId)
        }

        function filterSubmissionsBySelectedTab(tabValue: SelectedSubmissionListViewTab) {
            switch (tabValue) {
                case SelectedSubmissionListViewTab.ForReview:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => {
                            const isNewSubmission = !submission.isRejected && !submission.isApproved && !submission.isUnderReview
                            return submission.isUnderReview || isNewSubmission
                        })
                    break
                case SelectedSubmissionListViewTab.Approved:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => submission.isApproved)
                    break
                case SelectedSubmissionListViewTab.Rejected:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => submission.isRejected)
                    break
            }
        }
        return { getSubmissions,
            submissionsData,
            filterSubmissionsBySelectedTab,
            filteredSubmissionDataForListComponent,
            selectedSubmissionId,
            filterSelectedSubmission,
            selectedSubmissionData,
            getFacilities,
            facilityData,
            getHealthcareProfessionals,
            healthcareProfessionalsData,
            selectedModerationListViewChosen,
            setSelectedModerationListViewChosen,
            selectedFacilityId,
            selectedHealthcareProfessionalId }
    }
)

async function querySubmissions() {
    try {
        const submissionsFilters = {
            filters: {
                id: undefined
            }
        }

        const result = await gqlClient.request<{ submissions: Submission[] }>(
            getSubmissionsGqlQuery,
            submissionsFilters
        )
        return result?.submissions ?? []
    } catch (error) {
        console.log(`Error querying the submissions: ${JSON.stringify(error)}`)
        return []
    }
}

async function queryFacilities() {
    const searchFacilitiesData = {
        filters: {
            limit: 400
        }
    }
    try {
        const response = await gqlClient.request<{ facilities: Facility[] }>(getAllFacilitiesForModeration, searchFacilitiesData)
        return response?.facilities ?? []
    } catch (error) {
        console.log(`Error querying the submissions: ${JSON.stringify(error)}`)
        return []
    }
}

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

const getSubmissionsGqlQuery = gql`
   query Submissions($filters: SubmissionSearchFilters!) {
  submissions(filters: $filters) {
    id
    googleMapsUrl
    healthcareProfessionalName
    spokenLanguages
    facility {
      id
      mapLatitude
      mapLongitude
      nameEn
      nameJa
      contact {
        googleMapsUrl
        email
        phone
        website
        address {
          postalCode
          prefectureEn
          cityEn
          addressLine1En
          addressLine2En
          prefectureJa
          cityJa
          addressLine1Ja
          addressLine2Ja
        }
      }
      healthcareProfessionalIds
    }
    healthcareProfessionals {
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
    }
    isUnderReview
    isApproved
    isRejected
    createdDate
    updatedDate
    notes
  }
}`

const getAllFacilitiesForModeration = gql`
    query Facilities($filters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            nameEn
            nameJa
            contact {
                googleMapsUrl
                email
                phone
                website
                address {
                    postalCode
                    prefectureEn
                    cityEn
                    addressLine1En
                    addressLine2En
                    prefectureJa
                    cityJa
                    addressLine1Ja
                    addressLine2Ja
                }
            }
            mapLatitude
            mapLongitude
            healthcareProfessionalIds
            createdDate
            updatedDate
        }
    }
`

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
