<template>
    <div class="flex justify-center items-center gap-5 mb-10 w-full min-h-20">
        <div
            v-if="isSubmissionsViewActive"
            class="flex gap-5"
        >
            <button
                type="button"
                :class="[baseClass, currentTab === SelectedSubmissionListViewTab.ForReview ? activeClass : inactiveClass]"
                @click="updateSubmissionListViewState(SelectedSubmissionListViewTab.ForReview)"
            >
                <SVGNoteStackAddSvg class="h-5" />
                <span class="font-bold text-lg">
                    {{ t("modDashboardLeftNav.forReview") }} ({{ autofillStatusCount.forReviewCount }})
                </span>
            </button>

            <button
                type="button"
                :class="[baseClass, currentTab === SelectedSubmissionListViewTab.Approved ? activeClass : inactiveClass]"
                @click="updateSubmissionListViewState(SelectedSubmissionListViewTab.Approved)"
            >
                <SVGCheckBoxSvg class="h-5" />
                <span class="font-bold text-lg">
                    {{ t("modDashboardLeftNav.approved") }} ({{ autofillStatusCount.approvedCount }})
                </span>
            </button>

            <button
                type="button"
                :class="[baseClass, currentTab === SelectedSubmissionListViewTab.Rejected ? activeClass : inactiveClass]"
                @click="updateSubmissionListViewState(SelectedSubmissionListViewTab.Rejected)"
            >
                <SVGDisabledByDefault class="h-5" />
                <span class="font-bold text-lg">
                    {{ t("modDashboardLeftNav.rejected") }} ({{ autofillStatusCount.rejectedCount }})
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGNoteStackAddSvg from '../assets/icons/note-stack-add.svg'
import SVGCheckBoxSvg from '../assets/icons/check-box.svg'
import SVGDisabledByDefault from '../assets/icons/disabled-by-default.svg'
import {
    useModerationSubmissionsStore,
    SelectedSubmissionListViewTab,
    SubmissionStatus,
    SelectedModerationListView
} from '~/stores/moderationSubmissionsStore'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const isSubmissionsViewActive = computed(() =>
    moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions)

const currentTab = computed(() => moderationSubmissionsStore.selectedModerationListViewTabChosen)

const updateSubmissionListViewState = (tab: SelectedSubmissionListViewTab) => {
    const statusMap = {
        [SelectedSubmissionListViewTab.Approved]: SubmissionStatus.Approved,
        [SelectedSubmissionListViewTab.ForReview]: SubmissionStatus.InReview,
        [SelectedSubmissionListViewTab.Rejected]: SubmissionStatus.Rejected
    }
    moderationSubmissionsStore.filterSubmissionByStatus(statusMap[tab])
    moderationSubmissionsStore.setSelectedModerationListViewTabChosen(tab)
}

const autofillStatusCount = computed(() => {
    const counts = { forReviewCount: 0, approvedCount: 0, rejectedCount: 0 }
    const data = moderationSubmissionsStore.submissionsData
    if (!data?.length) return counts

    return data.reduce((acc, sub) => {
        const isNew = !sub.isRejected && !sub.isApproved && !sub.isUnderReview
        if (sub.isUnderReview || isNew) acc.forReviewCount++
        if (sub.isApproved) acc.approvedCount++
        if (sub.isRejected) acc.rejectedCount++
        return acc
    }, counts)
})

watchEffect(() => {
    if (moderationSubmissionsStore.submissionsData.length && !moderationSubmissionsStore.selectedModerationListViewTabChosen) {
        moderationSubmissionsStore.filterSubmissionByStatus(SubmissionStatus.InReview)
        moderationSubmissionsStore.setSelectedModerationListViewTabChosen(SelectedSubmissionListViewTab.ForReview)
    }
})

const baseClass = 'flex items-center gap-4 px-10 py-4 rounded-xl shadow-sm border transition-all min-w-[240px] cursor-pointer'
const activeClass = 'bg-white border-blue-400 ring-2 ring-primary text-primary shadow-md'
const inactiveClass = 'bg-white border-gray-100 hover:bg-gray-50'
</script>
