<template>
    <div>
        <select
            class="font-semibold p-1 border-b border-black mb-2"
            @change="updateSelectedDashboardView"
        >
            <option value="facilities">
                {{ $t("modDashboardLeftNav.facilities") }}
            </option>
            <option value="healthcareProfessionals">
                {{ $t("modDashboardLeftNav.healthcareProfessionals") }}
            </option>
        </select>
        <div class="flex flex-col">
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGNoteStackAddSvg class="h-4" />
                <button
                    data-testid="mod-dashboard-leftnav-for-review"
                    class="flex flex-row items-center text-start p-1"
                    @click="updateSubmissionListViewState('forReview')"
                >
                    {{ $t("modDashboardLeftNav.forReview") }} ({{ autofillStatusCount.forReviewCount }})
                </button>
            </div>
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGCheckBoxSvg class="h-5" />
                <button
                    data-testid="mod-dashboard-leftnav-approved"
                    class="flex flex-row items-center text-start p-1 "
                    @click=" updateSubmissionListViewState('approved')"
                >
                    {{ $t("modDashboardLeftNav.approved") }} ({{ autofillStatusCount.approvedCount }})
                </button>
            </div>
            <div class="flex flex-row w-4/5 justify-start items-center ">
                <SVGDisabledByDefault class="h-4" />
                <button
                    data-testid="mod-dashboard-leftnav-rejected"
                    class="flex flex-row items-center text-start p-1"
                    @click="updateSubmissionListViewState('rejected')"
                >
                    {{ $t("modDashboardLeftNav.rejected") }} ({{ autofillStatusCount.rejectedCount }})
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import SVGNoteStackAddSvg from '../assets/icons/note-stack-add.svg'
import SVGCheckBoxSvg from '../assets/icons/check-box.svg'
import SVGDisabledByDefault from '../assets/icons/disabled-by-default.svg'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import type { Submission } from '~/typedefs/gqlTypes'

const moderationSubmissionsStore = useModerationSubmissionsStore ()

const selectedSubmissionListView: Ref<string> = ref('forReview')
const selectedDashboardView: Ref<string> = ref('facilities')

const updateSubmissionListViewState = (submissionListViewOptionValue: string) => {
    selectedSubmissionListView.value = submissionListViewOptionValue
}

const updateSelectedDashboardView = (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value
    selectedDashboardView.value = selectedValue
}

function createCountsForSubmissionListView(submissions: Submission[]) {
    return submissions.reduce((statusCountObject, submission) => {
        if (submission.isUnderReview) {
            statusCountObject.forReviewCount += 1
        }
        if (submission.isApproved) {
            statusCountObject.approvedCount += 1
        }
        if (submission.isRejected) {
            statusCountObject.rejectedCount += 1
        }
        return statusCountObject
    }, {
        forReviewCount: 0,
        approvedCount: 0,
        rejectedCount: 0
    })
}

const autofillStatusCount = computed(() => createCountsForSubmissionListView(moderationSubmissionsStore.submissionsData))
</script>
