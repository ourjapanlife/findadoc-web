<template>
    <div class="flex flex-col h-full">
        <BetaBanner />
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            class="flex h-full overflow-hidden"
        >
            <LeftNavbar class="bg-primary-bg w-[358px]" />
            <MainContentContainer />
        </div>
        <div v-else>
            <div class="flex-1">
                <div class="flex flex-col h-full">
                    <MainContentContainer />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app";
import { useModalStore } from "~/stores/modalStore";

const { $viewport } = useNuxtApp();
const store = useModalStore();
</script>
