<template>
    <div
        id="index"
    >
        <MainContentContainer />
    </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

// Use the onboarding layout because the index page is the onboarding page + search
definePageMeta({
    layout: 'onboarding'
})

const { t } = useI18n()

useHead({
    title: () => t('pageMeta.homeTitle')
})
</script>
