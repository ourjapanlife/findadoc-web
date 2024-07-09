import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import type { Submission } from '~/typedefs/gqlTypes.js'

export enum SelectedSubmissionListViewTab {
    ForReview = 'FOR_REVIEW',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export enum SubmissionStatus {
    InReview = 'IN_REVIEW',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export enum SelectedModerationListView {
    Facilities = 'FACILITIES',
    HealthcareProfessionals = 'HEALTHCARE_PROFESSIONALS',
    Submissions = 'SUBMISSIONS'
}

export const useModerationSubmissionsStore = defineStore(
    'modSubmissionsStore',
    () => {
        const submissionsData: Ref<Submission[]> = ref([])
        const selectedModerationListViewChosen: Ref<SelectedModerationListView> = ref(SelectedModerationListView.Submissions)
        const selectedSubmissionId: Ref<string> = ref('')
        const selectedFacilityId: Ref<string> = ref('')
        const selectedHealthcareProfessionalId: Ref<string> = ref('')
        const selectedSubmissionData: Ref<Submission | undefined> = ref()
        const filteredSubmissionDataForListComponent: Ref<Submission[]> = ref([])
        const didMutationFail: Ref<boolean> = ref(false)

        function setDidMutationFail(newValue: boolean) {
            didMutationFail.value = newValue
        }

        async function getSubmissions() {
            const submissionsSearchResults = await querySubmissions()
            submissionsData.value = submissionsSearchResults
        }

        function setSelectedModerationListViewChosen(selectedOption: SelectedModerationListView) {
            selectedModerationListViewChosen.value = selectedOption
        }

        function filterSelectedSubmission(submissionId: string | undefined) {
            selectedSubmissionData.value = submissionsData.value.find(submission => submission.id === submissionId)
        }

        function filterSubmissionByStatus(submissionStatus: SubmissionStatus) {
            switch (submissionStatus) {
                case SubmissionStatus.InReview:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => {
                            const isNewSubmission = !submission.isRejected && !submission.isApproved && !submission.isUnderReview
                            return submission.isUnderReview || isNewSubmission
                        })
                    break
                case SubmissionStatus.Approved:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => submission.isApproved)
                    break
                case SubmissionStatus.Rejected:
                    filteredSubmissionDataForListComponent.value = submissionsData.value
                        .filter((submission: Submission) => submission.isRejected)
                    break
            }
        }
        return {
            getSubmissions,
            submissionsData,
            filterSubmissionByStatus,
            filteredSubmissionDataForListComponent,
            selectedSubmissionId,
            filterSelectedSubmission,
            selectedSubmissionData,
            didMutationFail,
            setDidMutationFail,
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

