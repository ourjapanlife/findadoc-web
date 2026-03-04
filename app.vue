<template>
    <NuxtLayout>
        <NuxtPage />
        <ConfirmationDialog />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { initializeGqlClient } from './utils/graphql.js'

initializeGqlClient()
</script>
