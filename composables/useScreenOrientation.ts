/* Composables are only supposed to be used within a Vue component
https://vuejs.org/guide/reusability/composables.html#composables-are-only-supposed-to-be-used-within-a-vue-component
*/

import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useScreenOrientation = () => {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    const updateWidth = () => {
        width.value = window.innerWidth
    }

    const updateHeight = () => {
        height.value = window.innerHeight
    }

    onMounted(() => {
        window.addEventListener('resize', updateWidth)
        window.addEventListener('resize', updateHeight)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
        window.removeEventListener('resize', updateHeight)
    })

    const isPortrait = computed(() => width.value <= height.value)

    return { isPortrait }
}
