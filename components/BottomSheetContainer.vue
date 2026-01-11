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
        @scrolled="handleDraggingContent"
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
        <SearchResultDetails
            v-if="bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails"
        />
        <SearchResultsList
            v-show="bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultsList"
            @scrolled="handleDraggingContent"
        />
        <FiltersPanel v-show="bottomSheetStore.bottomSheetType === BottomSheetType.FiltersPanel" />
    </BottomSheet>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type BottomSheet from '~/components/BottomSheet.vue'
import SearchResultDetails from '~/components/SearchResultDetails.vue'
import SearchResultsList from '~/components/SearchResultsList.vue'
import FiltersPanel from '~/components/FiltersPanel.vue'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'
import { useSearchResultsStore } from '~/stores/searchResultsStore'

const bottomSheetStore = useBottomSheetStore()
const searchResultsStore = useSearchResultsStore()

// Refs
const bottomSheetRef = ref<typeof BottomSheet | null>(null)
const showCloseButton = ref(false)
const beforeMinimizedPosition = ref(75)

//Vue Event Handlers
onMounted(async () => {
    // Defer until the BottomSheet is fully mounted and Hammer handlers are attached
    await nextTick()
    bottomSheetRef.value?.open()
    // Explicitly set initial position to 50 to avoid any race with init
    bottomSheetRef.value?.setPosition(50)
})

watch(() => bottomSheetStore.bottomSheetType, newType => {
    switch (newType) {
        case BottomSheetType.SearchResultsList:
            // We start at 50% to show result details, but also can still see where it is on the map
            // The user can expand to see more details and hide the map later
            bottomSheetRef.value?.setPosition(50)
            beforeMinimizedPosition.value = 50
            showCloseButton.value = false
            bottomSheetStore.isMinimized = false
            break
        case BottomSheetType.FiltersPanel:
            // Set position to 100 when showing filters panel, since this is the main, focused content
            bottomSheetRef.value?.setPosition(25)
            beforeMinimizedPosition.value = 25
            showCloseButton.value = true
            bottomSheetStore.isMinimized = false
            break
        case BottomSheetType.SearchResultDetails:
            // Since this is the default view, we want it at 50% to show both the results and the map
            bottomSheetRef.value?.setPosition(50)
            beforeMinimizedPosition.value = 50
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
    // We want to clear the active result on the map and list
    searchResultsStore.clearActiveSearchResult()
}

const handleDraggingContent = () => {
    // If the user is dragging up on minimized sheet, expand the sheet so they can see more
    bottomSheetStore.isMinimized = false
    beforeMinimizedPosition.value = 25
    bottomSheetRef.value?.setPosition(25)
}
</script>
