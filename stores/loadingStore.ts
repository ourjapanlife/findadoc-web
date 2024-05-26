import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(false)

    function setIsLoading(newValue: boolean) {
        isLoading.value = newValue === true ? true : false
    }

    return { isLoading, setIsLoading }
})
