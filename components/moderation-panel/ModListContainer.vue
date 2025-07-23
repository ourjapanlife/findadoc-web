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
                        v-for="(submission, index) in paginatedSubmissions"
                        :key="index"
                    >
                        <ModListContainerItem
                            :submission="submission"
                            :pagination-global-row-value-function="getGlobalRowNumber"
                            :current-page="currentSubmissionsPage"
                            :items-per-page="submissionsPerPage"
                            :index="index"
                        />
                    </div>
                </div>

                <!-- Facilities -->
                <div
                    v-else-if="hasFacilities && facilitiesModerationListViewChosen"
                    class="grid grid-cols-2 gap-4 items-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(facility, index) in paginatedFacilities"
                        :key="index"
                    >
                        <NuxtLink
                            :to="`/moderation/edit-facility/${facility.id}`"
                            class="flex flex-col items-start bg-accent-bg p-2 hover:bg-primary"
                            :data-testid="`mod-facility-list-item-${index + 1}`"
                        >
                            <span class="text-skip">
                                {{ getGlobalRowNumber(currentFacilitiesPage, facilitiesPerPage, index) }}
                            </span>
                            <span class="text-skip">{{ facility?.nameEn }}</span>
                            <span class="text-skip">{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                            <span class="text-skip">{{ convertDateToLocalTime(facility.createdDate) }}</span>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Healthcare Professionals -->
                <div
                    v-else-if="hasHealthcareProfessionals && healthcareProfessionalsModerationListViewChosen"
                    class="grid grid-cols-2 gap-4 items-start mx-2 mt-2 mb-44"
                >
                    <div
                        v-for="(healthcareProfessional, index) in paginatedHealthcareProfessionals"
                        :key="index"
                    >
                        <NuxtLink
                            :to="`/moderation/edit-healthcare-professional/${healthcareProfessional.id}`"
                            class="flex flex-col items-start bg-accent-bg p-2 hover:bg-primary"
                            :data-testid="`mod-healthcare-professional-list-item-${index + 1}`"
                        >
                            <span class="text-skip">
                                {{ getGlobalRowNumber(currentHealthcarePage, healthcarePerPage, index) }}
                            </span>
                            <span class="text-skip">
                                {{ healthcareProfessional.names[0].firstName }}
                                {{ healthcareProfessional.names[0].lastName }}
                            </span>
                            <span class="text-skip">{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                            <span class="text-skip">{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
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
            </div>
        </div>

        <!-- Sticky Pagination at Bottom, centered to max-w-7xl -->
        <div class="fixed bottom-0 left-0 w-full bg-background border-t border-border z-20">
            <div class="max-w-7xl mx-auto flex items-center justify-center py-2">
                <Pagination
                    v-if="submissionsModerationListViewChosen"
                    :current-page="currentSubmissionsPage"
                    :total-items="totalSubmissions"
                    :items-per-page="submissionsPerPage"
                    @update:current-page="updateSubmissionsPage"
                />
                <Pagination
                    v-if="facilitiesModerationListViewChosen"
                    :current-page="currentFacilitiesPage"
                    :total-items="totalFacilities"
                    :items-per-page="facilitiesPerPage"
                    @update:current-page="updateFacilitiesPage"
                />
                <Pagination
                    v-if="healthcareProfessionalsModerationListViewChosen"
                    :current-page="currentHealthcarePage"
                    :total-items="totalHealthcareProfessionals"
                    :items-per-page="healthcarePerPage"
                    @update:current-page="updateHealthcarePage"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { SelectedModerationListView, useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import SVGCharactersTogetherWelcomeScreen from '~/assets/icons/characters-together-welcomescreen.svg'

const { t } = useI18n()

const modSubmissionsListStore = useModerationSubmissionsStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

const healthcareProfessionalsModerationListViewChosen = computed(() => modSubmissionsListStore.selectedModerationListViewChosen
  === SelectedModerationListView.HealthcareProfessionals)
const currentHealthcarePage: Ref<number> = ref(1)
const healthcarePerPage = 20

const facilitiesModerationListViewChosen = computed(() => modSubmissionsListStore.selectedModerationListViewChosen
  === SelectedModerationListView.Facilities)
const currentFacilitiesPage: Ref<number> = ref(1)
const facilitiesPerPage = 20

const submissionsModerationListViewChosen = computed(() => modSubmissionsListStore.selectedModerationListViewChosen
  === SelectedModerationListView.Submissions)
const currentSubmissionsPage: Ref<number> = ref(1)
const submissionsPerPage = 20

onMounted(async () => {
    await modSubmissionsListStore.getSubmissions()
    await facilitiesStore.getFacilities()
    await healthcareProfessionalsStore.getHealthcareProfessionals()
})

const hasSubmissions = computed(() => modSubmissionsListStore.submissionsData.length)
const hasFacilities = computed(() => facilitiesStore.facilityData.length)
const hasHealthcareProfessionals = computed(() => healthcareProfessionalsStore.healthcareProfessionalsData.length)

const convertDateToLocalTime = (isoString: string) => new Date(isoString).toLocaleString()

const paginatedHealthcareProfessionals = computed(() => {
    const skip = (currentHealthcarePage.value - 1) * healthcarePerPage
    const take = skip + healthcarePerPage
    return healthcareProfessionalsStore.healthcareProfessionalsData.slice(skip, take)
})
const totalHealthcareProfessionals = computed(() =>
    healthcareProfessionalsStore.healthcareProfessionalsData.length)

const paginatedFacilities = computed(() => {
    const skip = (currentFacilitiesPage.value - 1) * facilitiesPerPage
    const take = skip + facilitiesPerPage
    return facilitiesStore.facilityData.slice(skip, take)
})
const totalFacilities = computed(() =>
    facilitiesStore.facilityData.length)

const paginatedSubmissions = computed(() => {
    const skip = (currentSubmissionsPage.value - 1) * submissionsPerPage
    const take = skip + submissionsPerPage
    return modSubmissionsListStore.filteredSubmissionDataForListComponent.slice(skip, take)
})
const totalSubmissions = computed(() =>
    modSubmissionsListStore.filteredSubmissionDataForListComponent.length)

function getGlobalRowNumber(page: number, perPage: number, index: number): number {
    return (page - 1) * perPage + index + 1
}

function updateHealthcarePage(value: number) {
    currentHealthcarePage.value = value
}

function updateFacilitiesPage(value: number) {
    currentFacilitiesPage.value = value
}

function updateSubmissionsPage(value: number) {
    currentSubmissionsPage.value = value
}
</script>

