<template>
    <div class="flex flex-col">
        <BetaBanner />
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            class="flex overflow-hidden"
        >
            <LeftNavbar class="flex-0 bg-primary-bg w-[358px]" />
            <div class="flex-1">
                <div class="flex flex-col md:flex-row h-full">
                    <MainContentContainer />
                </div>
            </div>
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
