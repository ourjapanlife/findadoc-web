<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard">
            <p class="text-xl font-bold">
                TOPBAR MODERATION DASHBOARD
            </p>
        </div>
        <div
            v-else-if="store.activeScreen === ModerationScreen.editSubmission"
            class="h-[76px] w-full"
        >
            <ModEditSubmissionTopbar
                data-test-id="mod-edit-submission-topbar"
                submission-id=""
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()
</script>
