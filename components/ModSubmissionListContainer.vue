<template>
    <div
        :style="submissionListItemTableColumns"
        :class="`grid grid-cols-4 p-2`"
    >
        <div class="font-bold text-left p-1">
            #
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.name") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.modified") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.submitted") }}
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
                    <nuxt-link
                        :to="`/moderation/edit-submission/${submission.id}`"
                        class="grid grid-cols-subgrid col-span-4 bg-primary-text-muted p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ submission.facility?.nameEn || $t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.createdDate) }}</span>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasFacilities
                && modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(facility, index) in modSubmissionsListStore.facilityData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-submission-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                    @click="handleClickToFacilityForm(facility.id)"
                >
                    <nuxt-link
                        :to="`/moderation/edit-facility/${facility.id}`"
                        class="grid grid-cols-subgrid col-span-4 bg-primary-text-muted p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ facility?.nameEn || $t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.createdDate) }}</span>
                    </nuxt-link>
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
                v-for="(healthcareProfessional, index) in modSubmissionsListStore.healthcareProfessionalsData"
                :key="index"
                class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-submission-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                    @click="handleClickToHealthcareProfessionalForm(healthcareProfessional.id)"
                >
                    <nuxt-link
                        :to="`/moderation/edit-healthcare-professional/${healthcareProfessional.id}`"
                        class="grid grid-cols-subgrid col-span-4 bg-primary-text-muted p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ healthcareProfessional.names[0].firstName }} {{ healthcareProfessional.names[0].lastName }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div v-else>
            {{ $t("modPanelSubmissionList.noSubmissions") }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { SelectedModerationListView, useModerationSubmissionsListStore } from '~/stores/moderationSubmissionsListStore'

const modSubmissionsListStore = useModerationSubmissionsListStore()

onMounted(async () => {
    await modSubmissionsListStore.getSubmissions()
    await modSubmissionsListStore.getFacilities()
    await modSubmissionsListStore.getHealthcareProfessionals()
})

const hasSubmissions = computed(() => modSubmissionsListStore.submissionsData.length)
const hasFacilities = computed(() => modSubmissionsListStore.facilityData.length)
const hasHealthcareProfessionals = computed(() => modSubmissionsListStore.healthcareProfessionalsData.length)

const convertDateToLocalTime = (isoString: string) => new Date(isoString).toLocaleString()

const submissionListItemTableColumns = computed(() => {
    const numOfColumns = 4
    const defaultColumnWidth = 10
    const remainingWidth = 100 - defaultColumnWidth
    const columnWidth = remainingWidth / (numOfColumns - 1)
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numOfColumns - 1}, ${columnWidth}%);`
})

const handleClickToSubmissionForm = (id: string) => {
    useModerationScreenStore().setActiveScreen(ModerationScreen.EditSubmission)
    modSubmissionsListStore.selectedSubmissionId = id
}

const handleClickToHealthcareProfessionalForm = (id: string) => {
    useModerationScreenStore().setActiveScreen(ModerationScreen.EditHealthcareProfessional)
    modSubmissionsListStore.selectedHealthcareProfessionalId = id
}

const handleClickToFacilityForm = (id: string) => {
    useModerationScreenStore().setActiveScreen(ModerationScreen.EditFacility)
    modSubmissionsListStore.selectedFacilityId = id
}
</script>
