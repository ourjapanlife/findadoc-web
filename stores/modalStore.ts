import { defineStore } from 'pinia'

export const useModalStore = defineStore({
    id: 'modal-store',
    state: () => ({
        isOpen: false
    }),
    actions: {
        showModal(): void {
            this.isOpen = true
        },
        hideModal(): void {
            this.isOpen = false
        }
    }
})
