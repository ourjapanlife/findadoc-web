import { ref, readonly } from 'vue'

export type ColorScheme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'colorScheme'
const LEGACY_KEYS = ['theme', 'isDarkMode']

/*
 * Module-level so every ThemeManager (footer, hamburger menu) shares one source of truth.
 * The <html> class is also set by an inline script in <head> before first paint — see
 * nuxt.config.ts — so this composable only has to keep the two in step after hydration.
 */
const scheme = ref<ColorScheme>('auto')
let initialized = false

function isScheme(value: unknown): value is ColorScheme {
    return value === 'light' || value === 'dark' || value === 'auto'
}

/**
 * Reads the stored preference, migrating anyone who chose a colourway on the old picker.
 *
 * The old picker stored `theme` (one of five colourways) and `isDarkMode`. Only dark mode
 * survives the migration: the colourways are gone, and a stored light choice becomes "auto"
 * because that is the modern default and it is what a light-OS user sees anyway.
 */
function readStoredScheme(): ColorScheme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (isScheme(stored)) {
            return stored
        }

        const legacyDark = localStorage.getItem('isDarkMode') === 'true'
        return legacyDark ? 'dark' : 'auto'
    } catch {
        return 'auto'
    }
}

/** Page ground per scheme, mirroring --theme-color-bg-primary in assets/css/tailwind.css. */
const THEME_COLORS: Record<'light' | 'dark', string> = { light: '#F7FAFB', dark: '#101617' }

/*
 * The static `theme-color` metas key off prefers-color-scheme alone, so an explicit choice that
 * disagrees with the OS left the mobile browser chrome the wrong colour. Once someone has
 * chosen, a single un-media-scoped meta overrides both.
 */
function applyBrowserChrome(next: ColorScheme) {
    const existing = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])')

    if (next === 'auto') {
        existing?.remove()
        return
    }

    const meta = existing ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }))
    meta.content = THEME_COLORS[next]
}

function applyScheme(next: ColorScheme) {
    const root = document.documentElement
    root.classList.remove('theme-light', 'theme-dark')

    if (next !== 'auto') {
        root.classList.add(`theme-${next}`)
    }

    applyBrowserChrome(next)
}

/**
 * Syncs the shared ref with what the <head> script already applied. Call from onMounted,
 * never from setup: reading localStorage during hydration would render a different
 * pressed state from the prerendered HTML and trip a hydration mismatch.
 */
export function initColorScheme() {
    if (!import.meta.client || initialized) return
    initialized = true
    scheme.value = readStoredScheme()
    applyScheme(scheme.value)
}

export function useColorScheme() {
    function setScheme(next: ColorScheme) {
        scheme.value = next

        if (!import.meta.client) {
            return
        }

        applyScheme(next)

        try {
            localStorage.setItem(STORAGE_KEY, next)
            LEGACY_KEYS.forEach(key => localStorage.removeItem(key))
        } catch {
            // Storage can be unavailable (private mode, blocked). The choice still applies for this page.
        }
    }

    return { scheme: readonly(scheme), setScheme }
}
