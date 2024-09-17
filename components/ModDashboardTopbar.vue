<template>
    <div class="flex items-center justify-between">
        <h1
            class="displayed-section-header font-semibold text-xl mx-1"
        >
            {{ updateTextForModerationDashboard(moderationSubmissionsStore.selectedModerationListViewChosen) }}
        </h1>
        <div class="dashboard-search flex flex-col mt-4">
            <div class="justify-start items-start flex">
                <input
                    type="text"
                    :placeholder="$t('modDashboardTopbar.placeholderText')"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                    text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                >
                <SVGLookingGlass
                    role="img"
                    title="searching icon"
                    class="relative right-8 top-3 w-6 h-6"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SelectedModerationListView, SelectedSubmissionListViewTab, useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useI18n } from '#imports'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'

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
