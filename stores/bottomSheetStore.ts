import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum BottomSheetType {
    SearchResultDetails = 'SEARCH_RESULT_DETAILS',
    FiltersPanel = 'FILTERS_PANEL'
}

export const useBottomSheetStore = defineStore('bottom-sheet-store', () => {
    const isOpen: Ref<boolean> = ref(false)
    const bottomSheetType: Ref<BottomSheetType> = ref(BottomSheetType.SearchResultDetails)

    function showBottomSheet(type: BottomSheetType) {
        isOpen.value = true
        bottomSheetType.value = type
    }

    function hideBottomSheet() {
        isOpen.value = false
    }

    return { isOpen, showBottomSheet, hideBottomSheet, bottomSheetType }
})
