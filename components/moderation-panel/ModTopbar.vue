<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModDashboardTopbar />
        </div>
        <div
            v-if="moderationScreenStore.editSubmissionScreenIsActive()"
            class="h-[76px] w-full"
        >
            <ModEditSubmissionTopbar
                data-test-id="mod-edit-submission-topbar"
                :selected-id="modSubmissionsListStore.selectedSubmissionId"
            />
        </div>
        <div
            v-if="moderationScreenStore.editFacilityScreenIsActive()
                || moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
            class="h-[76px] w-full"
        >
            <ModEditFacilityOrProfessionalTopbar />
        </div>
        <div
            v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()"
            class="h-[76px] w-full"
        >
            <ModCreateFacilityOrProfessionalTopbar />
        </div>
        <div
            v-if="moderationScreenStore.createFacilityScreenIsActive()"
            class="h-[76px] w-full"
        >
            <ModCreateFacilityOrProfessionalTopbar />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const moderationScreenStore = useModerationScreenStore()
const modSubmissionsListStore = useModerationSubmissionsStore()
</script>
