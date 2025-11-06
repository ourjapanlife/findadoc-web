<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || t("modPanelSubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="{
                    'bg-secondary': activeSection === ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-accent-bg"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName)"
            >
                {{ t("modPanelSubmissionLeftNavbar.healthcareProfessionalName") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="{
                    'bg-secondary': activeSection
                        === ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-accent-bg"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo)"
            >
                {{ t("modPanelSubmissionLeftNavbar.healthcareProfessionalMedicalInfo") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-facilities"
                :class="{
                    'bg-secondary': activeSection
                        === ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-accent-bg"
                @click="handleNavClick(
                    ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities)"
            >
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
    window.removeEventListener('scroll', onScroll)
})
</script>
