import type { Pinia } from 'pinia'

export {}

declare global {
    interface Window {
        $pinia: Pinia
    }
}
