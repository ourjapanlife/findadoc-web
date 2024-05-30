<template>
    <!-- styling will change from px to rm -->
<<<<<<< Updated upstream
    <div class="h-[76px] bg-emerald-100">
        <div v-if="store.activeScreen === ModerationScreen.dashboard ">
            <p class="text-xl font-bold">TOPBAR MODERATION DASHBOARD</p>
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <p class="text-xl font-bold">TOPBAR REVIEW SUBMISSION</p> 
=======
    <div data-testid="mod-topbar" class="h-[76px] w-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard">
            <p class="text-xl font-bold">TOPBAR MODERATION DASHBOARD</p>
        </div>
        <div class="h-[76px] w-full" v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <ModEditSubmissionTopbar data-testid="mod-edit-submission-topbar" submissionId="" />
>>>>>>> Stashed changes
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()

</script>