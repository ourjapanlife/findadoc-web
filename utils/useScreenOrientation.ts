import { ref, onMounted } from 'vue'

export const useScreenOrientation = () => {
    const isPortrait = ref(true)

    const checkViewport = () => {
        isPortrait.value = window.innerWidth <= 768
    }

    onMounted(() => {
        checkViewport()
    })

    return {
        isPortrait
    }
}
