import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { type Submission } from '~/typedefs/gqlTypes.js'

export enum SelectedSubmissionListViewTab {
    ForReview = 'FOR_REVIEW',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export const useModerationSubmissionsStore = defineStore(
    'submissionsStore',
    () => {
        const submissionsData: Ref<Submission[]> = ref([])
        const selectedSubmissionId: Ref<string> = ref('')
        const selectedSubmissionData: Ref<Submission | undefined> = ref()
        const filteredSubmissionDataForListComponent: Ref<Submission[]> = ref([])

        async function getSubmissions() {
            const submissionsSearchResults = await querySubmissions()
            submissionsData.value = submissionsSearchResults
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
            selectedSubmissionData }
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
