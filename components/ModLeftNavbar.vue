<template>
    <div class="w-64 p-4 border-r border-slate-300">
        <div v-if="store.activeScreen === ModerationScreen.dashboard ">
            <p class="text-xl font-bold">NAVBAR MODERATION DASHBOARD</p>
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <p class="text-xl font-bold">NAVBAR REVIEW SUBMISSION</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()

</script>

