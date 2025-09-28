import type { Pinia } from 'pinia'

export {}

declare global {
    interface Window {
        // Declare the type for the Pinia store instance injected by Nuxt into `window` for testing purposes
        $pinia: Pinia
        // Declare the type for umami events so we can track clicks
        umami?: {
            track: (eventName: string, data?: Record<string, unknown>) => void
        }
    }
}
