import SearchResultDetails from './SearchResultDetails.vue';

<template>
    <div class="h-full">
        <div v-if="loadingStore.isLoading">
            <Loader />
        </div>
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            class="flex flex-row h-full bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90"
        >
            <Modal
                v-show="modalStore.$state.isOpen"
                class="min-h-1/2 ml-8 mt-12"
            >
                <SearchResultDetails />
            </Modal>
            <div class="flex-1 h-full">
                <MapContainer />
            </div>
        </div>
        <div v-else class="h-full">
            <Modal
                v-show="modalStore.$state.isOpen"
                class="min-h-1/2 ml-8 mt-12"
            >
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
import { useLoadingStore } from "../stores/loadingStore.js";

const modalStore = useModalStore();
const loadingStore = useLoadingStore();
</script>
