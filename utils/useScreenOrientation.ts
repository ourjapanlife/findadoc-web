import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useScreenOrientation = () => {
    const width = ref(window.innerWidth)

    const updateWidth = () => {
        width.value = window.innerWidth
    }

    onMounted(() => {
        window.addEventListener('resize', updateWidth)
    })
    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth)
    })

    const isPortrait = computed(() => width.value <= 768)

    return { isPortrait }
}
