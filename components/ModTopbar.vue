<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div class="flex px-6 py-3 justify-between w-full" v-if="store.activeScreen === ModerationScreen.dashboard">
            <ModDashboardTopBar data-test-id="mod-dashboard-topbar" />
        </div>
        <div class="h-[76px] w-full" v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <ModEditSubmissionTopbar data-test-id="mod-edit-submission-topbar" submissionId="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import ModEditSubmissionTopbar from './ModEditSubmissionTopbar.vue';
import ModDashboardTopBar from './ModDashboardTopBar.vue';


const store = useModerationScreenStore()
</script>
