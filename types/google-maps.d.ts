/**
 * The Maps JS SDK calls this global when it rejects the API key — a bad key, or a referrer the
 * key does not allow. It is the only hook the SDK offers; everything else it does on failure is
 * log to the console and leave an empty container.
 */
declare global {
    interface Window {
        gm_authFailure?: () => void
    }
}

export {}
