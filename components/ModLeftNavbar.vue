<template>
    <div class="w-64 p-4 border-r border-slate-300">
        <div v-if="store.activeScreen === ModerationScreen.Dashboard ">
            <ModDashboardLeftNavbar />
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.EditSubmission">
            <p class="text-xl font-bold">
                NAVBAR REVIEW SUBMISSION
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()
</script>
