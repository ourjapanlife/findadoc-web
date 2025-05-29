import type { DirectiveBinding } from 'vue'

type ElWithOutsideHandler = HTMLElement & {
    clickOutsideEvent: (event: MouseEvent) => void
}

export const vCloseOnOutsideClick = {
    mounted: (el: ElWithOutsideHandler, binding: DirectiveBinding) => {
        let isOpen = false

        el.clickOutsideEvent = event => {
            const eventTarget: EventTarget | null = event.target
            const isClickInsideElement = (el == eventTarget || el.contains(eventTarget as Node))
            if (isOpen && !isClickInsideElement) {
                binding.value()
                isOpen = false
            }
            if (!isOpen) {
                isOpen = true
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: (el: ElWithOutsideHandler) => {
        document.removeEventListener('click', el.clickOutsideEvent)
    }
}
