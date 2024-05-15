<template>
    <div>
        <div v-if="store.enableModerationPanel" class="h-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <NuxtPage class="flex flex-1" />
        </div>
        <div v-else-if="!store.enableModerationPanel" class="h-full flex flex-col font-sans text-primary-text bg-primary-bg">
            <TopNav />
            <NuxtPage class="flex flex-1" />
            <Footer />
        </div>      
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore } from './stores/moderationScreenStore.js'
import { initializeGqlClient } from './utils/graphql.js'

const store = useModerationScreenStore()

initializeGqlClient()
</script>
./utils/graphql.js
