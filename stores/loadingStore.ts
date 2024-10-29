import { defineStore, type StoreGeneric } from 'pinia'
import { ref, type Ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(false)

    const setIsLoading = (newValue: boolean) => isLoading.value = newValue === true ? true : false

    // Change isLoading based on store load
    const checkStoresInstalled = async (stores: StoreGeneric[] | StoreGeneric) => {
        if (Array.isArray(stores)) await Promise.all(stores)
        else await Promise.resolve(stores)
        setIsLoading(false)
    }

    return { isLoading, setIsLoading, checkStoresInstalled }
})
