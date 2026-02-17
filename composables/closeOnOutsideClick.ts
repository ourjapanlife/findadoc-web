/* eslint-disable no-underscore-dangle */
import type { DirectiveBinding } from 'vue'

type BindingValue
    = | (() => void)
      | {
          onOutside: () => void
          when?: () => boolean // optional predicate: only close when open
      }

type ElWithOutsideHandler = HTMLElement & {
    __outsideHandler?: (event: Event) => void
}

export const vCloseOnOutsideClick = {
    mounted(el: ElWithOutsideHandler, binding: DirectiveBinding<BindingValue>) {
        const get = () => {
            const v = binding.value
            return typeof v === 'function'
                ? { onOutside: v, when: undefined }
                : v
        }

        el.__outsideHandler = (event: Event) => {
            const { onOutside, when } = get()

            // only run when predicate allows (for instance if menu is open)
            if (when && !when()) return

            const path = (event as PointerEvent).composedPath?.() ?? []
            const clickedInside = path.includes(el)

            if (!clickedInside) onOutside()
        }

        document.addEventListener('pointerdown', el.__outsideHandler, true)
    },

    unmounted(el: ElWithOutsideHandler) {
        if (el.__outsideHandler) {
            document.removeEventListener('pointerdown', el.__outsideHandler, true)
            delete el.__outsideHandler
        }
    }
}
