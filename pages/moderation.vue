<template>
    <div data-testid="moderation-page" class="flex flex-row min-h-screen">
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
import { useModerationScreenStore, ModerationScreen } from "~/stores/moderationScreenStore"
import { useRoute } from 'vue-router'

const store = useModerationScreenStore()
const route = useRoute()
const currentPath = route.path.replace("/", "")

store.setEnableModerationPanelToTrue(currentPath)
</script>
