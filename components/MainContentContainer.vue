<template>
    <div class="h-full w-full">
        <div
            v-if="$viewport.isGreaterThan('tablet')"
            id="landscape-content"
            class="flex items-end bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90 h-full w-full relative"
        >
            <Loader />
            <Modal :is-side-modal="true">
                <SearchResultDetails />
            </Modal>
            <div class="flex-1 h-full">
                <MapContainer />
            </div>
        </div>
        <div
            v-else
            class="relative h-full"
        >
            <Loader />
            <Modal
                :is-side-modal="true"
                :is-side-modal-mobile-view="true"
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

const { $viewport } = useNuxtApp()
</script>
