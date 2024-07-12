<template>
    <div class="h-full w-full">
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            id="landscape-content"
            class="bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90 h-full w-full relative"
        >
            <Loader />
            <Modal
                v-show="store.$state.isOpen"
                class="max-h-[calc(100vh-12rem)] ml-8 mt-12 overflow-y-auto"
            >
                <SearchResultDetails />
            </Modal>
            <div class="flex-1 h-full">
                <MapContainer />
            </div>
        </div>
        <div
            v-else
            class="h-full"
        >
            <Loader />
            <Modal
                v-show="store.$state.isOpen"
                class="min-h-1/2 ml-8 mt-12"
            >
                <SearchResultDetails />
            </Modal>
            <div class="h-1/4">
                <MapContainer />
            </div>
            <div class="h-3/4">
                <SearchResultsList />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
import { useModalStore } from '~/stores/modalStore'

const { $viewport } = useNuxtApp()
const store = useModalStore()
</script>
