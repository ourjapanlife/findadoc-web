<template>
    <div class="flex flex-row justify-between w-full">
        <div>
            <button
                type="button"
                data-testid="mod-edit-submission-copy-submission-id"
                class="flex flex-row w-90 bg-neutral p-2 m-2 border-2 border-slate-400 rounded hover"
                @click="copySubmissionId"
            >
                ID: {{ selectedSubmissionId }}
                <SVGSuccessCheckMark
                    v-if="showCopySuccessIcon"
                    role="img"
                    title="clipboard copy"
                    class="ml-2 w-6"
                />
                <SVGCopyContent
                    v-else
                    role="img"
                    title="successful copy"
                    class="ml-2 w-6"
                />
            </button>
        </div>
        <div class="flex flex-row justify p-2 font-bold ">
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="submission-topNav-saveAndExit"
                @click="saveAndExit"
            >
                <span>
                    {{ t('modEditSubmissionTopNav.saveAndExit') }}
                </span>
            </button>
            <button
                data-testid="mod-edit-submission-reject-button"
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                @click="showRejectionConfirmation"
            >
                {{
                    t('modEditSubmissionTopNav.reject') }}
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-primary w-28 text-primary-inverted text-sm mr-2 "
                @click="acceptSubmission"
            >
                {{
                    t('modEditSubmissionTopNav.approve') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useModalStore } from '~/stores/modalStore'

const { t } = useI18n()

const modalStore = useModalStore()
const moderationSubmissionStore = useModerationSubmissionsStore()
const selectedSubmissionId: Ref<string> = ref(moderationSubmissionStore.selectedSubmissionId)

const showCopySuccessIcon: Ref<boolean> = ref(false)

const copySubmissionId = async () => {
    try {
        await navigator.clipboard.writeText(selectedSubmissionId.value)
        showCopySuccessIcon.value = true
        setTimeout(() => {
            showCopySuccessIcon.value = false
        }, 2000)
    } catch (err: unknown) {
        console.error(`Failed to copy submission ID ${selectedSubmissionId.value}: ${err}`)
    }
}

const saveAndExit = () => {
    moderationSubmissionStore.setUpdatingSubmissionFromTopBar(true)
}

const acceptSubmission = () => {
    moderationSubmissionStore.setApprovingSubmissionFromTopBar(true)
    modalStore.showModal()
}

const showRejectionConfirmation = () => {
    moderationSubmissionStore.setShowRejectSubmissionConfirmation(true)
    modalStore.showModal()
}
</script>
