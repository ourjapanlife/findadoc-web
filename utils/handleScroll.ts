import { ref, type Ref } from 'vue'

export interface SectionInformation {
    sectionTitle: string
    sectionElementIdToScrollTo: string
}

export const handleScroll
= (sectionDetailsObject: SectionInformation[], isScrolling: Ref<boolean> = ref(false), activeSection: Ref<string> = ref('')) => {
    if (isScrolling.value) return
    let newActiveSection: string | null = null

    sectionDetailsObject.forEach(section => {
        let rect = null
        const foundSectionById = document.getElementById(section.sectionElementIdToScrollTo)
        if (!foundSectionById) {
            return
        }
        rect = foundSectionById.getBoundingClientRect()

        const sectionId = section.sectionElementIdToScrollTo

        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            newActiveSection = sectionId
        }
    })

    if (newActiveSection) {
        activeSection.value = newActiveSection
    }
}

export const scrollToSectionOfForm
= (sectionId: string, activeSection: Ref<string> = ref('')) => {
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth'
    })
    activeSection.value = sectionId
}

export const observeFormSections = (
    sectionsInfo: SectionInformation[],
    isScrolling: Ref<boolean> = ref(false),
    activeSection: Ref<string> = ref(''),
    thresholdValue: number = 0.70
) => {
    // Map the sectionInfo objects given to DOM elements and filter out any null elements
    const sections: Element[]
    = sectionsInfo.map(info => document.getElementById(info.sectionElementIdToScrollTo)!).filter(element => element !== null)

    const sectionsObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            let currentSection: string | null = null

            //This will go through each entry in order to set the current section to the ID of the intersecting section
            entries.forEach((entry: IntersectionObserverEntry) => {
                //  This returns early if the entry is not intersecting or if the intersection ratio is below the threshold we give as a parameter
                if (!entry.isIntersecting || entry.intersectionRatio < thresholdValue) {
                    return
                }

                const sectionId = entry.target.id

                // This returns early here so it waits until the page stops scrolling from the possible click event
                if (isScrolling.value) {
                    return
                }

                currentSection = sectionId
            })

            //This will update the current section in order to update the active section. This could be used for CSS applications
            if (currentSection) {
                activeSection.value = currentSection
            }
        },

        { threshold: thresholdValue }
    )

    // Observe each section in the sections array found from the SectionInfo param
    sections.forEach(section => {
        sectionsObserver.observe(section)
    })
}
