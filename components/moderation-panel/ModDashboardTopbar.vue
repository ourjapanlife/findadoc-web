<template>
    <div class="flex items-center justify-between">
        <h1
            class="displayed-section-header font-semibold text-xl mx-1"
        >
            {{ updateTextForModerationDashboard(moderationSubmissionsStore.selectedModerationListViewChosen) }}
        </h1>
        <div class="dashboard-search flex items-center mt-4">
            <NuxtLink
                v-if="isHealthcareProfessionals"
                to="/moderation/create-healthcare-professional"
                data-testid="add-hp-button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary p-1 border-2 w-40
                font-semibold text-sm mr-2 overflow-hidden text-center hover:bg-currentColor"
            >
                {{ t('modDashboardTopbar.addHealthcareProfessional') }}
            </NuxtLink>
            <NuxtLink
                v-if="isFacility"
                to="/moderation/create-facility"
                data-testid="add-facility-button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary p-1 border-2 w-40
                font-semibold text-sm mr-2 overflow-hidden text-center hover:bg-currentColor"
            >
                {{ t('modDashboardTopbar.addFacility') }}
            </NuxtLink>
            <ModSearchbarFilterName
                :place-holder-text="searchPlaceholderText"
                :fields-to-display-callback="searchFieldsToDisplay"
                :entity-type="selectedSearchEntityType"
                data-test-id="dashboard-search-bar"
                @item-selected="handleItemSelected"
                @search-cleared="handleSearchCleared"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { navigateTo } from '#app'
import {
    SelectedModerationListView,
    SelectedSubmissionListViewTab,
    useModerationSubmissionsStore
} from '~/stores/moderationSubmissionsStore'
import { useI18n } from '#imports'
import ModSearchbarFilterName from '~/components/moderation-panel/ModSearchBarFilterName.vue'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'

import { Locale } from '~/typedefs/gqlTypes'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const searchSelectedEntity = ref<SearchResultItem | null>(null)

interface SearchResultItem {
    id: string
    nameEn?: string
    nameJa?: string
    names?: Array<{ firstName: string, lastName: string, locale: Locale }>
    // We will use when we search also submissions
    healthcareProfessionalName?: string
}

const updateTextForModerationDashboard = (
    selectedView: SelectedModerationListView,
    selectedTab = moderationSubmissionsStore.selectedModerationListViewTabChosen
) => {
    switch (selectedView) {
        case SelectedModerationListView.Submissions:
            return updateTextForSubmissionDashboard(selectedTab)
        case SelectedModerationListView.Facilities:
            if (searchSelectedEntity.value && isFacility.value) {
                const facility = searchSelectedEntity.value as Facility
                return facility.nameEn || facility.nameJa || facility.id
            }
            return t('modDashboardTopbar.facilities')
        case SelectedModerationListView.HealthcareProfessionals:
            if (searchSelectedEntity.value && isHealthcareProfessionals.value) {
                const hp = searchSelectedEntity.value as HealthcareProfessional
                const name = hp.names?.find(n => n.locale === Locale.EnUs) || hp.names?.[0]
                return name ? `${name.firstName} ${name.lastName}` : hp.id
            }
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

const isHealthcareProfessionals = computed(() => moderationSubmissionsStore.selectedModerationListViewChosen
  === SelectedModerationListView.HealthcareProfessionals)
const isFacility = computed(() => moderationSubmissionsStore.selectedModerationListViewChosen
  === SelectedModerationListView.Facilities)

const selectedSearchEntityType = computed(() => {
    switch (moderationSubmissionsStore.selectedModerationListViewChosen) {
        case SelectedModerationListView.Facilities:
            return 'facilities'
        case SelectedModerationListView.HealthcareProfessionals:
            return 'healthcareProfessionals'
        case SelectedModerationListView.Submissions:
            return 'submissions'
        default:
            return 'healthcareProfessionals'
    }
})

const searchPlaceholderText = computed(() => t('modDashboardTopbar.placeholderText'))

const searchFieldsToDisplay = (item: SearchResultItem): string[] => {
    if (moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities) {
        const facility = item as Facility
        return [facility.nameEn || '', facility.nameJa || ''].filter(Boolean)
    } else if (moderationSubmissionsStore.selectedModerationListViewChosen
      === SelectedModerationListView.HealthcareProfessionals) {
        const hp = item as HealthcareProfessional
        const displayNames: string[] = []

        const nameEn = hp.names?.find(name => name.locale === Locale.EnUs)
        if (nameEn) {
            displayNames.push(`${nameEn.firstName} ${nameEn.lastName}`)
        } else if (hp.names && hp.names.length > 0) {
            displayNames.push(`${hp.names[0].firstName} ${hp.names[0].lastName}`)
        }

        if (hp.specialties && hp.specialties.length > 0) {
            displayNames.push(...hp.specialties)
        }
        return displayNames.filter(Boolean)
    }
    return []
}

const handleItemSelected = (item: SearchResultItem | null) => {
    searchSelectedEntity.value = item
    if (item) {
        if (isHealthcareProfessionals.value) {
            navigateTo(`/moderation/edit-healthcare-professional/${item.id}`)
        } else if (isFacility.value) {
            navigateTo(`/moderation/edit-facility/${item.id}`)
        }
    }
}

const handleSearchCleared = () => {
    searchSelectedEntity.value = null
}
</script>
