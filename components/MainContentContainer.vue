import SearchResultDetails from './SearchResultDetails.vue';

<template>
    <div class="h-full">
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            class="flex flex-1 bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90"
        >
            <!-- <WelcomeSection /> -->
            <Loader />
            <Modal v-show="store.$state.isOpen" class="min-h-1/2 ml-8 mt-12">
                <SearchResultDetails />
            </Modal>
            <MapContainer />
        </div>
        <div v-else class="h-full">
            <Modal v-show="store.$state.isOpen" class="min-h-1/2 ml-8 mt-12">
                <SearchResultDetails />
            </Modal>
            <div class="h-[50vh]">
                <MapContainer />
            </div>
            <div class="h-[50vh]">
                <SearchResultsList />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from "#app";
const { $viewport } = useNuxtApp();
import { useModalStore } from "~/stores/modalStore";

const store = useModalStore();
</script>
