/* Composables are only supposed to be used within a Vue component
https://vuejs.org/guide/reusability/composables.html#composables-are-only-supposed-to-be-used-within-a-vue-component
*/

import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useScreenOrientation = () => {
    // Match nuxt-viewport fallbackBreakpoint: 'desktop' so SSR HTML is landscape.
    const width = ref(import.meta.client ? window.innerWidth : 1024)
    const height = ref(import.meta.client ? window.innerHeight : 768)

    const updateWidth = () => {
        if (!import.meta.client) return
        width.value = window.innerWidth
    }

    const updateHeight = () => {
        if (!import.meta.client) return
        height.value = window.innerHeight
    }

    onMounted(() => {
        updateWidth()
        updateHeight()
        window.addEventListener('resize', updateWidth)
        window.addEventListener('resize', updateHeight)
    })
    onUnmounted(() => {
        if (!import.meta.client) return
        window.removeEventListener('resize', updateWidth)
        window.removeEventListener('resize', updateHeight)
    })

    const isPortrait = computed(() => width.value <= height.value)
    const isLandscape = computed(() => width.value > height.value)

    return { isPortrait, isLandscape }
}
