import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(false)

    function setIsLoading(newValue: boolean, duration: number = 0) {
        isLoading.value = newValue

        if (newValue && duration > 0) {
            setTimeout(() => (isLoading.value = false), duration)
        }
    }

    return { isLoading, setIsLoading }
})
