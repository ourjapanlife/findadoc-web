<template>
    <div id="index" class="h-full w-full">
        <div v-if="$viewport.isGreaterThan('tablet')" class="flex h-full overflow-hidden">
            <LeftNavbar class="bg-primary-bg w-[358px]" />
            <MainContentContainer />
        </div>
        <div v-else class="h-full w-full">
            <MainContentContainer />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app"
import { useModalStore } from "~/stores/modalStore"

const { $viewport } = useNuxtApp()
const store = useModalStore()
</script>
