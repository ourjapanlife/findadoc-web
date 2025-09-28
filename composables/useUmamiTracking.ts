export function useUmami() {
    function track(eventName: string, data?: Record<string, unknown>): void {
        if (typeof window !== 'undefined' && typeof window.umami?.track === 'function') {
            window.umami.track(eventName, data)
        } else {
            console.warn('[umami] tracker not available')
        }
    }

    return { track }
}
