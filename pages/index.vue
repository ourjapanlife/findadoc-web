<template>
    <div
        id="index"
        class=""
    >
        <MainContentContainer />
    </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

// tell nuxt to our moderation layout
definePageMeta({
    layout: 'onboarding'
})
</script>
