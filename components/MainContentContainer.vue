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
                <SearchResultDetails />
                <MapContainer class="h-[calc(100vh)]" />
                <SearchResultsList class="relative bottom-1/2 z-20 h-1/2 mx-2 rounded-t-lg" />
            </div>
            <Footer class="z-10" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)
</script>
