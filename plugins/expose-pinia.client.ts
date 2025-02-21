import { defineNuxtPlugin } from 'nuxt/app'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    if (process.env.NODE_ENV === 'test' || config.public.NUXT_PUBLIC_LOAD_STORES) {
    // Expose the stores loaded by Nuxt the nuxt app on the window for testing
        window.$pinia = nuxtApp.$pinia as Pinia
    }
})
