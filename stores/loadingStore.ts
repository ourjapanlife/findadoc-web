import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(false)

    function setIsLoading(newValue: boolean) {
        isLoading.value = newValue === true ? true : false
    }

    return { isLoading, setIsLoading }
})
