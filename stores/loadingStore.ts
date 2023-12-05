import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
    const isLoading: Ref<boolean> = ref(true)

    function setIsLoading(newValue: boolean) {
        isLoading.value = newValue === true ? true : false
    }

    return { isLoading, setIsLoading }
})
