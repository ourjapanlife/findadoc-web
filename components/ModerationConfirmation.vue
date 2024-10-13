<template>
    <div
        v-if="moderationSubmissionsStore.approvingSubmissionFromTopBar"
        class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
    >
        <span class="font-bold text-3xl">
            {{ $t('modSubmissionForm.confirmApproveSubmissionMessage') }}
        </span>
        <button
            type="button"
            class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
            @click="handleApproveChangesConfirmation"
        >
            {{ $t('modSubmissionForm.confirmApproveSubmissionButton') }}
        </button>
    </div>

    <div
        v-else
        class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
    >
        <span class="font-bold text-3xl">{{ $t('modSubmissionForm.hasUnsavedChanges') }}</span>
        <button
            data-testid="submission-form-modal-confirmation-btn"
            class="bg-secondary p-4 rounded-full my-8 font-semibold text-xl hover:bg-primary"
            @click="handleNavigateToModerationScreen"
        >
            {{ $t('modSubmissionForm.confirmLeavePageButton') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const modalStore = useModalStore()
const screenStore = useModerationScreenStore()
const router = useRouter()
const emit = defineEmits(['approve-changes-confirmation'])

const handleNavigateToModerationScreen = () => {
    modalStore.hideModal()
    screenStore.setActiveScreen(ModerationScreen.Dashboard)
    router.push('/moderation')
}

const handleApproveChangesConfirmation = () => {
    console.log('emitting')
    emit('approve-changes-confirmation')
}
</script>
