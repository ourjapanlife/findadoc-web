import type { ToastInterface } from 'vue-toastification'

const noopToast = new Proxy({} as ToastInterface, {
    get: () => () => undefined
})

/**
 * Client toasts come from the vue-toastification client plugin (`$toast`).
 * During SSR/prerender the plugin is not loaded, so return a no-op instead of
 * importing `useToast` (vue-toastification's CJS build has no named ESM export).
 */
export function useAppToast(): ToastInterface {
    if (import.meta.server) {
        return noopToast
    }

    return useNuxtApp().$toast
}
