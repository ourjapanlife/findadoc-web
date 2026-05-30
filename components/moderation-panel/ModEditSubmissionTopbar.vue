<template>
    <div class="flex flex-row justify-between w-full">
        <div class="flex flex-row items-center">
            <button
                type="button"
                data-testid="mod-edit-submission-back-to-dashboard"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2 p-2 m-2 font-bold"
                @click="goToDashboard"
            >
                {{ t('modEditFacilityOrHPTopbar.back') }}
            </button>
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
                data-testid="submission-topNav-update"
                @click="requestUpdate"
            >
                <span>
                    {{ t('modEditSubmissionTopNav.update') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="submission-topNav-updateAndExit"
                @click="requestUpdateAndExit"
            >
                <span>
                    {{ t('modEditSubmissionTopNav.updateAndExit') }}
                </span>
            </button>
            <button
                data-testid="mod-edit-submission-reject-button"
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                @click="requestRejectConfirmation"
            >
                {{
                    t('modEditSubmissionTopNav.reject') }}
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-primary w-28 text-primary-inverted text-sm mr-2 "
                @click="requestApproveConfirmation"
            >
                {{
                    t('modEditSubmissionTopNav.approve') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { ModerationSubmissionActionType, useModerationSubmissionActions } from '~/composables/useModerationSubmissionActions'
import { navigateToModerationDashboard } from '~/utils/moderationUtils'

const { t } = useI18n()
const router = useRouter()
const moderationScreenStore = useModerationScreenStore()
const modalStore = useModalStore()

const moderationSubmissionStore = useModerationSubmissionsStore()
const moderationSubmissionUnsavedStore = useModerationSubmissionUnsavedStore()
const { emitModerationSubmissionAction } = useModerationSubmissionActions()
const { selectedSubmissionId } = storeToRefs(moderationSubmissionStore)

const goToDashboard = () => {
    moderationSubmissionUnsavedStore.runEditSubmissionBackOr(() =>
        navigateToModerationDashboard(router, moderationScreenStore, modalStore))
}

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

const requestUpdateAndExit = () => {
    emitModerationSubmissionAction(ModerationSubmissionActionType.UpdateAndExit)
}

const requestUpdate = () => {
    emitModerationSubmissionAction(ModerationSubmissionActionType.Update)
}

const requestApproveConfirmation = () => {
    emitModerationSubmissionAction(ModerationSubmissionActionType.Approve)
}

const requestRejectConfirmation = () => {
    emitModerationSubmissionAction(ModerationSubmissionActionType.Reject)
}
</script>
