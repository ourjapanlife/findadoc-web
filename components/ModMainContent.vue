<template>
    <div class="h-full">
        <div v-if="screenStore.activeScreen === ModerationScreen.dashboard">
            <ModSubmissionListContainer />
        </div>
        <div
            v-else-if="screenStore.activeScreen === ModerationScreen.editSubmission"
            class="h-full"
        >
            <ModSubmissionsEditFormFacility />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, watch } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'

const route = useRoute()

const screenStore = useModerationScreenStore()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const submissionIdInParams = computed(() => route.params.id as string)

watch(submissionIdInParams, newSelectedSubmissionId => {
    if (newSelectedSubmissionId) {
        screenStore.setActiveScreen(ModerationScreen.editSubmission)
        moderationSubmissionsStore.selectedSubmissionId = newSelectedSubmissionId
    } else {
        screenStore.setActiveScreen(ModerationScreen.dashboard)
        moderationSubmissionsStore.selectedSubmissionId = ''
    }
})

onMounted(() => {
    if (submissionIdInParams.value) {
        screenStore.setActiveScreen(ModerationScreen.editSubmission)
        moderationSubmissionsStore.selectedSubmissionId = submissionIdInParams.value
    }
})
</script>
