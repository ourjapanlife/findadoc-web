<template>
    <div
        data-testid="moderation-page"
        class="flex flex-row h-screen"
    >
        <!-- This button exists solely for testing that the states work and how you can implement it on other components. -->
        <!-- <button @click="store.setActiveScreen(ModerationScreen.editSubmission)">Change state!</button> -->
        <ModLeftNavbar />
        <div class="w-full flex flex-col items-stretch">
            <ModTopbar />
            <ModMainContent />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()
const route = useRoute()
const currentPath = route.path.replace('/', '')

store.setEnableModerationPanelToTrue(currentPath)
</script>
