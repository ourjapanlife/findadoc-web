<template>
    <!-- The main app should be set to h-screen. This is to ensure that the TopNav and Footer are
        always visible on desktop screens without scrolling.
    -->
    <div data-testid="app" class="h-screen w-full">
        <div v-if="authStore.isLoggedIn" data-testid="moderation-content"
            class="h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <NuxtPage class="flex flex-1" />
        </div>
        <div v-else-if="!authStore.isLoggedIn"
            class="portrait:hidden h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <TopNav />
            <NuxtPage />
            <Footer />
        </div>
        <div
            v-else
            class="h-full w-full flex flex-col font-sans text-primary-text bg-primary-bg"
        >
            <TopNav />
            <NuxtPage />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { initializeGqlClient } from './utils/graphql.js'
import { initializeAuth0 } from '~/utils/auth0'
import { useAuthStore } from "~/stores/authStore"

initializeAuth0()
initializeGqlClient()

const authStore = useAuthStore()

</script>
