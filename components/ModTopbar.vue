<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div v-if="moderationScreenStore.activeScreen === ModerationScreen.Dashboard">
            <ModDashboardTopbar />
        </div>
        <div
            v-else-if="moderationScreenStore.activeScreen === ModerationScreen.EditSubmission"
            class="h-[76px] w-full"
        >
            <ModEditSubmissionTopbar
                data-test-id="mod-edit-submission-topbar"
                :selected-id="modSubmissionsListStore.selectedSubmissionId"
            />
        </div>
        <div
            v-else-if="moderationScreenStore.activeScreen === ModerationScreen.EditFacility"
            class="h-[76px] w-full"
        >
            Facility Topbar
        </div>
        <div
            v-else-if="moderationScreenStore.activeScreen === ModerationScreen.EditHealthcareProfessional"
            class="h-[76px] w-full"
        >
            Healthcare Professional Topbar
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const moderationScreenStore = useModerationScreenStore()
const modSubmissionsListStore = useModerationSubmissionsStore()
</script>
