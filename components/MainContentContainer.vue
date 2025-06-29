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
            <TopNav class="relative top-0 left-0 z-10" />
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
                class="h-[calc(100vh)]"
            >
                <Loader />
                <BottomSheet ref="searchResultDetailsBottomSheet">
                    <SearchResultDetails />
                </BottomSheet>
                <MapContainer class="h-full" />
                <SearchResultsList class="relative bottom-1/2 z-20 h-1/2 mx-2 rounded-t-lg" />
            </div>
            <Footer class="z-10" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import BottomSheet from '~/components/BottomSheet.vue'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { BottomSheetType, useBottomSheetStore } from '@/stores/bottomSheetStore'

const bottomSheetStore = useBottomSheetStore()
const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)

const searchResultDetailsBottomSheet = ref<typeof BottomSheet | null>(null)

watch(() => bottomSheetStore.isOpen, newVal => {
    if (newVal && bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails) {
        openPanel()
    } else if (!newVal && bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails) {
        closePanel()
    }
})

const openPanel = () => {
    searchResultDetailsBottomSheet.value?.open()
}

const closePanel = () => {
    searchResultDetailsBottomSheet.value?.close()
}
</script>
