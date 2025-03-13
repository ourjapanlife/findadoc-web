import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(false)
    let timeout: ReturnType<typeof setTimeout> | null = null

    function setIsLoading(loadingStatus: boolean) {
        if (loadingStatus) {
            isLoading.value = true

            if (timeout) clearTimeout(timeout)

            timeout = setTimeout(() => {
                isLoading.value = false
                timeout = null
            }, 2000)
        }
    }

    return { isLoading, setIsLoading }
})
