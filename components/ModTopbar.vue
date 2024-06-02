<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard">
            <p class="text-xl font-bold">TOPBAR MODERATION DASHBOARD</p>
        </div>
        <div class="h-[76px] w-full" v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <ModEditSubmissionTopbar data-test-id="mod-edit-submission-topbar" submissionId="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import ModEditSubmissionTopbar from './ModEditSubmissionTopbar.vue';


const store = useModerationScreenStore()
</script>