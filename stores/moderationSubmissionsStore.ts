import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { Submission, MutationUpdateSubmissionArgs, Mutation, Query } from '~/typedefs/gqlTypes.js'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql.js'
import type { ServerResponse } from '~/typedefs/serverResponse'

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
        const selectedSubmissionData: Ref<Submission | undefined> = ref()
        const filteredSubmissionDataForListComponent: Ref<Submission[]> = ref([])
        const didMutationFail: Ref<boolean> = ref(false)
        const updatingSubmissionFromTopBarAndExiting: Ref<boolean> = ref(false)
        const updatingSubmissionFromTopBar: Ref<boolean> = ref(false)
        const approvingSubmissionFromTopBar: Ref<boolean> = ref(false)
        const showRejectSubmissionConfirmation: Ref<boolean> = ref(false)
        const selectedModerationListViewTabChosen: Ref<SelectedSubmissionListViewTab>
        = ref(SelectedSubmissionListViewTab.ForReview)

        function setUpdatingSubmissionFromTopBarAndExiting(newValue: boolean) {
            updatingSubmissionFromTopBarAndExiting.value = newValue
        }

        function setUpdatingSubmissionFromTopBar(newValue: boolean) {
            updatingSubmissionFromTopBar.value = newValue
        }

        function setApprovingSubmissionFromTopBar(newValue: boolean) {
            approvingSubmissionFromTopBar.value = newValue
        }

        function setShowRejectSubmissionConfirmation(newValue: boolean) {
            showRejectSubmissionConfirmation.value = newValue
        }

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

        function setSelectedModerationListViewTabChosen(selectedOption: SelectedSubmissionListViewTab) {
            selectedModerationListViewTabChosen.value = selectedOption
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

        async function updateSubmission(updateSubmissionInput: MutationUpdateSubmissionArgs):
        Promise<ServerResponse<Submission>> {
            const serverResponse = await graphQLClientRequestWithRetry<Mutation['updateSubmission']>(
                gqlClient.request.bind(gqlClient),
                updateFacilitySubmissionGqlMutation,
                updateSubmissionInput
            )

            if (serverResponse.errors?.length) {
                setDidMutationFail(true)
                return serverResponse
            }

            // Update the submission in the submissionsData array
            const updatedSubmission = serverResponse.data
            const indexOfOutdatedSubmissionData = submissionsData.value
                .findIndex(submission => submission.id === updatedSubmission.id)
            submissionsData.value[indexOfOutdatedSubmissionData] = updatedSubmission

            selectedSubmissionData.value = updatedSubmission

            return serverResponse
        }

        async function approveSubmission() {
            if (!selectedSubmissionId.value) {
                console.error('Unable to approve submission. Submission ID is required.')
                return
            }

            const approveSubmissionInput: MutationUpdateSubmissionArgs = {
                id: selectedSubmissionId.value,
                input: {
                    isApproved: true
                }
            }
            return updateSubmission(approveSubmissionInput)
        }

        async function rejectSubmission() {
            if (!selectedSubmissionId.value) {
                console.error('Unable to reject submission. Submission ID is required.')
                return
            }

            const facilityInputVariables = {
                id: selectedSubmissionId.value,
                input: {
                    isRejected: true,
                    isUnderReview: false
                }
            }

            return updateSubmission(facilityInputVariables)
        }

        return { getSubmissions,
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
            updatingSubmissionFromTopBar,
            setUpdatingSubmissionFromTopBar,
            updatingSubmissionFromTopBarAndExiting,
            setUpdatingSubmissionFromTopBarAndExiting,
            showRejectSubmissionConfirmation,
            setShowRejectSubmissionConfirmation,
            approvingSubmissionFromTopBar,
            setApprovingSubmissionFromTopBar,
            selectedModerationListViewTabChosen,
            setSelectedModerationListViewTabChosen,
            updateSubmission,
            approveSubmission,
            rejectSubmission }
    }
)

async function querySubmissions(): Promise<Submission[]> {
    try {
        const submissionsFilters = {
            filters: {
                id: undefined,
                limit: 100
            }
        }

        const serverResponse = await graphQLClientRequestWithRetry<Query['submissions']>(
            gqlClient.request.bind(gqlClient),
            getSubmissionsGqlQuery,
            submissionsFilters
        )

        return serverResponse?.data ?? []
    } catch (error) {
        console.error(`Error querying the submissions: ${JSON.stringify(error)}`)
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

const updateFacilitySubmissionGqlMutation = gql`
mutation Mutation($id: ID!, $input: UpdateSubmissionInput!) {
  updateSubmission(id: $id, input: $input) {
    id
    googleMapsUrl
    healthcareProfessionalName
    spokenLanguages
    facility {
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
      healthcareProfessionalIds
      mapLatitude
      mapLongitude
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
