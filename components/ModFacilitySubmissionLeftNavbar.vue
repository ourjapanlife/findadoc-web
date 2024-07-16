<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilitySubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                :class="{ 'bg-lightBlue': activeSection === 'contact-information',
                          'bg-transparent': activeSection !== 'contact-information' }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('contact-information')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.contactInformation") }}
            </button>
            <button
                :class="{ 'bg-lightBlue': activeSection === 'addresses', 'bg-transparent': activeSection !== 'addresses' }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('addresses')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.addresses") }}
            </button>
            <button
                :class="{ 'bg-lightBlue': activeSection === 'google-maps-information',
                          'bg-transparent': activeSection !== 'google-maps-information' }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('google-maps-information')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                :class="{ 'bg-lightBlue': activeSection === 'healthcare-professional-ids',
                          'bg-transparent': activeSection !== 'healthcare-professional-ids' }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('healthcare-professional-ids')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                :class="{ 'bg-lightBlue': activeSection === 'change-log', 'bg-transparent': activeSection !== 'change-log' }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('change-log')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.changeLog") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref('contact-information')
const isScrolling: Ref<boolean> = ref(false)

const scrollToSectionOfFacilityForm = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth'
    })
    activeSection.value = sectionId

    isScrolling.value = true

    setTimeout(() => {
        isScrolling.value = false
    }, 1000)
}

const observeFormSections = () => {
    const sections: NodeListOf<Element> = document.querySelectorAll('.facility-form-section')

    const addressObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            let currentSection: string | null = null

            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const sectionId = entry.target.id

                    const threshold = sectionId === 'addresses' ? 0.5 : 1.0

                    if (entry.intersectionRatio >= threshold && !isScrolling.value) {
                        currentSection = sectionId
                    }
                }
            })

            if (currentSection) {
                activeSection.value = currentSection
            }
        },
        { threshold: [0.5, 1.0] }
    )

    const otherSectionsObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            let currentSection: string | null = null

            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
                    const sectionId = entry.target.id
                    if (!isScrolling.value) {
                        currentSection = sectionId
                    }
                }
            })

            if (currentSection) {
                activeSection.value = currentSection
            }
        },
        { threshold: 1.0 }
    )

    sections.forEach(section => {
        const sectionId = section.id
        if (sectionId === 'addresses') {
            addressObserver.observe(section)
        } else {
            otherSectionsObserver.observe(section)
        }
    })
}

const handleScroll = () => {
    if (isScrolling.value) return

    const sections: NodeListOf<Element> = document.querySelectorAll('.facility-form-section')
    let newActiveSection: string | null = null

    sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const sectionId = section.id

        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            newActiveSection = sectionId
        }
    })

    if (newActiveSection) {
        activeSection.value = newActiveSection
    }
}

onMounted(() => {
    observeFormSections()
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

