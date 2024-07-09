<template>
    <div class="flex flex-row justify-between w-full">
        <div>
            <button
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
            <p
                v-show="showRetryMessage"
                class="flex flex-row justify-center items-center whitespace-nowrap text-error text-xs mr-2"
            >
                <SVGCautionSign class="w-3 h-3 mr-1" /> {{ retryMessage }}
            </p>
            <button
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                @click="saveAndExit"
            >
                <span
                    v-show="updatedFormBeingSentForMutation"
                    class="text-primary-text-muted"
                >
                    {{ $t('modEditSubmissionTopNav.saving') }}
                </span>
                <span
                    v-show="!updatedFormBeingSentForMutation"
                >
                    {{ $t('modEditSubmissionTopNav.saveAndExit') }}
                </span>
            </button>
            <button
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                @click="rejectSubmission"
            >
                {{
                    $t('modEditSubmissionTopNav.reject') }}
            </button>
            <button
                class="flex justify-center items-center rounded-full bg-primary w-28 text-primary-inverted text-sm mr-2 "
                @click="acceptSubmission"
            >
                {{
                    $t('modEditSubmissionTopNav.approve') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { gql } from 'graphql-request'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import SVGCautionSign from '~/assets/icons/caution-sign.svg'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

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

const retryMessage = computed(() =>
    t('modEditSubmissionTopNav.retryMessage', { seconds: retryMutationCountdown.value }))

const countdownCallback: CountdownCallback = (remainingSeconds, isFinished) => {
    retryMutationCountdown.value = remainingSeconds
    showRetryMessage.value = !isFinished
}

let stopCountdownTimer: () => void

const saveAndExit = () => {
    moderationSubmissionStore.handleUpdateSubmissionFromTopNav(true)
}

const acceptSubmission = () => {
    console.log('You are accepted')
}

const rejectSubmission = async () => {
    const facilityInputVariables = {
        updateSubmissionId: selectedSubmissionId.value,
        input: {
            isRejected: true
        }
    }

    try {
        await graphQLClientRequestWithRetry(
            gqlClient.request.bind(gqlClient),
            rejectFacilitySubmissionGqlMutation,
            facilityInputVariables
        )
        moderationSubmissionStore.setDidMutationFail(false)
    } catch (error) {
        console.error('Failed to reject submission:', error)
        moderationSubmissionStore.setDidMutationFail(true)
    }
}

const rejectFacilitySubmissionGqlMutation = gql`
mutation Mutation($updateSubmissionId: ID!, $input: UpdateSubmissionInput!) {
  updateSubmission(id: $updateSubmissionId, input: $input) {
    isRejected
  }
}`
</script>
