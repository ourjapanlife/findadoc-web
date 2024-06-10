<template>
    <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { initializeGqlClient } from './utils/graphql.js'

initializeGqlClient()
</script>
