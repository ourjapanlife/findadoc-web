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
                v-for="(submission, index) in paginatedSubmissions"
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
                        <span class="text-start">
                            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                        </span>
                        <span class="text-start">
                            {{ submission.healthcareProfessionalName || $t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
            <ModPagination
                :current-page="currentPage"
                :total-items="totalSubmissions"
                :items-per-page="itemsPerPage"
                @update:current-page="val => currentPage = val"
            />
        </div>
        <div
            v-else-if="hasFacilities
                && modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(facility, index) in paginatedFacilities"
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
                        <span class="text-start">
                            {{ (currentFacilitiesPage - 1) * facilitiesPerPage + index + 1 }}
                        </span>
                        <span class="text-start">
                            {{ facility?.nameEn }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(facility.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
            <ModPagination
                :current-page="currentFacilitiesPage"
                :total-items="totalFacilities"
                :items-per-page="facilitiesPerPage"
                @update:current-page="val => currentFacilitiesPage = val"
            />
        </div>
        <div
            v-else-if="hasHealthcareProfessionals
                && modSubmissionsListStore.selectedModerationListViewChosen
                    === SelectedModerationListView.HealthcareProfessionals"
            class="grid grid-cols-subgrid col-span-4"
        >
            <div
                v-for="(healthcareProfessional, index) in paginatedHealthcareProfessionals"
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
                        <span class="text-start">
                            {{ (currentHealthcarePage - 1) * healthcarePerPage + index + 1 }}
                        </span>
                        <span class="text-start">
                            {{ healthcareProfessional.names[0].firstName }} {{ healthcareProfessional.names[0].lastName }}
                        </span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
            <ModPagination
                :current-page="currentHealthcarePage"
                :total-items="totalHealthcareProfessionals"
                :items-per-page="healthcarePerPage"
                @update:current-page="val => currentHealthcarePage = val"
            />
        </div>
        <div v-else>
            {{ $t("modPanelSubmissionList.noSubmissions") }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { SelectedModerationListView, useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import ModPagination from '~/components/ModPagination.vue'

const modSubmissionsListStore = useModerationSubmissionsStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

const currentHealthcarePage: Ref<number> = ref(1)
const healthcarePerPage = 20

const currentFacilitiesPage: Ref<number> = ref(1)
const facilitiesPerPage = 20

const currentPage: Ref<number> = ref(1)
const itemsPerPage = 20

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


const paginatedHealthcareProfessionals = computed(() => {
    const start = (currentHealthcarePage.value - 1) * healthcarePerPage
    const end = start + healthcarePerPage
    return healthcareProfessionalsStore.healthcareProfessionalsData.slice(start, end)
})
const totalHealthcareProfessionals = computed(() =>
    healthcareProfessionalsStore.healthcareProfessionalsData.length)

const paginatedFacilities = computed(() => {
    const start = (currentFacilitiesPage.value - 1) * facilitiesPerPage
    const end = start + facilitiesPerPage
    return facilitiesStore.facilityData.slice(start, end)
})
const totalFacilities = computed(() =>
    facilitiesStore.facilityData.length)

const paginatedSubmissions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return modSubmissionsListStore.filteredSubmissionDataForListComponent.slice(start, end)
})
const totalSubmissions = computed(() =>
    modSubmissionsListStore.filteredSubmissionDataForListComponent.length)

</script>

