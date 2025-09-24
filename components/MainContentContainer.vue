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
                v-if="useScreenOrientation().isLandscape.value"
                id="search-landscape"
                class="flex flex-col flex-1 min-h-0 overflow-hidden pt-24"
            >
                <Loader />
                <div class="flex flex-1 min-h-0 overflow-hidden">
                    <LeftNavbar class="bg-primary-bg w-96 flex-shrink-0 h-full" />
                    <div class="flex-1 relative min-h-0">
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
            <Footer class="z-10 flex-shrink-0" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useBottomSheetStore } from '@/stores/bottomSheetStore'
import SlidingRightPanel from '~/components/SlidingRightPanel.vue'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)

const bottomSheetStore = useBottomSheetStore()

// Handle map movement by calling the store's minimize function
const handleMapMoved = () => {
    if (bottomSheetStore.isMinimized === false) {
        bottomSheetStore.isMinimized = true
    }
}
</script>
