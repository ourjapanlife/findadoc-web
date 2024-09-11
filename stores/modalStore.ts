import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useModalStore = defineStore('modal-store', () => {
    const isOpen: Ref<boolean> = ref(false)

    function showModal(newValue: boolean) {
        isOpen.value = newValue === true ? true : false
    }

    function hideModal(newValue: boolean) {
        isOpen.value = newValue === false ? false : true
    }

    return { isOpen, showModal, hideModal }
})
