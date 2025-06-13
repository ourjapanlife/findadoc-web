<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilityLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                data-testid="submission-form-leftnav-contact-information"
                :class="isContactInfoSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.ContactInformation)"
            >
                {{ $t("modPanelFacilityLeftNavbar.contactInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-addresses"
                :class="isAddressInfoSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.Addresses)"
            >
                {{ $t("modPanelFacilityLeftNavbar.addresses") }}
            </button>
            <button
                data-testid="submission-form-leftnav-google-maps-information"
                :class="isGoogleMapsInfoSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation)"
            >
                {{ $t("modPanelFacilityLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-ids"
                :class="isHealthcareProfessionalsIdSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds)"
            >
                {{ $t("modPanelFacilityLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-name"
                :class="isHealthcareProfessionalsToAddSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
                @click="handleNavClick(ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd)"
            >
                {{ $t("modPanelFacilityLeftNavbar.healthcareProfessionalProfessionalToAdd") }}
            </button>
            <button
                data-testid="submission-form-leftnav-healthcare-professional-medical-info"
                :class="isCurrentHealthcareProfessionalsInfoSelected() ?'selected-info': 'unselected-info'"
                class="btn-leftnav"
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

function isContactInfoSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.ContactInformation
}

function isAddressInfoSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.Addresses
}

function isGoogleMapsInfoSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.GoogleMapsInformation
}

function isHealthcareProfessionalsIdSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalIds
}

function isHealthcareProfessionalsToAddSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.HealthcareProfessionalToAdd
}

function isCurrentHealthcareProfessionalsInfoSelected() {
    return activeSection.value === ModEditFacilityLeftBarSectionIDs.CurrentHealthcareProfessionalsAtFacility
}
</script>

<style lang="postcss">
    .btn-leftnav {
        @apply w-full py-4 my-2 text-sm text-start pl-2 rounded border-b-2 border-tertiary-bg;
    }

    .selected-info {
  @apply bg-secondary;
}

    .unselected-info {
        @apply bg-primary-inverted;
}
</style>
