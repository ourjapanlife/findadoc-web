<template>
    <div class="h-full">
        <div v-if="store.activeScreen === ModerationScreen.dashboard ">
            <p class="text-xl font-bold">MAIN CONTAINER MODERATION DASHBOARD</p>
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <p class="text-xl font-bold">MAIN CONTAINER REVIEW SUBMISSION</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()

</script>