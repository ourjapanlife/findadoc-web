<template>
    <div class="h-full w-full">
        <div
            v-if="!isPortrait"
            id="landscape-content"
            class="bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90 h-full w-full relative"
        >
            <Loader />
            <Modal
                class="overflow-y-auto"
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
import { useScreenOrientation } from '~/composables/useScreenOrientation'

const { isPortrait } = useScreenOrientation()
</script>
