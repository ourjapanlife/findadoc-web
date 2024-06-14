<template>
    <!-- The main app should be set to h-screen. This is to ensure that the TopNav and Footer are
        always visible on desktop screens without scrolling.
    -->
    <div data-testid="app" class="h-screen w-full">
        <div v-if="store.enableModerationPanel" data-testid="moderation-content"
            class="h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <NuxtPage class="flex flex-1" />
        </div>
        <div v-else-if="!store.enableModerationPanel && $viewport.isGreaterThan('desktop')"
            class="portrait:hidden h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <TopNav />
            <NuxtPage />
            <Footer />
        </div>
        <div v-else class="h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <TopNav />
            <NuxtPage />
        </div>
    </div>
</template>

<script setup lang="ts">
import { initializeGqlClient } from './utils/graphql.js'
import { useNuxtApp } from "#app";
import { useRuntimeConfig } from '#imports'
import { useModerationScreenStore } from "~/stores/moderationScreenStore"
import { useRoute } from 'vue-router'
const { $viewport } = useNuxtApp();

const store = useModerationScreenStore()
const route = useRoute()
const currentPath = route.path.replace("/", "")

store.setEnableModerationPanelToTrue(currentPath)

const useLocalAPI = useRuntimeConfig().public.NUXT_USE_LOCAL_API as string | undefined
initializeGqlClient(useLocalAPI)


</script>
