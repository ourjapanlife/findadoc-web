<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelSubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="{
                    'bg-secondary': activeSection === ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalName,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalName,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalName)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalName") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="{
                    'bg-secondary': activeSection
                        === ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalMedicalInfo") }}
            </button>

            <button
                data-testid="submission-form-leftnav-healthcare-professional-related-facilities"
                :class="{
                    'bg-secondary': activeSection
                        === ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalRelatedFacilities,
                    'bg-primary-inverted': activeSection
                        !== ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalRelatedFacilities,
                }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(
                    ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalRelatedFacilities)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalRelatedFacilities") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { ModHealthcareProfessionalsLeftNavbarSectionIDs } from '~/stores/moderationScreenStore'
import { handleScroll, observeFormSections, scrollToSectionOfForm, type SectionInformation } from '~/utils/handleScroll'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalName)
const isScrolling: Ref<boolean> = ref(false)

const modLeftNavElementIdArray: SectionInformation[] = [
    {
        sectionTitle: 'healthcare-professional-medical-info',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo
    },
    {
        sectionTitle: 'healthcare-professional-related-facilities',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalRelatedFacilities
    },
    {
        sectionTitle: 'healthcare-professional-name',
        sectionElementIdToScrollTo: ModHealthcareProfessionalsLeftNavbarSectionIDs.HealthcareProfessionalName
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
