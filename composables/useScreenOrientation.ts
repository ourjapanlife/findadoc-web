/* Composables are only supposed to be used within a Vue component
https://vuejs.org/guide/reusability/composables.html#composables-are-only-supposed-to-be-used-within-a-vue-component
*/

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SSR_VIEWPORT_SIZE } from '~/utils/viewport'

export const useScreenOrientation = () => {
    const width = ref<number>(SSR_VIEWPORT_SIZE.width)
    const height = ref<number>(SSR_VIEWPORT_SIZE.height)

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
