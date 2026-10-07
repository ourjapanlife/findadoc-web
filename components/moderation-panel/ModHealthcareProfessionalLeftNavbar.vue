<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || t("modPanelSubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex w-full flex-col items-start gap-1">
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="navButtonClass(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName)"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName)"
            >
                <span
                    class="h-4 w-1 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                />
                {{ t("modPanelSubmissionLeftNavbar.healthcareProfessionalName") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="navButtonClass(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo)"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo)"
            >
                <span
                    class="h-4 w-1 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                />
                {{ t("modPanelSubmissionLeftNavbar.healthcareProfessionalMedicalInfo") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-facilities"
                :class="navButtonClass(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities)"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-semibold"
                @click="handleNavClick(
                    ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities)"
            >
                <span
                    class="h-4 w-1 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                />
                {{ t("modPanelSubmissionLeftNavbar.healthcareProfessionalFacilities") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { ModHealthcareProfessionalsLeftNavbarSections } from '~/stores/moderationScreenStore'
import { handleScroll, observeFormSections, scrollToSectionOfForm, type SectionInformation } from '~/composables/handleScroll'

const { t } = useI18n()

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName)
const isScrolling: Ref<boolean> = ref(false)

const modLeftNavElementIdArray: SectionInformation[] = [
    {
        sectionTitle: 'healthcare-professional-medical-info',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo
    },
    {
        sectionTitle: 'healthcare-professional-related-facilities',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities
    },
    {
        sectionTitle: 'healthcare-professional-name',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName
    }
]

const navButtonClass = (sectionId: string) =>
    activeSection.value === sectionId
        ? 'bg-accent/15 text-primary-text'
        : 'text-primary-text-muted hover:bg-secondary-bg'

const onScroll = () => {
    handleScroll(modLeftNavElementIdArray, isScrolling, activeSection)
}

const handleNavClick = (sectionId: string) => {
    scrollToSectionOfForm(sectionId)
    activeSection.value = sectionId
}

onMounted(() => {
    observeFormSections(modLeftNavElementIdArray, isScrolling, activeSection)
    window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('scroll', onScroll)
})
</script>
