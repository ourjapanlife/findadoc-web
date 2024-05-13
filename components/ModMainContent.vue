<template>
    <div class="h-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard">
            <ModSubmissionListContainer />
        </div>
        <div class="h-full" v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <ModSubmissionsEditFormFacility />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import ModSubmissionListContainer from './ModSubmissionListContainer.vue'

const store = useModerationScreenStore()

</script>