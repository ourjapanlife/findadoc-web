<template>
    <div class="flex items-center justify-between h-full px-4 py-5">
        <h1 class="font-bold">
            {{ updateTextForModerationDashboard(moderationSubmissionsStore.selectedModerationListViewChosen) }}
        </h1>
    </div>
</template>

<script setup lang="ts">
import {
    SelectedModerationListView,
    SelectedSubmissionListViewTab,
    useModerationSubmissionsStore
} from '~/stores/moderationSubmissionsStore'
import { useI18n } from '#imports'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const updateTextForModerationDashboard = (
    selectedView: SelectedModerationListView,
    selectedTab = moderationSubmissionsStore.selectedModerationListViewTabChosen
) => {
    switch (selectedView) {
        case SelectedModerationListView.Submissions:
            return updateTextForSubmissionDashboard(selectedTab)
        case SelectedModerationListView.Facilities:
            return t('modDashboardTopbar.facilities')
        case SelectedModerationListView.HealthcareProfessionals:
            return t('modDashboardTopbar.healthcareProfessionals')
        default:
            return ''
    }
}

const updateTextForSubmissionDashboard = (selectedTab: SelectedSubmissionListViewTab) => {
    switch (selectedTab) {
        case SelectedSubmissionListViewTab.Approved:
            return t('modDashboardTopbar.approved')
        case SelectedSubmissionListViewTab.ForReview:
            return t('modDashboardTopbar.forReview')
        case SelectedSubmissionListViewTab.Rejected:
            return t('modDashboardTopbar.rejected')
        default:
            return ''
    }
}
</script>
