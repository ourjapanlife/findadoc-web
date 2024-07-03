<template>
    <div
        id="index"
        class="h-full w-full overflow-hidden"
    >
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            class="flex h-full overflow-clip"
        >
            <LeftNavbar class="bg-primary-bg w-96" />
            <MainContentContainer class="overflow-clip" />
        </div>
        <div
            v-else
            class="h-full w-full"
        >
            <MainContentContainer />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { useModalStore } from '~/stores/modalStore'

const { $viewport } = useNuxtApp()
useModalStore()
</script>
