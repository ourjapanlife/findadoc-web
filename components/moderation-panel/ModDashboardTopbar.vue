<template>
    <div class="flex flex-col gap-3">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h1
                class="displayed-section-header font-semibold text-xl md:text-2xl text-primary-text"
            >
                {{ updateTextForModerationDashboard(moderationSubmissionsStore.selectedModerationListViewChosen) }}
            </h1>
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <div
                    v-if="moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions"
                    class="justify-start items-start flex relative w-full sm:w-auto order-2 sm:order-1"
                >
                    <input
                        v-model="submissionSearchQuery"
                        type="text"
                        :placeholder="t('modDashboardTopbar.placeholderText')"
                        class="pl-10 pr-3 py-2.5 w-full sm:w-80 rounded-lg border border-accent-bg
                        bg-secondary-bg text-primary-text text-sm font-normal font-sans
                        placeholder-primary-text-muted"
                        data-testid="mod-submission-search-input"
                    >
                    <SVGLookingGlass
                        role="img"
                        title="searching icon"
                        class="absolute left-3 top-3 w-4 h-4 text-primary-text-muted"
                    />
                </div>
                <NuxtLink
                    v-if="showAddHpButton"
                    to="/my-page/create-healthcare-professional"
                    data-testid="add-hp-button"
                    class="flex justify-center items-center rounded-lg border border-accent-bg
                    bg-secondary-bg py-2 px-3 order-1 sm:order-2 font-semibold text-sm
                    overflow-hidden text-center text-primary-text hover:bg-accent-bg/20"
                >
                    {{ t('modDashboardTopbar.addHealthcareProfessional') }}
                </NuxtLink>
                <NuxtLink
                    v-if="showAddFacilityButton"
                    to="/my-page/create-facility"
                    data-testid="add-facility-button"
                    class="flex justify-center items-center rounded-lg border border-accent-bg
                    bg-secondary-bg py-2 px-3 order-1 sm:order-2 font-semibold text-sm
                    overflow-hidden text-center text-primary-text hover:bg-accent-bg/20"
                >
                    {{ t('modDashboardTopbar.addFacility') }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    SelectedModerationListView,
    useModerationSubmissionsStore
} from '~/stores/moderationSubmissionsStore'
import { useCurrentUserAccessStore } from '~/stores/currentUserAccessStore'
import { useI18n } from '#imports'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()
const accessStore = useCurrentUserAccessStore()

const showAddHpButton = computed(() =>
    moderationSubmissionsStore.selectedModerationListViewChosen
        === SelectedModerationListView.HealthcareProfessionals
    && (
        accessStore.loadError
        || !accessStore.isLoaded
        || accessStore.hasScope('write:healthcareprofessionals')
    ))

const showAddFacilityButton = computed(() =>
    moderationSubmissionsStore.selectedModerationListViewChosen
        === SelectedModerationListView.Facilities
    && (
        accessStore.loadError
        || !accessStore.isLoaded
        || accessStore.hasScope('write:facilities')
    ))

const submissionSearchQuery = computed({
    get: () => moderationSubmissionsStore.submissionSearchQuery,
    set: (newValue: string) => moderationSubmissionsStore.setSubmissionSearchQuery(newValue)
})

const updateTextForModerationDashboard = (selectedView: SelectedModerationListView) => {
    switch (selectedView) {
        case SelectedModerationListView.Submissions:
            return t('modDashboardLeftNav.submissions')
        case SelectedModerationListView.Facilities:
            return t('modDashboardTopbar.facilities')
        case SelectedModerationListView.HealthcareProfessionals:
            return t('modDashboardTopbar.healthcareProfessionals')
        default:
            return ''
    }
}

</script>
