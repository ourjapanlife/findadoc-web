<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilityLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-contact-information"
                :class="{ 'bg-secondary': activeSection === ModEditFacilityLeftBarSectionIDs.ContactInformation,
                          'bg-primary-inverted': activeSection !== ModEditFacilityLeftBarSectionIDs.ContactInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.ContactInformation)"
            >
                {{ $t("modPanelFacilityLeftNavbar.contactInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-addresses"
                :class="{ 'bg-secondary': activeSection === ModEditFacilityLeftBarSectionIDs.Addresses,
                          'bg-primary-inverted': activeSection !== ModEditFacilityLeftBarSectionIDs.Addresses }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.Addresses)"
            >
                {{ $t("modPanelFacilityLeftNavbar.addresses") }}
            </button>
            <button
                data-testid="submission-form-leftnav-google-maps-information"
                :class="{ 'bg-secondary': activeSection === ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation,
                          'bg-primary-inverted': activeSection !== ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation)"
            >
                {{ $t("modPanelFacilityLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-ids"
                :class="{ 'bg-secondary': activeSection === ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds,
                          'bg-primary-inverted': activeSection !== ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds)"
            >
                {{ $t("modPanelFacilityLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="{ 'bg-secondary': activeSection === ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd,
                          'bg-primary-inverted': activeSection !== ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd)"
            >
                {{ $t("modPanelFacilityLeftNavbar.healthcareProfessionalProfessionalToAdd") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="{ 'bg-secondary': activeSection
                              === ModEditFacilityLeftBarSectionIDs.CurrentHealthcareProfessionalsAtFacility,
                          'bg-primary-inverted': activeSection
                              !== ModEditFacilityLeftBarSectionIDs.CurrentHealthcareProfessionalsAtFacility }"
                class="w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.CurrentHealthcareProfessionalsAtFacility)"
            >
                {{ $t("modPanelFacilityLeftNavbar.currentHealthcareProfessionalsAtFacility") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { ModEditFacilityLeftBarSectionIDs } from '~/stores/moderationScreenStore'
import { handleScroll, observeFormSections, scrollToSectionOfForm, type SectionInformation } from '~/utils/handleScroll'

const moderationSubmissionsStore = useModerationSubmissionsStore()
const activeSection: Ref<string> = ref(ModEditFacilityLeftBarSectionIDs.ContactInformation)
const isScrolling: Ref<boolean> = ref(false)

const modLeftNavElementIdArray: SectionInformation[]
    = [{
        sectionTitle: 'contact-information',
        sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.ContactInformation
    },
       {
           sectionTitle: 'addresses',
           sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.Addresses
       },
       {
           sectionTitle: 'google-maps-information',
           sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation
       },
       {
           sectionTitle: 'healthcare-professional-ids',
           sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds
       },
       {
           sectionTitle: 'healthcare-professional-to-add',
           sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd
       },
       {
           sectionTitle: 'current-healthcare-professionals-at-facility',
           sectionElementIdToScrollTo: ModEditFacilityLeftBarSectionIDs.CurrentHealthcareProfessionalsAtFacility
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
