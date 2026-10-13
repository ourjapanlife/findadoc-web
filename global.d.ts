import type { Pinia } from 'pinia'

export {}

declare global {
    interface Window {
        // Declare the type for the Pinia store instance injected by Nuxt into `window` for testing purposes
        $pinia: Pinia
        // Loose on purpose. Product events go through utils/analyticsEvents.ts.
        umami?: {
            track: (eventName: string, data?: Record<string, unknown>) => void
        }
    }
}
