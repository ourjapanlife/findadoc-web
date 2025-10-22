<template>
    <div class="h-full w-full">
        <Onboarding
            v-if="onboardingState === OnboardingState.NotStarted"
        />
        <!-- Search Container -->
        <div
            v-if="onboardingState === OnboardingState.Completed"
            id="search-container"
            class="flex flex-col h-svh overflow-hidden"
        >
            <TopNav class="absolute top-0 left-0 right-0 z-10 mx-2" />
            <!-- Landscape / Desktop Mode -->
            <div
                v-if="isLandscape"
                id="search-landscape"
                class="flex flex-col flex-1 overflow-hidden "
            >
                <Loader />
                <div class="flex flex-1 overflow-hidden">
                    <LeftNavbar
                        class="bg-primary-bg w-96 z-20
                    fixed top-24 left-0 h-[calc(95vh-96px)] rounded-r-md"
                    />
                    <div class="flex-1 relative">
                        <MapContainer class="h-full" />
                        <SlidingRightPanel />
                    </div>
                </div>
            </div>
            <!-- Portrait / Mobile Mode -->
            <div
                v-else
                id="search-portrait"
                class="h-svh"
            >
                <Loader />
                <BottomSheetContainer />
                <MapContainer
                    class="h-[calc(100vh)]"
                    @map-moved="handleMapMoved"
                />
            </div>
            <Footer class="z-20 absolute bottom-0 left-0 right-0 mx-2" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useBottomSheetStore } from '@/stores/bottomSheetStore'
import SlidingRightPanel from '~/components/SlidingRightPanel.vue'
import { useScreenOrientation } from '~/composables/useScreenOrientation'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)

const bottomSheetStore = useBottomSheetStore()
const { isLandscape } = useScreenOrientation()

// Handle map movement by calling the store's minimize function
const handleMapMoved = () => {
    if (bottomSheetStore.isMinimized === false) {
        bottomSheetStore.isMinimized = true
    }
}
</script>
