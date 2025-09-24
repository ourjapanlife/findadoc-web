<template>
    <Transition name="slide-left">
        <div
            v-if="shouldShowPanel"
            v-close-on-outside-click="closePanelHandler"
            class="absolute left-0 inset-y-6 ml-1 bg-primary-bg
            border-l border-secondary-bg/40 shadow-lg z-20 rounded-lg"
            :class="[
                panelWidth,
            ]"
        >
            <!-- Close button -->
            <button
                class="absolute top-4 right-4 p-2 hover:bg-secondary-bg/20 rounded-full transition-colors z-30"
                @click="closePanelHandler"
            >
                <svg
                    class="w-6 h-6 stroke-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <!-- Panel Content -->
            <div class="h-full overflow-y-auto overflow-x-hidden pt-16 pb-2">
                <!-- Search Result Details -->
                <div v-if="bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails">
                    <SearchResultDetails />
                </div>

                <!-- Filters Panel -->
                <div v-else-if="bottomSheetStore.bottomSheetType === BottomSheetType.FiltersPanel">
                    <FiltersPanel />
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SearchResultDetails from '~/components/SearchResultDetails.vue'
import FiltersPanel from '~/components/FiltersPanel.vue'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'

const bottomSheetStore = useBottomSheetStore()
const searchResultsStore = useSearchResultsStore()

// Determine if panel should be shown (landscape mode only)
const shouldShowPanel = computed(() => (
    bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails
    || bottomSheetStore.bottomSheetType === BottomSheetType.FiltersPanel
))

// Dynamic panel width based on content type
const panelWidth = computed(() => {
    if (bottomSheetStore.bottomSheetType === BottomSheetType.SearchResultDetails) {
        return 'w-[480px]'
    } else if (bottomSheetStore.bottomSheetType === BottomSheetType.FiltersPanel) {
        return 'w-[400px]'
    }
    return 'w-[480px]'
})

// Close panel handler
const closePanelHandler = () => {
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultsList)
    searchResultsStore.clearActiveSearchResult()
}
</script>

<style scoped>
/* Slide in from the left on enter; slide out to the left on leave */
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0.4;
}
.slide-left-enter-active {
  transition: transform 300ms ease, opacity 300ms ease;
}
.slide-left-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.3;
}
</style>
