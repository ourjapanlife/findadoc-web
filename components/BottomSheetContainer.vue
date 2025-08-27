<template>
    <!-- We want to hide the overlay since SearchResults will be shown with the map -->
    <!-- z-index is set to 0 to allow the results list to be behind the details sheet -->
    <BottomSheet
        ref="bottomSheetRef"
        :overlay="false"
        :overlay-click-close="false"
        :can-swipe-close="false"
        :z-index="0"
        :initial-position="50"
        :custom-positions="[80, 50, 25]"
        @dragging-content="handleDraggingContent"
    >
        <!-- Close button -->
        <button
            v-if="showCloseButton"
            data-testid="filters-panel-close-button"
            class="absolute top-4 right-2 px-2 py-.5 mr-2"
            @click="resetSheet()"
        >
            <svg
                class="stroke-primary/60"
                width="20"
                heigh="20"
                viewBox="4 0 15 25"
            >
                <path
                    stroke-width="3"
                    fill="none"
                    d="M6.25,6.25,17.75,17.75"
                />
                <path
                    stroke-width="3"
                    fill="none"
                    d="M6.25,17.75,17.75,6.25"
                />
            </svg>
        </button>
        <!-- Bottom Sheet Content -->
        <!-- We want to share the same bottom sheet to keep the UX smooth -->
        <!-- We use v-show here for components that we don't re-running queries every time  -->
        <SearchResultDetails v-if="bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails" />
        <SearchResultsList
            v-show="bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultsList"
            @scrolled="handleDraggingContent"
        />
        <FiltersPanel v-show="bottomSheetStore.bottomSheetType === BottomSheetType.FiltersPanel" />
    </BottomSheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type BottomSheet from '~/components/BottomSheet.vue'
import SearchResultDetails from '~/components/SearchResultDetails.vue'
import SearchResultsList from '~/components/SearchResultsList.vue'
import FiltersPanel from '~/components/FiltersPanel.vue'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'

const bottomSheetStore = useBottomSheetStore()

// Refs
const bottomSheetRef = ref<typeof BottomSheet | null>(null)
const showCloseButton = ref(false)
const beforeMinimizedPosition = ref(75)

//Vue Event Handlers
onMounted(() => {
    bottomSheetRef.value?.open()
})

watch(() => bottomSheetStore.bottomSheetType, newType => {
    switch (newType) {
        case BottomSheetType.SearchResultsList:
            bottomSheetRef.value?.setPosition(50)
            beforeMinimizedPosition.value = 50
            showCloseButton.value = false
            bottomSheetStore.isMinimized = false
            break
        case BottomSheetType.FiltersPanel:
            // Set position to 100 when showing filters panel, since this is the main, focused content
            bottomSheetRef.value?.setPosition(10)
            beforeMinimizedPosition.value = 10
            showCloseButton.value = true
            bottomSheetStore.isMinimized = false
            break
        case BottomSheetType.SearchResultDetails:
            // Set position to 75% when showing search result details, since this is the main, focused content
            // However, we still want to use the map and show where the result is located
            bottomSheetRef.value?.setPosition(25)
            beforeMinimizedPosition.value = 25
            showCloseButton.value = true
            bottomSheetStore.isMinimized = false
            break
    }
})

watch(() => bottomSheetStore.isMinimized, isMinimized => {
    if (isMinimized) {
        bottomSheetRef.value?.setPosition(80)
    } else {
        bottomSheetRef.value?.setPosition(beforeMinimizedPosition.value)
    }
})

// Functions
const resetSheet = () => {
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultsList)
}

const handleDraggingContent = () => {
    // If the user is dragging up on minimized sheet, expand the sheet so they can see more
    bottomSheetStore.isMinimized = false
    beforeMinimizedPosition.value = 25
    bottomSheetRef.value?.setPosition(25)
}
</script>
