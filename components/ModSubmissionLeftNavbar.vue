<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilitySubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-contactInformation"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSections.ContactInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSections.ContactInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSections.ContactInformation)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.contactInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-addresses"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSections.Addresses,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSections.Addresses }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSections.Addresses)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.addresses") }}
            </button>
            <button
                data-testid="submission-form-leftnav-googleMapsInformation"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSections.GoogleMapsInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSections.GoogleMapsInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSections.GoogleMapsInformation)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcareProfessionalIds"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSections.HealthcareProfessionalIds,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSections.HealthcareProfessionalIds }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSections.HealthcareProfessionalIds)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                data-testid="submission-form-leftnav-changeLog"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSections.ChangeLog,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSections.ChangeLog }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfFacilityForm(ModSubmissionLeftNavbarSections.ChangeLog)"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.changeLog") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'

enum ModSubmissionLeftNavbarSections {
    Addresses = 'ADDRESSES',
    ChangeLog = 'CHANGE_LOG',
    ContactInformation = 'CONTACT_INFORMATION',
    GoogleMapsInformation = 'GOOGLE_MAPS_INFORMATION',
    HealthcareProfessionalIds = 'HEALTHCARE_PROFESSIONAL_IDS'
}

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModSubmissionLeftNavbarSections.ContactInformation)
const isScrolling: Ref<boolean> = ref(false)

const scrollToSectionOfFacilityForm = (sectionId: ModSubmissionLeftNavbarSections) => {
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

                    const threshold = sectionId === ModSubmissionLeftNavbarSections.Addresses ? 0.5 : 1.0

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
        if (sectionId === ModSubmissionLeftNavbarSections.Addresses) {
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

