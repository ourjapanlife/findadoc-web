<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilitySubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-contactInformation"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.ContactInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.ContactInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSectionIDs.ContactInformation)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.contactInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-addresses"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.Addresses,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.Addresses }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSectionIDs.Addresses)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.addresses") }}
            </button>
            <button
                data-testid="submission-form-leftnav-googleMapsInformation"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcareProfessionalIds"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                data-testid="submission-form-leftnav-changeLog"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.ChangeLog,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.ChangeLog }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSectionIDs.ChangeLog)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.changeLog") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { ModSubmissionLeftNavbarSectionIDs } from '~/stores/moderationScreenStore'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModSubmissionLeftNavbarSectionIDs.ContactInformation)
const isScrolling: Ref<boolean> = ref(false)

const scrollToSectionOfFacilityForm = (sectionId: ModSubmissionLeftNavbarSectionIDs) => {
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

                    const threshold = sectionId === ModSubmissionLeftNavbarSectionIDs.Addresses ? 0.5 : 1.0

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
        if (sectionId === ModSubmissionLeftNavbarSectionIDs.Addresses) {
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

