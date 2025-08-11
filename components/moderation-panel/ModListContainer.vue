<template>
    <div class="relative flex flex-col min-h-screen w-full border-t border-border">
        <!-- Centered 7xl container with left/right borders -->
        <div class="mx-auto w-full max-w-7xl border-l border-r border-border relative overflow-hidden">
            <!-- Background SVG (contained) -->
            <div class="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                <SVGCharactersTogetherWelcomeScreen class="w-3/5 h-3/5 object-contain" />
            </div>

            <!-- Scrollable Foreground Content -->
            <div class="flex-1 h-screen overflow-y-auto gap-4 pt-0 border-t border-border">
                <!-- Submissions -->
                <div
                    v-if="hasSubmissions && submissionsModerationListViewChosen"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(submission, index) in modSubmissionsStore.submissionsData"
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
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-start mx-2 mt-2 mb-44"
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
                    class="grid grid-cols-2 gap-4 items-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(healthcareProfessional, index) in healthcareProfessionalsStore.healthcareProfessionalsData"
                        :key="index"
                        class="grid grid-cols-subgrid col-span-4 bg-accent-bg"
                    >
                        <NuxtLink
                            :to="`/moderation/edit-healthcare-professional/${healthcareProfessional.id}`"
                            class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                            :data-testid="`mod-healthcare-professional-list-item-${index + 1}`"
                        >
                            <span>
                                {{ getGlobalRowNumber(healthcareProfessionalsStore.currentOffset, index) }}
                            </span>
                            <span class="text-skip">
                                {{ healthcareProfessional.names[0].firstName }}
                                {{ healthcareProfessional.names[0].lastName }}
                            </span>
                            <span class="text-skip">{{ healthcareProfessional.updatedDate
                                ? formatToReadableDate(healthcareProfessional.updatedDate)
                                : formatToReadableDate(healthcareProfessional.createdDate) }}</span>
                        </NuxtLink>
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
                                :total-items="modSubmissionsStore.totalSubmissionsCount"
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
                            <label
                                for="items-per-page-select"
                                class="text-sm text-primary-700 mr-2"
                            >{{ $t('modListContainer.resultsPerPage') }}
                            </label>
                            <select
                                id="items-per-page-select"
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
import { computed, onMounted } from 'vue'
import { SelectedModerationListView, useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import SVGCharactersTogetherWelcomeScreen from '~/assets/icons/characters-together-welcomescreen.svg'
import { formatToReadableDate } from '~/utils/dateUtils'

const { t } = useI18n()

const modSubmissionsStore = useModerationSubmissionsStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

const healthcareProfessionalsModerationListViewChosen = computed(() => modSubmissionsStore.selectedModerationListViewChosen
  === SelectedModerationListView.HealthcareProfessionals)

const facilitiesModerationListViewChosen = computed(() => modSubmissionsStore.selectedModerationListViewChosen
  === SelectedModerationListView.Facilities)

const submissionsModerationListViewChosen = computed(() => modSubmissionsStore.selectedModerationListViewChosen
  === SelectedModerationListView.Submissions)

onMounted(async () => {
    await modSubmissionsStore.getSubmissions()
    await facilitiesStore.getFacilities()
    await healthcareProfessionalsStore.getHealthcareProfessionals()
})

const hasSubmissions = computed(() => modSubmissionsStore.submissionsData.length)
const hasFacilities = computed(() => facilitiesStore.facilityData.length)
const hasHealthcareProfessionals = computed(() => healthcareProfessionalsStore.healthcareProfessionalsData.length)

function getGlobalRowNumber(offset: number, index: number): number {
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

