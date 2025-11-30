import { ref } from 'vue'

export function useSmoothScroll() {
    const isScrolling = ref(false)

    // Easing function
    const easeInOutCos = (progress: number) =>
        0.5 * (1 - Math.cos(Math.PI * progress))

    // Standalone animation frame function
    const animateScrollFrame = (
        currentTime: number,
        start: number,
        end: number,
        duration: number,
        startTime: number
    ) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeInOutCos(progress)

        window.scrollTo(0, start + (end - start) * eased)

        if (progress < 1) {
            requestAnimationFrame(t =>
                animateScrollFrame(t, start, end, duration, startTime))
        } else {
            isScrolling.value = false
        }
    }

    // Main scroll function
    const scrollTo = (id: string, duration = 1000) => {
        const target = document.getElementById(id)
        if (!target) return

        const start = window.scrollY
        const end = target.getBoundingClientRect().top + window.scrollY
        const startTime = performance.now()

        isScrolling.value = true
        requestAnimationFrame(t =>
            animateScrollFrame(t, start, end, duration, startTime))
    }

    return { scrollTo, isScrolling }
}
