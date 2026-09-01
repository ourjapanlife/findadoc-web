<template>
    <NuxtLayout>
        <NuxtPage />
        <ConfirmationDialog />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { initializeGqlClient } from './utils/graphql.js'
import { SITE_TITLE } from '~/utils/site'

initializeGqlClient()

// Wrap each page's title with the brand name. Pages without an explicit
// title fall back to the brand name alone, so we never render a broken
// " | Brand" or a doubled "Brand | Brand" title. This must be set at
// runtime (not in nuxt.config) because function templates are not
// serializable into the generated app config.
useHead({
    titleTemplate: (title?: string) => title ? `${title} | ${SITE_TITLE}` : SITE_TITLE
})
</script>
