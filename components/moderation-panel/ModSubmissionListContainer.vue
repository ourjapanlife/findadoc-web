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
                        <span>
                            {{ getGlobalRowNumber(modSubmissionsListStore.currentOffset, index) }}
                        </span>
                        <span>
                            {{ submission.healthcareProfessionalName || t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span>{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span>{{ convertDateToLocalTime(submission.createdDate) }}</span>
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
                        <span>
                            {{ getGlobalRowNumber(facilitiesStore.currentOffset, index) }}
                        </span>
                        <span>
                            {{ facility?.nameEn }}
                        </span>
                        <span>{{ convertDateToLocalTime(facility.updatedDate) }}</span>
                        <span>{{ convertDateToLocalTime(facility.createdDate) }}</span>
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
                        <span>
                            {{ getGlobalRowNumber(healthcareProfessionalsStore.currentOffset, index) }}
                        </span>
                        <span>
                            {{ healthcareProfessional.names[0].firstName }} {{ healthcareProfessional.names[0].lastName }}
                        </span>
                        <span>{{ convertDateToLocalTime(healthcareProfessional.updatedDate) }}</span>
                        <span>{{ convertDateToLocalTime(healthcareProfessional.createdDate) }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else>
            {{ t("modPanelSubmissionList.noSubmissions") }}
        </div>
    </div>

    <div class="w-full flex justify-between items-center mt-4">
        <div class="flex items-center mr-4">
            <label
                for="items-per-page-select"
                class="text-sm text-gray-700 mr-2"
            >{{ $t('modSubmissionListContainer.resultsPerPage') }}
            </label>
            <select
                id="items-per-page-select"
                :value="getCurrentItemsPerPage()"
                class="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-primary focus:border-primary"
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

        <Pagination
            v-if="modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions"
            :current-offset="modSubmissionsListStore.currentOffset"
            :total-items="modSubmissionsListStore.totalSubmissionsCount"
            :items-per-page="modSubmissionsListStore.itemsPerPage"
            @update:offset="modSubmissionsListStore.setOffset"
        />
        <Pagination
            v-else-if="modSubmissionsListStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities"
            :current-offset="facilitiesStore.currentOffset"
            :total-items="facilitiesStore.totalFacilitiesCount"
            :items-per-page="facilitiesStore.itemsPerPage"
            @update:offset="facilitiesStore.setOffset"
        />
        <Pagination
            v-else-if="modSubmissionsListStore.selectedModerationListViewChosen
                === SelectedModerationListView.HealthcareProfessionals"
            :current-offset="healthcareProfessionalsStore.currentOffset"
            :total-items="healthcareProfessionalsStore.totalHealthcareProfessionalsCount"
            :items-per-page="healthcareProfessionalsStore.itemsPerPage"
            @update:offset="healthcareProfessionalsStore.setOffset"
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

function getGlobalRowNumber(offset: number, index: number): number {
    return offset + index + 1
}

function getCurrentItemsPerPage(): number {
    switch (modSubmissionsListStore.selectedModerationListViewChosen) {
        case SelectedModerationListView.Submissions:
            return modSubmissionsListStore.itemsPerPage
        case SelectedModerationListView.Facilities:
            return facilitiesStore.itemsPerPage
        case SelectedModerationListView.HealthcareProfessionals:
            return healthcareProfessionalsStore.itemsPerPage
        default:
            return 25 // Default fallback
    }
}

async function handleItemsPerPageChange(event: Event) {
    const newItemsPerPage = Number((event.target as HTMLSelectElement).value)
    switch (modSubmissionsListStore.selectedModerationListViewChosen) {
        case SelectedModerationListView.Submissions:
            modSubmissionsListStore.setItemsPerPage(newItemsPerPage)
            modSubmissionsListStore.setOffset(0)
            await modSubmissionsListStore.getSubmissions()
            break
        case SelectedModerationListView.Facilities:
            facilitiesStore.setItemsPerPage(newItemsPerPage)
            facilitiesStore.setOffset(0)
            await facilitiesStore.getFacilities()
            break
        case SelectedModerationListView.HealthcareProfessionals:
            healthcareProfessionalsStore.setItemsPerPage(newItemsPerPage)
            healthcareProfessionalsStore.setOffset(0)
            await healthcareProfessionalsStore.getHealthcareProfessionals()
            break
    }
}
</script>

