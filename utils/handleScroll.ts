import { type Ref, nextTick } from 'vue'

export interface SectionInformation {
    sectionTitle: string
    sectionElementIdToScrollTo: string
}

let lastSetTimeout: number

export const scrollToSectionOfForm = (
    sectionId: string,
    activeSection: Ref<string>
) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
}

export const observeFormSections = async (
    sectionsInfo: SectionInformation[],
    isScrolling: Ref<boolean>,
    activeSection: Ref<string>
) => {
    await nextTick()

    setTimeout(() => {
        sectionsInfo.forEach(info => {
            const sectionElement = document.getElementById(info.sectionElementIdToScrollTo)
            if (!sectionElement) return

            const sectionHeight = sectionElement.getBoundingClientRect().height
            const viewportHeight = window.innerHeight

            // Threshold: lower for short sections, higher for taller ones
            const threshold = Math.min(0.6, sectionHeight < 300
                ? 0.1
                : sectionHeight / viewportHeight)

            // Less aggressive margin to allow first and last sections to trigger
            const rootMargin = '0px 0px -30% 0px'

            const observer = new IntersectionObserver(
                entries => {
                    const visibleEntries = entries
                        .filter(entry => entry.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                    if (!visibleEntries.length || isScrolling.value) return

                    const mostVisible = visibleEntries[0]

                    // Debounced update to avoid flickering
                    clearTimeout(lastSetTimeout)
                    lastSetTimeout = window.setTimeout(() => {
                        activeSection.value = mostVisible.target.id
                    }, 50)
                },
                {
                    threshold,
                    rootMargin
                }
            )
            observer.observe(sectionElement)
        })
    }, 200)
}
