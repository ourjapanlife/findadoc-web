<template>
    <div
        :style="submissionListItemTableColumns"
        :class="`grid grid-cols-4 p-2`"
    >
        <div class="font-bold text-left p-1">
            #
        </div>
        <div class="font-bold text-left p-1">
            {{ t("modPanelSubmissionList.name") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ t("modPanelSubmissionList.modified") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ t("modPanelSubmissionList.submitted") }}
        </div>

        <div
            v-if="hasSubmissions && modSubmissionsListStore.selectedModerationListViewChosen
                === SelectedModerationListView.Submissions"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(submission, index) in modSubmissionsListStore.submissionsData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-accent-bg"
            >
                <div
                    :data-testid="`mod-submission-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-accent-bg cursor-pointer hover:bg-primary"
                    @click="handleClickToSubmissionForm(submission.id)"
                >
                    <NuxtLink
                        :to="`/moderation/edit-submission/${submission.id}`"
                        class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                    >
                        <span class="text-skip">
                            {{ getGlobalRowNumber(modSubmissionsListStore.currentPage,
                                                  modSubmissionsListStore.itemsPerPage, index) }}
                        </span>
                        <span class="text-skip">
                            {{ submission.healthcareProfessionalName || t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-skip">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span class="text-skip">{{ convertDateToLocalTime(submission.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasFacilities && modSubmissionsListStore.selectedModerationListViewChosen
                === SelectedModerationListView.Facilities"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(facility, index) in facilitiesStore.facilityData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-accent-bg"
            >
                <div
                    :data-testid="`mod-facility-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-accent-bg cursor-pointer hover:bg-primary"
                >
                    <NuxtLink
                        :to="`/moderation/edit-facility/${facility.id}`"
                        class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                    >
                        <span class="text-skip">
                            {{ getGlobalRowNumber(facilitiesStore.currentPage, facilitiesStore.itemsPerPage, index) }}
                        </span>
                        <span class="text-skip">
                            {{ facility?.nameEn }}
                        </span>
                        <span class="text-skip">{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                        <span class="text-skip">{{ convertDateToLocalTime(facility.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasHealthcareProfessionals && modSubmissionsListStore.selectedModerationListViewChosen
                === SelectedModerationListView.HealthcareProfessionals"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(healthcareProfessional, index) in healthcareProfessionalsStore.healthcareProfessionalsData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-accent-bg"
            >
                <div
                    :data-testid="`mod-healthcare-professional-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-accent-bg cursor-pointer hover:bg-primary"
                >
                    <NuxtLink
                        :to="`/moderation/edit-healthcare-professional/${healthcareProfessional.id}`"
                        class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                    >
                        <span class="text-skip">
                            {{ getGlobalRowNumber(healthcareProfessionalsStore.currentPage,
                                                  healthcareProfessionalsStore.itemsPerPage, index) }}
                        </span>
                        <span class="text-skip">
                            {{ healthcareProfessional.names[0].firstName }} {{ healthcareProfessional.names[0].lastName }}
                        </span>
                        <span class="text-skip">{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                        <span class="text-skip">{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else>
            {{ t("modPanelSubmissionList.noSubmissions") }}
        </div>
    </div>

    <div class="w-full flex justify-center mt-4">
        <Pagination
            v-if="modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions"
            :current-page="modSubmissionsListStore.currentPage"
            :total-items="modSubmissionsListStore.totalSubmissionsCount"
            :items-per-page="modSubmissionsListStore.itemsPerPage"
            @update:current-page="modSubmissionsListStore.setCurrentPage"
        />
        <Pagination
            v-else-if="modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities"
            :current-page="facilitiesStore.currentPage"
            :total-items="facilitiesStore.totalFacilitiesCount"
            :items-per-page="facilitiesStore.itemsPerPage"
            @update:current-page="facilitiesStore.setCurrentPage"
        />
        <Pagination
            v-else-if="modSubmissionsListStore.selectedModerationListViewChosen
                === SelectedModerationListView.HealthcareProfessionals"
            :current-page="healthcareProfessionalsStore.currentPage"
            :total-items="healthcareProfessionalsStore.totalHealthcareProfessionalsCount"
            :items-per-page="healthcareProfessionalsStore.itemsPerPage"
            @update:current-page="healthcareProfessionalsStore.setCurrentPage"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { SelectedModerationListView, useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'

const { t } = useI18n()

const modSubmissionsListStore = useModerationSubmissionsStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

onMounted(async () => {
    await modSubmissionsListStore.getSubmissions()
    await facilitiesStore.getFacilities()
    await healthcareProfessionalsStore.getHealthcareProfessionals()
})

const hasSubmissions = computed(() => modSubmissionsListStore.submissionsData.length)
const hasFacilities = computed(() => facilitiesStore.facilityData.length)
const hasHealthcareProfessionals = computed(() => healthcareProfessionalsStore.healthcareProfessionalsData.length)

const convertDateToLocalTime = (isoString: string) => new Date(isoString).toLocaleString()

const submissionListItemTableColumns = computed(() => {
    const numOfColumns = 4
    const defaultColumnWidth = 10
    const remainingWidth = 100 - defaultColumnWidth
    const columnWidth = remainingWidth / (numOfColumns - 1)
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numOfColumns - 1}, ${columnWidth}%);`
})

const handleClickToSubmissionForm = (id: string) => {
    modSubmissionsListStore.selectedSubmissionId = id
}

function getGlobalRowNumber(page: number, perPage: number, index: number): number {
    return (page - 1) * perPage + index + 1
}
</script>

