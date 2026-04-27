<template>
    <div class="relative flex flex-col min-h-screen w-full">
        <!-- Centered 7xl container with left/right borders -->
        <div class="mx-auto w-full max-w-7xl relative overflow-hidden">
            <!-- Scrollable Foreground Content -->
            <div class="flex-1 h-screen overflow-y-auto gap-4 pt-0">
                <!-- Submissions -->
                <div
                    v-if="hasSubmissions && submissionsModerationListViewChosen"
                    class="grid grid-cols-1 landscape:grid-cols-2 gap-4 items-start justify-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(submission, index) in modSubmissionsStore.filteredSubmissionDataForListComponent"
                        :key="index"
                    >
                        <ModListContainerItem
                            :submission="submission"
                            :pagination-global-row-value-function="getGlobalRowNumber"
                            :current-offset="modSubmissionsStore.currentOffset"
                            :index="index"
                        />
                    </div>
                </div>

                <!-- Facilities -->
                <div
                    v-else-if="hasFacilities && facilitiesModerationListViewChosen"
                    class="grid grid-cols-1 landscape:grid-cols-2 gap-4 items-start justify-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(facility, index) in facilitiesStore.facilityData"
                        :key="index"
                    >
                        <ModListContainerItem
                            :facility="facility"
                            :pagination-global-row-value-function="getGlobalRowNumber"
                            :current-offset="facilitiesStore.currentOffset"
                            :index="index"
                        />
                    </div>
                </div>
                <!-- Healthcare Professionals -->
                <div
                    v-else-if="hasHealthcareProfessionals && healthcareProfessionalsModerationListViewChosen"
                    class="grid grid-cols-1 landscape:grid-cols-2 gap-4 items-start justify-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(healthcareProfessional, index) in healthcareProfessionalsStore.healthcareProfessionalsData"
                        :key="index"
                    >
                        <ModListContainerItem
                            :healthcare-professional="healthcareProfessional"
                            :pagination-global-row-value-function="getGlobalRowNumber"
                            :current-offset="healthcareProfessionalsStore.currentOffset"
                            :index="index"
                        />
                    </div>
                </div>

                <!-- No data fallback -->
                <div
                    v-else
                    class="text-center py-8 mx-2"
                >
                    {{ t("modPanelSubmissionList.noSubmissions") }}
                </div>

                <!-- Sticky Pagination at Bottom -->
                <div class="fixed bottom-0 left-0 w-full bg-background border-t border-border z-20">
                    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
                        <div class="flex-1 flex justify-center">
                            <Pagination
                                v-if="submissionsModerationListViewChosen"
                                :current-offset="modSubmissionsStore.currentOffset"
                                :total-items="modSubmissionsStore.filteredSubmissionDataForListComponent.length"
                                :items-per-page="modSubmissionsStore.itemsPerPage"
                                @update:offset="modSubmissionsStore.setOffset"
                            />
                            <Pagination
                                v-if="facilitiesModerationListViewChosen"
                                :current-offset="facilitiesStore.currentOffset"
                                :total-items="facilitiesStore.totalFacilitiesCount"
                                :items-per-page="facilitiesStore.itemsPerPage"
                                @update:offset="facilitiesStore.setOffset"
                            />
                            <Pagination
                                v-if="healthcareProfessionalsModerationListViewChosen"
                                :current-offset="healthcareProfessionalsStore.currentOffset"
                                :total-items="healthcareProfessionalsStore.totalHealthcareProfessionalsCount"
                                :items-per-page="healthcareProfessionalsStore.itemsPerPage"
                                @update:offset="healthcareProfessionalsStore.setOffset"
                            />
                        </div>
                        <div class="flex items-center ml-4">
                            <label class="text-sm text-primary-700 mr-2">{{ t('modListContainer.resultsPerPage') }}</label>
                            <select
                                :value="getCurrentItemsPerPage()"
                                class="border border-primary/40 rounded px-2 py-1 text-sm bg-primary-inverted
                                focus:ring-primary focus:border-primary"
                                @change="handleItemsPerPageChange"
                            >
                                <option value="10">
                                    10
                                </option>
                                <option value="25">
                                    25
                                </option>
                                <option value="50">
                                    50
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import {
    SelectedModerationListView,
    useModerationSubmissionsStore,
    SubmissionStatus,
    SelectedSubmissionListViewTab
} from '~/stores/moderationSubmissionsStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'

const { t } = useI18n()
const modSubmissionsStore = useModerationSubmissionsStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

const submissionsModerationListViewChosen = computed(() =>
    modSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions)
const facilitiesModerationListViewChosen = computed(() =>
    modSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities)
const healthcareProfessionalsModerationListViewChosen = computed(() =>
    modSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.HealthcareProfessionals)

const hasSubmissions = computed(() => modSubmissionsStore.filteredSubmissionDataForListComponent.length > 0)
const hasFacilities = computed(() => facilitiesStore.facilityData.length > 0)
const hasHealthcareProfessionals = computed(() => healthcareProfessionalsStore.healthcareProfessionalsData.length > 0)

const runSubmissionFilter = () => {
    const statusMap: Record<SelectedSubmissionListViewTab, SubmissionStatus> = {
        [SelectedSubmissionListViewTab.ForReview]: SubmissionStatus.InReview,
        [SelectedSubmissionListViewTab.Approved]: SubmissionStatus.Approved,
        [SelectedSubmissionListViewTab.Rejected]: SubmissionStatus.Rejected
    }
    const currentTab = modSubmissionsStore.selectedModerationListViewTabChosen
    modSubmissionsStore.filterSubmissionByStatus(statusMap[currentTab])
}

onMounted(async () => {
    await Promise.all([
        modSubmissionsStore.getSubmissions(),
        facilitiesStore.getFacilities(),
        healthcareProfessionalsStore.getHealthcareProfessionals()
    ])
    runSubmissionFilter()
})

watch(
    [() => modSubmissionsStore.submissionsData, () => modSubmissionsStore.selectedModerationListViewTabChosen],
    () => {
        runSubmissionFilter()
    },
    { deep: true }
)

function getGlobalRowNumber(offset: number, index: number) {
    return offset + index + 1
}

function getCurrentItemsPerPage(): number {
    switch (modSubmissionsStore.selectedModerationListViewChosen) {
        case SelectedModerationListView.Submissions:
            return modSubmissionsStore.itemsPerPage
        case SelectedModerationListView.Facilities:
            return facilitiesStore.itemsPerPage
        case SelectedModerationListView.HealthcareProfessionals:
            return healthcareProfessionalsStore.itemsPerPage
        default:
            return 25
    }
}

async function handleItemsPerPageChange(event: Event) {
    // Extract the new selected value from the event target and convert it to a number.
    const newItemsPerPage = Number((event.target as HTMLSelectElement).value)
    // Use a switch statement to perform the correct action based on the currently active moderation view.
    switch (modSubmissionsStore.selectedModerationListViewChosen) {
        case SelectedModerationListView.Submissions:
            // Update the itemsPerPage and reset the offset to 0 for submissions.
            modSubmissionsStore.setItemsPerPage(newItemsPerPage)
            modSubmissionsStore.setOffset(0)
            await modSubmissionsStore.getSubmissions()
            break
        case SelectedModerationListView.Facilities:
            // Update the itemsPerPage and reset the offset to 0 for facilities.
            facilitiesStore.setItemsPerPage(newItemsPerPage)
            facilitiesStore.setOffset(0)
            await facilitiesStore.getFacilities()
            break
        case SelectedModerationListView.HealthcareProfessionals:
            // Update the itemsPerPage and reset the offset to 0 for healtchare professionals.
            healthcareProfessionalsStore.setItemsPerPage(newItemsPerPage)
            healthcareProfessionalsStore.setOffset(0)
            await healthcareProfessionalsStore.getHealthcareProfessionals()
            break
    }
}
</script>

