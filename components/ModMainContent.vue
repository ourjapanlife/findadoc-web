<template>
    <div class="h-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard">
            <ModSubmissionListContainer />
        </div>
        <div
            v-else-if="store.activeScreen === ModerationScreen.editSubmission"
            class="h-full"
        >
            <ModSubmissionsEditFormFacility />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()
</script>
