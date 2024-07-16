<template>
    <div class="flex flex-col">
        <h1 class="font-bold text-lg p-1 mb-2 text-ellipsis">
            {{ moderationSubmissionsStore.selectedSubmissionData?.facility?.nameEn
                || $t("modPanelFacilitySubmissionLeftNavbar.facilityNameUnknown") }}
        </h1>
        <div class="flex flex-col items-start">
            <button
                class="w-full pb-4 my-4 text-sm text-start pl-1 border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('contact-information')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.contactInformation") }}
            </button>
            <button
                class="w-full pb-4 my-4 text-sm text-start pl-1 border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('addresses')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.addresses") }}
            </button>
            <button
                class="w-full pb-4 my-4 text-sm text-start pl-1 border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('google-maps-information')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.googleMapsInformation") }}
            </button>
            <button
                class="w-full pb-4 my-4 text-sm text-start pl-1 border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('healthcare-professional-ids')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.healthcareProfessionalIds") }}
            </button>
            <button
                class="w-full pb-4 my-4 text-sm text-start pl-1 border-b-2 border-slate-200"
                @click="scrollToSectionOfFacilityForm('change-log')"
            >
                {{ $t("modPanelFacilitySubmissionLeftNavbar.changeLog") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'

const moderationSubmissionsStore = useModerationSubmissionsStore()

const scrollToSectionOfFacilityForm = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth'
    })
}
</script>
