import { ref } from 'vue'

export function useSmoothScroll() {
    const isScrolling = ref(false)

    // Easing function
    const easeInOutCos = (progress: number) =>
        0.5 * (1 - Math.cos(Math.PI * progress))

    const getScrollContainer = (): Element | Window => {
        return document.querySelector('main.overflow-y-auto') ?? window
    }

    const getScrollTop = (container: Element | Window): number => {
        return container instanceof Window ? container.scrollY : container.scrollTop
    }

    const setScrollTop = (container: Element | Window, value: number) => {
        if (container instanceof Window) {
            container.scrollTo(0, value)
        } else {
            container.scrollTop = value
        }
    }

    // Standalone animation frame function
    const animateScrollFrame = (
        currentTime: number,
        start: number,
        end: number,
        duration: number,
        startTime: number,
        container: Element | Window
    ) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeInOutCos(progress)

        setScrollTop(container, start + (end - start) * eased)

        if (progress < 1) {
            requestAnimationFrame(t =>
                animateScrollFrame(t, start, end, duration, startTime, container))
        } else {
            isScrolling.value = false
        }
    }

    // Main scroll function
    const scrollTo = (id: string, duration = 1000, offset = 16) => {
        const target = document.getElementById(id)
        if (!target) return

        const container = getScrollContainer()
        const start = getScrollTop(container)
        const end = target.getBoundingClientRect().top + start - offset
        const startTime = performance.now()

        isScrolling.value = true
        requestAnimationFrame(t =>
            animateScrollFrame(t, start, end, duration, startTime, container))
    }

    return { scrollTo, isScrolling }
}
