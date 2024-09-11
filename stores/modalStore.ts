import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useModalStore = defineStore('modal-store', () => {
    const isOpen: Ref<boolean> = ref(false)

    function showModal() {
        isOpen.value = true
    }

    function hideModal() {
        isOpen.value = false
    }

    return { isOpen, showModal, hideModal }
})
