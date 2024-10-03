<template>
    <div class="flex flex-row justify-between w-full">
        <div
            v-show="modalStore.isOpen"
            class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-10 bg-secondary bg-opacity-40"
        >
            <Modal
                class=" min-h-20 min-w-20"
                @modal-closed="resetModalRefs"
            >
                <div
                    v-if="moderationSubmissionStore.rejectingSubmissionFromTopBar"
                    class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
                >
                    <span class="font-bold text-3xl">
                        {{ $t('modEditSubmissionTopNav.rejectSubmission') }}
                    </span>
                    <button
                        type="button"
                        class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                        @click="rejectSubmission"
                    >
                        {{ $t('modEditSubmissionTopNav.confirmSubmissionRejection') }}
                    </button>
                </div>
            </Modal>
        </div>
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
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="submission-topNav-saveAndExit"
                @click="saveAndExit"
            >
                <span>
                    {{ $t('modEditSubmissionTopNav.saveAndExit') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                @click="confirmRejection"
            >
                {{
                    $t('modEditSubmissionTopNav.reject') }}
            </button>
            <button
                type="button"
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
import { useRouter } from 'vue-router'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useModalStore } from '~/stores/modalStore'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql'

const modalStore = useModalStore()
const moderationSubmissionStore = useModerationSubmissionsStore()
const screenStore = useModerationScreenStore()
const router = useRouter()
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

const rejectSubmission = async () => {
    modalStore.hideModal()

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
        routeUserToModerationScreen()
    } catch (error) {
        console.error('Failed to reject submission:', error)
        moderationSubmissionStore.setDidMutationFail(true)
    }
}

const routeUserToModerationScreen = () => {
    screenStore.setActiveScreen(ModerationScreen.Dashboard)
    router.push('/moderation')
}

const confirmRejection = async () => {
    moderationSubmissionStore.setRejectingSubmissionFromTopBar(true)
    modalStore.showModal()
}

const resetModalRefs = async () => {
    moderationSubmissionStore.setRejectingSubmissionFromTopBar(false)
}

const rejectFacilitySubmissionGqlMutation = gql`
mutation Mutation($updateSubmissionId: ID!, $input: UpdateSubmissionInput!) {
  updateSubmission(id: $updateSubmissionId, input: $input) {
    isRejected
  }
}`
</script>
