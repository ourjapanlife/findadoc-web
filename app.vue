<template>
    <div class="h-full flex flex-col font-sans text-primary-text bg-primary-bg">
        <TopNav />
        <NuxtPage class="flex flex-1" />
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { initializeGqlClient } from './utils/graphql.js'

initializeGqlClient()
</script>
./utils/graphql.js
