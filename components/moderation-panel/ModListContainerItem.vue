<template>
    <div
        v-if="props.submission && submissionsModerationListViewChosen"
        class="h-full max-w-4xl mx-2"
    >
        <NuxtLink
            class="block h-full mx-2"
            :to="`/moderation/edit-submission/${props.submission.id}`"
            :data-testid="`mod-submission-list-item-${index + 1}`"
            @click="handleClickToSubmissionForm(props.submission.id)"
        >
            <div
                class="flex flex-col justify-between my-2 mx-1 bg-primary-inverted border-2 border-primary/50 rounded-lg
       p-4 h-64 max-w-4xl
       shadow-md hover:shadow-2xl
       transform hover:scale-105
       transition ease-in-out duration-200"
            >
                <div class="flex items-center">
                    <span class="font-bold text-primary-text-muted">
                        # {{ props.paginationGlobalRowValueFunction(currentOffset, index) }}
                    </span>
                    <div class="flex flex-wrap gap-1 ml-2">
                        <span
                            v-if="isNewSubmission"
                            class="text-xs px-2 py-1 rounded-full bg-success/80 text-primary-inverted"
                        >
                            {{ t('modListContainerItem.newSubmission') }}
                        </span>
                        <span
                            v-if="props.submission.isUnderReview"
                            class="text-xs px-2 py-1 rounded-full bg-info/80 text-primary-inverted ml-2"
                        >
                            {{ t('modListContainerItem.underReviewSubmission') }}
                        </span>
                        <span
                            v-if="props.submission.isApproved"
                            class="text-xs px-2 py-1 rounded-full bg-success/80 text-primary-inverted ml-2"
                        >
                            {{ t('modListContainerItem.approvedSubmission') }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-3 my-4">
                    <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <SVGHPPersonIcon class="w-10 h-10 text-primary-inverted rounded-full" />
                    </div>
                    <div class="flex-1">
                        <span class="block text-lg font-bold">
                            {{ props.submission.healthcareProfessionalName }}
                        </span>
                    </div>
                </div>

                <div class="flex justify-end mt-2">
                    <span class="text-sm text-gray-500">
                        {{ isNewSubmission
                            ? t('modListContainerItem.createdDate') + ': ' + formatToReadableDate(props.submission.createdDate)
                            : t('modListContainerItem.updatedDate') + ': ' + formatToReadableDate(props.submission.updatedDate)
                        }}
                    </span>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { Submission } from '~/typedefs/gqlTypes'
import { useModerationSubmissionsStore, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'
import { formatToReadableDate } from '~/utils/dateUtils'
import SVGHPPersonIcon from '~/assets/icons/hp-person-icon.svg'

const { t } = useI18n()

const modSubmissionsListStore = useModerationSubmissionsStore()

const submissionsModerationListViewChosen = computed(() => modSubmissionsListStore.selectedModerationListViewChosen
  === SelectedModerationListView.Submissions)

const props = defineProps<{ submission: Submission
    paginationGlobalRowValueFunction: (offset: number, index: number) => number
    currentOffset: number
    index: number }>()

const handleClickToSubmissionForm = (id: string) => {
    modSubmissionsListStore.selectedSubmissionId = id
}

const isNewSubmission = computed(() => {
    if (!props.submission) {
        return false
    }
    if (props.submission.isApproved || props.submission.isRejected || props.submission.isUnderReview) {
        return false
    }
    return true
})
</script>
