<template>
    <div
        :style="submissionListItemTableColumns"
        :class="`grid grid-cols-5 p-2`"
    >
        <div class="font-bold text-left p-1">
            #
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.name") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.status") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.modified") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.submitted") }}
        </div>
        <div
            v-if="healthCareProfessionalsChosen"
            class="col-span-5"
        >
            <div
                v-for="(submission, index) in modSubmissionsStore.filteredSubmissionDataForListComponent"
                :key="index"
                class="col-span-5 bg-tertiary-bg"
            >
                <div v-if="submission.healthcareProfessionals">
                    <div
                        v-for="(professional, professionalIndex) in submission.healthcareProfessionals"
                        :key="professionalIndex"
                        class="grid grid-cols-5 col-span-5 bg-tertiary-bg cursor-pointer hover:bg-primary"
                    >
                        <nuxt-link
                            :to="`/moderation/editsubmission/${submission.id}`"
                            class="grid grid-cols-5 col-span-5 bg-primary-text-muted p-1 hover:bg-primary"
                            :style="submissionListItemTableColumns"
                        >
                            <span class="text-start">{{ index }} - {{ professionalIndex + 1 }}</span>
                            <span
                                :data-testid="`mod-submission-name-${professionalIndex + 1}`"
                                class="text-start"
                            >{{
                                professional.names[0].firstName }} {{ professional.names[0].lastName }}</span>
                            <span class="text-start">{{ getSubmissionStatus(submission) }}</span>
                            <span class="text-start">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                            <span class="text-start">{{ convertDateToLocalTime(submission.createdDate) }}</span>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else-if="hasSubmissions"
            class="grid grid-cols-subgrid col-span-5"
        >
            <div
                v-for="(submission, index) in modSubmissionsStore.filteredSubmissionDataForListComponent"
                :key="index"
                class="grid grid-cols-subgrid col-span-5 bg-tertiary-bg"
            >
                <div
                    :data-testid="`mod-submission-list-item-${index + 1}`"
                    class="grid grid-cols-subgrid col-span-5 bg-tertiary-bg cursor-pointer hover:bg-primary"
                    @click="handleClickToSubmissionForm(submission.id)"
                >
                    <nuxt-link
                        :to="`/moderation/editsubmission/${submission.id}`"
                        class="grid grid-cols-subgrid col-span-5 bg-primary-text-muted p-1 hover:bg-primary"
                    >
                        <span class="text-start">{{ index + 1 }}</span>
                        <span class="text-start">
                            {{ submission.facility?.nameEn || $t("modPanelSubmissionList.facilityNameUnknown") }}
                        </span>
                        <span class="text-start">{{ getSubmissionStatus(submission) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.updatedDate) }}</span>
                        <span class="text-start">{{ convertDateToLocalTime(submission.createdDate) }}</span>
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
import { useI18n } from 'vue-i18n'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import type { Submission } from '~/typedefs/gqlTypes'

const { t } = useI18n()

const modSubmissionsStore = useModerationSubmissionsStore()

onMounted(async () => {
    await modSubmissionsStore.getSubmissions()
})

const healthCareProfessionalsChosen = computed(() => modSubmissionsStore.submissionHealtchareProfessionalsData.length)
const hasSubmissions = computed(() => modSubmissionsStore.submissionsData.length)

const getSubmissionStatus = (submission: Submission) => {
    switch (true) {
        case submission.isUnderReview:
            return t('modPanelSubmissionList.underReview')
        case submission.isApproved:
            return t('modPanelSubmissionList.approved')
        case submission.isRejected:
            return t('modPanelSubmissionList.rejected')
        default:
            return t('modPanelSubmissionList.new')
    }
}

const convertDateToLocalTime = (isoString: string) => new Date(isoString).toLocaleString()

const submissionListItemTableColumns = computed(() => {
    const numOfColumns = 5
    const defaultColumnWidth = 10
    const remainingWidth = 100 - defaultColumnWidth
    const columnWidth = remainingWidth / (numOfColumns - 1)
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numOfColumns - 1}, ${columnWidth}%);`
})

const handleClickToSubmissionForm = (id: string) => {
    useModerationScreenStore().setActiveScreen(ModerationScreen.editSubmission)
    modSubmissionsStore.selectedSubmissionId = id
}
</script>
