<template>
    <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { initializeGqlClient } from './utils/graphql.js'

initializeGqlClient()
</script>
