import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum BottomSheetType {
    SearchResultDetails = 'SEARCH_RESULT_DETAILS',
    FiltersPanel = 'FILTERS_PANEL',
    SearchResultsList = 'SEARCH_RESULTS_LIST'
}

export const useBottomSheetStore = defineStore('bottomSheet', () => {
    const isOpen: Ref<boolean> = ref(false)
    const bottomSheetType: Ref<BottomSheetType> = ref(BottomSheetType.SearchResultsList)
    const isMinimized: Ref<boolean> = ref(false)

    function showBottomSheet(type: BottomSheetType) {
        isOpen.value = true
        bottomSheetType.value = type
    }

    function hideBottomSheet() {
        isOpen.value = false
    }

    return { isOpen, showBottomSheet, hideBottomSheet, bottomSheetType, isMinimized }
})
