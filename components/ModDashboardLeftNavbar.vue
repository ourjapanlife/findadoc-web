<template>
    <div>
        <select
            v-model="selectedDashboardView"
            class="font-semibold p-1 border-b border-black mb-2"
            data-testid="submission-type-select"
            @change="updateSelectedDashboardView"
        >
            <option :value="SelectedModerationListView.Submissions">
                {{ $t("modDashboardLeftNav.submissions") }}
            </option>
            <option :value="SelectedModerationListView.Facilities">
                {{ $t("modDashboardLeftNav.facilities") }}
            </option>
            <option :value="SelectedModerationListView.HealthcareProfessionals">
                {{ $t("modDashboardLeftNav.healthcareProfessionals") }}
            </option>
        </select>
        <div
            v-show="moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions"
            class="flex flex-col"
        >
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGNoteStackAddSvg class="h-4" />
                <button
                    data-testid="mod-dashboard-leftnav-for-review"
                    class="flex flex-row items-center text-start p-1"
                    @click="updateSubmissionListViewState(SelectedSubmissionListViewTab.ForReview)"
                >
                    {{ $t("modDashboardLeftNav.forReview") }} ({{ autofillStatusCount.forReviewCount }})
                </button>
            </div>
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGCheckBoxSvg class="h-5" />
                <button
                    data-testid="mod-dashboard-leftnav-approved"
                    class="flex flex-row items-center text-start p-1 "
                    @click=" updateSubmissionListViewState(SelectedSubmissionListViewTab.Approved)"
                >
                    {{ $t("modDashboardLeftNav.approved") }} ({{ autofillStatusCount.approvedCount }})
                </button>
            </div>
            <div class="flex flex-row w-4/5 justify-start items-center ">
                <SVGDisabledByDefault class="h-4" />
                <button
                    data-testid="mod-dashboard-leftnav-rejected"
                    class="flex flex-row items-center text-start p-1"
                    @click="updateSubmissionListViewState(SelectedSubmissionListViewTab.Rejected)"
                >
                    {{ $t("modDashboardLeftNav.rejected") }} ({{ autofillStatusCount.rejectedCount }})
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, watchEffect } from 'vue'
import SVGNoteStackAddSvg from '../assets/icons/note-stack-add.svg'
import SVGCheckBoxSvg from '../assets/icons/check-box.svg'
import SVGDisabledByDefault from '../assets/icons/disabled-by-default.svg'
import { useModerationSubmissionsStore, SelectedSubmissionListViewTab, SubmissionStatus, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'
import type { Submission } from '~/typedefs/gqlTypes'

const moderationSubmissionsStore = useModerationSubmissionsStore()

const selectedDashboardView: Ref<SelectedModerationListView> = ref(moderationSubmissionsStore.selectedModerationListViewChosen)

const updateSubmissionListViewState = (submissionListViewOptionValue: SelectedSubmissionListViewTab) => {
    switch (submissionListViewOptionValue) {
        case SelectedSubmissionListViewTab.Approved:
            moderationSubmissionsStore.filterSubmissionByStatus(SubmissionStatus.Approved)
            break
        case SelectedSubmissionListViewTab.ForReview:
            moderationSubmissionsStore.filterSubmissionByStatus(SubmissionStatus.InReview)
            break
        case SelectedSubmissionListViewTab.Rejected:
            moderationSubmissionsStore.filterSubmissionByStatus(SubmissionStatus.Rejected)
            break
    }
}

const updateSelectedDashboardView = (event: Event) => {
    const selectedOption = (event.target as HTMLSelectElement).value as SelectedModerationListView
    moderationSubmissionsStore.setSelectedModerationListViewChosen(selectedOption)
}

function createCountsForSubmissionListView(submissions: Submission[]) {
    return submissions.reduce((statusCountObject, submission) => {
        const isNewSubmission = !submission.isRejected && !submission.isApproved && !submission.isUnderReview
        if (submission.isUnderReview) {
            statusCountObject.forReviewCount += 1
        }
        if (submission.isApproved) {
            statusCountObject.approvedCount += 1
        }
        if (submission.isRejected) {
            statusCountObject.rejectedCount += 1
        }
        if (isNewSubmission) {
            statusCountObject.forReviewCount += 1
        }
        return statusCountObject
    }, {
        forReviewCount: 0,
        approvedCount: 0,
        rejectedCount: 0
    })
}

const autofillStatusCount = computed(() => createCountsForSubmissionListView(moderationSubmissionsStore.submissionsData))

watchEffect(() => {
    if (moderationSubmissionsStore.submissionsData.length) {
        moderationSubmissionsStore.filterSubmissionByStatus(SubmissionStatus.InReview)
    }
})
</script>
