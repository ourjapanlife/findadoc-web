<template>
    <div class="h-full w-full">
        <Onboarding
            v-if="onboardingState === OnboardingState.NotStarted"
        />
        <!-- Search Container -->
        <div
            v-if="onboardingState === OnboardingState.Completed"
            id="search-container"
        >
            <TopNav class="absolute top-0 left-0 right-0 z-10 mx-2" />
            <!-- Landscape / Desktop Mode -->
            <div
                v-if="$viewport.isGreaterThan('tablet')"
                id="search-landscape"
            >
                <Loader />
                <Modal class="max-h-[calc(100vh-10rem)] mt-12 overflow-y-auto">
                    <SearchResultDetails />
                </Modal>
                <div class="flex h-[calc(100vh-10rem)]">
                    <LeftNavbar class="bg-primary-bg w-96" />
                    <MapContainer class="grow" />
                </div>
            </div>
            <!-- Portrait / Mobile Mode -->
            <div
                v-else
                id="search-portrait"
                class="h-dvh"
            >
                <Loader />
                <BottomSheetContainer />
                <MapContainer
                    class="h-[calc(100vh)]"
                    @map-moved="handleMapMoved"
                />
            </div>
            <Footer class="z-10" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { BottomSheetType, useBottomSheetStore } from '@/stores/bottomSheetStore'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)

const bottomSheetStore = useBottomSheetStore()

// Handle map movement by calling the store's minimize function
const handleMapMoved = () => {
    if (bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultsList && bottomSheetStore.isMinimized === false) {
        bottomSheetStore.isMinimized = true
    }
}
</script>
