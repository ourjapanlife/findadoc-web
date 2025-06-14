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
            v-if="hasSubmissions
                && modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(submission, index) in modSubmissionsListStore.filteredSubmissionDataForListComponent"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-submission-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                    @click="handleClickToSubmissionForm(submission.id)"
                >
                    <NuxtLink
                        :to="`/moderation/edit-submission/${submission.id}`"
                        class="grid grid-cols-subgrid col-span-4 bg-primary-text-muted p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ submission.healthcareProfessionalName || t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasFacilities
                && modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(facility, index) in facilitiesStore.facilityData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-facility-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                >
                    <NuxtLink
                        :to="`/moderation/edit-facility/${facility.id}`"
                        class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ facility?.nameEn }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasHealthcareProfessionals
                && modSubmissionsListStore.selectedModerationListViewChosen
                    === SelectedModerationListView.HealthcareProfessionals"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(healthcareProfessional, index) in healthcareProfessionalsStore.healthcareProfessionalsData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-healthcare-professional-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                >
                    <NuxtLink
                        :to="`/moderation/edit-healthcare-professional/${healthcareProfessional.id}`"
                        class="grid grid-cols-subgrid col-span-4 p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ healthcareProfessional.names[0].firstName }} {{ healthcareProfessional.names[0].lastName }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else>
            {{ t("modPanelSubmissionList.noSubmissions") }}
        </div>
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
</script>
