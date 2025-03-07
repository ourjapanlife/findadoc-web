import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref(false)

    function setIsLoading(newValue: boolean) {
        if (newValue) {
            isLoading.value = true
            setTimeout(() => (isLoading.value = false), 2000)
        }
    }

    return { isLoading, setIsLoading }
})
