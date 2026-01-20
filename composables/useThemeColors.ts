import { ref, onMounted } from 'vue'

// Global theme trigger - primarily used to trigger re-renders of the map markers
const themeChanged = ref(0)
let observerInitialized = false

/**
 * Composable for accessing theme colors as hex values.
 * Used where CSS variables don't work (e.g., Google Maps markers).
 */
export const useThemeColors = () => {
    onMounted(() => {
        if (observerInitialized || typeof window === 'undefined') return
        observerInitialized = true

        new MutationObserver(() => themeChanged.value++)
            .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    })

    const rgbToHex = (rgb: string): string => {
        const [r = 0, g = 0, b = 0] = rgb.split(' ').map(Number)
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    const getColor = (varName: string, fallback: string): string => {
        if (typeof window === 'undefined') return fallback
        void themeChanged.value // reactive dependency

        const rgb = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
        return rgb ? rgbToHex(rgb) : fallback
    }

    return {
        getPrimaryColor: () => getColor('--theme-color-primary', '#0EB0C0'),
        getSecondaryColor: () => getColor('--theme-color-secondary', '#FB9999'),
        themeChanged
    }
}
