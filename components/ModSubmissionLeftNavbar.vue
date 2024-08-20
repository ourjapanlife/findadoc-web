<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelSubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-contact-information"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.ContactInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.ContactInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.ContactInformation)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.contactInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-addresses"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.Addresses,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.Addresses }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.Addresses)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.addresses") }}
            </button>
            <button
                data-testid="submission-form-leftnav-google-maps-information"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-ids"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                data-testid="submission-form-leftnav-change-log"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.ChangeLog,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.ChangeLog }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.ChangeLog)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.changeLog") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName,
                          'bg-primary-inverted': activeSection !== ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalName") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="{ 'bg-secondary': activeSection === ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo,
                          'bg-primary-inverted': activeSection
                              !== ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="scrollToSectionOfForm(ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo)"
            >
                {{ $t("modPanelSubmissionLeftNavbar.healthcareProfessionalMedicalInfo") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { ModSubmissionLeftNavbarSectionIDs } from '~/stores/moderationScreenStore'
import { handleScroll, observeFormSections, scrollToSectionOfForm, type SectionInformation } from '~/utils/handleScroll'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModSubmissionLeftNavbarSectionIDs.ContactInformation)
const isScrolling: Ref<boolean> = ref(false)

const modLeftNavElementIdArray: SectionInformation[]
    = [{
        sectionTitle: 'addresses',
        sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.Addresses
    },
       {
           sectionTitle: 'google-maps-information',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation
       },
       {
           sectionTitle: 'healthcare-professional-ids',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalIds
       },
       {
           sectionTitle: 'contact-information',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.ContactInformation
       },
       {
           sectionTitle: 'change-log',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.ChangeLog
       },
       {
           sectionTitle: 'healthcare-professional-name',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName
       },
       {
           sectionTitle: 'healthcare-professional-medical-info',
           sectionElementIdToScrollTo: ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo
       }]

onMounted(() => {
    observeFormSections(modLeftNavElementIdArray, isScrolling, activeSection)
    window.addEventListener('scroll', () => handleScroll(modLeftNavElementIdArray, isScrolling, activeSection))
})

onUnmounted(() => {
    window.removeEventListener('scroll', () => handleScroll(modLeftNavElementIdArray, isScrolling, activeSection))
})
</script>

