import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { fetchSubmissionsWithCount } from '../utils/graphqlHelpers'
import type { Submission, MutationUpdateSubmissionArgs, Mutation, SubmissionSearchFilters } from '~/typedefs/gqlTypes.js'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql.js'
import type { ServerResponse } from '~/typedefs/serverResponse'
import { useTranslation } from '~/composables/useTranslation'

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

interface SubmissionStatusCounts {
    forReviewCount: number
    approvedCount: number
    rejectedCount: number
}

function getStatusFiltersForTab(tab: SelectedSubmissionListViewTab): Partial<SubmissionSearchFilters> {
    switch (tab) {
        case SelectedSubmissionListViewTab.Approved:
            return { isApproved: true }
        case SelectedSubmissionListViewTab.Rejected:
            return { isRejected: true }
        case SelectedSubmissionListViewTab.ForReview:
        default:
            return { isForReview: true }
    }
}

export const useModerationSubmissionsStore = defineStore(
    'modSubmissionsStore',
    () => {
        const submissionsData: Ref<Submission[]> = ref([])
        const selectedModerationListViewChosen: Ref<SelectedModerationListView> = ref(SelectedModerationListView.Submissions)
        const selectedSubmissionId: Ref<string> = ref('')
        const selectedSubmissionData: Ref<Submission | undefined> = ref()
        const filteredSubmissionDataForListComponent: Ref<Submission[]> = ref([])
        const submissionSearchQuery: Ref<string> = ref('')
        const didMutationFail: Ref<boolean> = ref(false)
        const selectedModerationListViewTabChosen: Ref<SelectedSubmissionListViewTab>
            = ref(SelectedSubmissionListViewTab.ForReview)
        const statusTotalCounts: Ref<SubmissionStatusCounts> = ref({
            forReviewCount: 0,
            approvedCount: 0,
            rejectedCount: 0
        })

        const totalSubmissionsCount: Ref<number> = ref(0)
        const currentOffset: Ref<number> = ref(0)
        const itemsPerPage: Ref<number> = ref(25)
        const hasNextPage = computed(() => currentOffset.value + itemsPerPage.value < totalSubmissionsCount.value)
        const hasPrevPage = computed(() => currentOffset.value > 0)

        function setDidMutationFail(newValue: boolean) {
            didMutationFail.value = newValue
        }

        function applySearchFilter(submissions: Submission[]) {
            const query = submissionSearchQuery.value.trim().toLowerCase()
            if (!query) {
                return submissions
            }
            return submissions.filter((submission: Submission) => {
                const submissionId = submission.id.toLowerCase()
                const healthcareProfessionalName = submission.healthcareProfessionalName.toLowerCase()
                const facilityNameEn = submission.facility?.nameEn?.toLowerCase() || ''
                const facilityNameJa = submission.facility?.nameJa?.toLowerCase() || ''
                return submissionId.includes(query)
                  || healthcareProfessionalName.includes(query)
                  || facilityNameEn.includes(query)
                  || facilityNameJa.includes(query)
            })
        }

        async function getSubmissions() {
            const statusFilters = getStatusFiltersForTab(selectedModerationListViewTabChosen.value)
            const filters: SubmissionSearchFilters = {
                offset: currentOffset.value,
                limit: itemsPerPage.value,
                ...statusFilters
            }
            try {
                const { filteredSearchResults, totalCount } = await fetchSubmissionsWithCount(filters)
                submissionsData.value = filteredSearchResults
                totalSubmissionsCount.value = totalCount
                filteredSubmissionDataForListComponent.value = applySearchFilter(filteredSearchResults)
            } catch (error) {
                console.error(`Error fetching submissions: ${JSON.stringify(error)}`)
                //eslint-disable-next-line
                alert('Error loading submissions. Please try again later.')
                submissionsData.value = []
                filteredSubmissionDataForListComponent.value = []
                totalSubmissionsCount.value = 0
            }
        }

        async function fetchStatusCounts() {
            try {
                const [forReviewResult, approvedResult, rejectedResult] = await Promise.all([
                    fetchSubmissionsWithCount({ isForReview: true, limit: 1, offset: 0 }),
                    fetchSubmissionsWithCount({ isApproved: true, limit: 1, offset: 0 }),
                    fetchSubmissionsWithCount({ isRejected: true, limit: 1, offset: 0 })
                ])

                statusTotalCounts.value = {
                    forReviewCount: forReviewResult.totalCount,
                    approvedCount: approvedResult.totalCount,
                    rejectedCount: rejectedResult.totalCount
                }
            } catch (error) {
                console.error(`Error fetching submission status counts: ${JSON.stringify(error)}`)
            }
        }

        function setOffset(newOffset: number) {
            currentOffset.value = newOffset
            getSubmissions()
        }

        function setSelectedModerationListViewChosen(selectedOption: SelectedModerationListView) {
            selectedModerationListViewChosen.value = selectedOption
        }

        async function setSelectedModerationListViewTabChosen(selectedOption: SelectedSubmissionListViewTab) {
            selectedModerationListViewTabChosen.value = selectedOption
            currentOffset.value = 0
            await getSubmissions()
        }

        function filterSelectedSubmission(submissionId: string | undefined) {
            selectedSubmissionData.value = submissionsData.value.find(submission => submission.id === submissionId)
        }

        function setSubmissionSearchQuery(newQuery: string) {
            submissionSearchQuery.value = newQuery
            filteredSubmissionDataForListComponent.value = applySearchFilter(submissionsData.value)
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

            const indexOfOutdatedSubmissionData = submissionsData.value
                .findIndex(submission => submission.id === updatedSubmission.id)

            if (indexOfOutdatedSubmissionData === -1) {
                submissionsData.value.push(updatedSubmission)
            } else {
                submissionsData.value[indexOfOutdatedSubmissionData] = updatedSubmission
            }

            selectedSubmissionData.value = updatedSubmission
            filteredSubmissionDataForListComponent.value = applySearchFilter(submissionsData.value)
            await fetchStatusCounts()

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
            fetchStatusCounts,
            submissionsData,
            filteredSubmissionDataForListComponent,
            submissionSearchQuery,
            setSubmissionSearchQuery,
            selectedSubmissionId,
            filterSelectedSubmission,
            selectedSubmissionData,
            didMutationFail,
            setDidMutationFail,
            selectedModerationListViewChosen,
            setSelectedModerationListViewChosen,
            selectedModerationListViewTabChosen,
            setSelectedModerationListViewTabChosen,
            statusTotalCounts,
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
