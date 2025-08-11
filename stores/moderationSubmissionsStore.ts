import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { fetchSubmissionsWithCount } from '../utils/graphqlHelpers'
import { useI18n } from 'vue-i18n'
import type { Submission, MutationUpdateSubmissionArgs, Mutation, SubmissionSearchFilters } from '~/typedefs/gqlTypes.js'
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

        // Used for store the total number of submissions found by the current search query.
        const totalSubmissionsCount: Ref<number> = ref(0)
        // Used for store the starting index (offset) for the current page of results.
        const currentOffset: Ref<number> = ref(0)
        const itemsPerPage: Ref<number> = ref(25)
        const hasNextPage = computed(() => currentOffset.value + itemsPerPage.value < totalSubmissionsCount.value)
        const hasPrevPage = computed(() => currentOffset.value > 0)

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
            const filters: SubmissionSearchFilters = {
                offset: currentOffset.value,
                limit: itemsPerPage.value
            }
            try {
                // Call the utility function to fetch the paginated data and the total count.
                const { filteredSearchResults, totalCount } = await fetchSubmissionsWithCount(filters)
                submissionsData.value = filteredSearchResults
                totalSubmissionsCount.value = totalCount
                // Apply a secondary filter on the fetched data based on the currently selected tab.
                filterSubmissionByStatus(selectedModerationListViewTabChosen.value as unknown as SubmissionStatus)
            } catch (error) {
                console.error(`Error fetching submissions: ${JSON.stringify(error)}`)
                //eslint-disable-next-line
                alert('Error loading submissions. Please try again later.')
                submissionsData.value = []
                totalSubmissionsCount.value = 0
            }
        }

        function setOffset(newOffset: number) {
            currentOffset.value = newOffset
            getSubmissions()
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

        async function updateSubmission(
  updateSubmissionInput: MutationUpdateSubmissionArgs
        ): Promise<ServerResponse<Mutation>> {
            const serverResponse = await graphQLClientRequestWithRetry<Mutation>(
                gqlClient.request.bind(gqlClient),
                updateFacilitySubmissionGqlMutation,
                updateSubmissionInput
            )

            if (serverResponse.errors?.length) {
                setDidMutationFail(true)
                return serverResponse
            }

            const updatedSubmission = serverResponse.data?.updateSubmission
            if (!updatedSubmission) {
                setDidMutationFail(true)
                return serverResponse
            }

            // Update the submission in the submissionsData array
            const indexOfOutdatedSubmissionData = submissionsData.value
                .findIndex(submission => submission.id === updatedSubmission.id)

            if (indexOfOutdatedSubmissionData === -1) {
                submissionsData.value.push(updatedSubmission)
            } else {
                submissionsData.value[indexOfOutdatedSubmissionData] = updatedSubmission
            }

            selectedSubmissionData.value = updatedSubmission

            return serverResponse
        }

        async function approveSubmission() {
            if (!selectedSubmissionId.value) {
                console.error(useTranslation('moderationSubmissionErrors.unableToApprove'))
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
                console.error(useTranslation('moderationSubmissionErrors.unableToReject'))
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

        function setItemsPerPage(newLimit: number) {
            itemsPerPage.value = newLimit
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
            rejectSubmission,
            totalSubmissionsCount,
            currentOffset,
            itemsPerPage,
            setOffset,
            hasNextPage,
            hasPrevPage,
            setItemsPerPage
        }
    }
)

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
      additionalInfoForPatients
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
