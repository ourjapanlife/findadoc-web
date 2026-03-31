<template>
    <div class="flex flex-row justify-between w-full">
        <div>
            <button
                type="button"
                data-testid="mod-edit-submission-copy-submission-id"
                class="flex flex-row bg-neutral p-2 m-2 border-2 border-slate-400 rounded hover"
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
        <div class="flex flex-row gap-2 justify p-2 font-bold ">
            <!-- <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="submission-topNav-update"
                @click="updateWithoutExiting"
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
                @click="updateAndExit"
            >
                <span>
                    {{ t('modEditSubmissionTopNav.updateAndExit') }}
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
            </button> -->
            <Button
                :button-style="'primaryOutline'"
                data-testid="submission-topNav-update"
                @click="updateWithoutExiting"
            >
                {{ t('modEditSubmissionTopNav.update') }}
            </Button>
            <Button
                :button-style="'primaryOutline'"
                data-testid="submission-topNav-updateAndExit"
                @click="updateAndExit"
            >
                {{ t('modEditSubmissionTopNav.updateAndExit') }}
            </Button>
            <Button
                :button-style="'destructive'"
                data-testid="mod-edit-submission-reject-button"
                @click="showRejectionConfirmation"
            >
                {{ t('modEditSubmissionTopNav.reject') }}
            </Button>
            <Button
                :button-style="'primary'"
                data-testid="submission-topNav-updateAndExit"
                @click="acceptSubmission"
            >
                {{ t('modEditSubmissionTopNav.approve') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import Button from '~/components/ui-components/ButtonTypes.vue'

const { t } = useI18n()

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

const updateAndExit = () => {
    moderationSubmissionStore.setUpdatingSubmissionFromTopBarAndExiting(true)
}

const updateWithoutExiting = () => {
    moderationSubmissionStore.setUpdatingSubmissionFromTopBar(true)
}

const acceptSubmission = () => {
    moderationSubmissionStore.setApprovingSubmissionFromTopBar(true)
}

const showRejectionConfirmation = () => {
    moderationSubmissionStore.setShowRejectSubmissionConfirmation(true)
}
</script>
