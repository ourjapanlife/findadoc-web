<template>
    <!-- styling will change from px to rm -->
    <div class="min-h-16 h-auto w-full">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModDashboardTopbar />
        </div>
    </div>
    <div
        v-if="moderationScreenStore.editSubmissionScreenIsActive()"
        class="h-16 w-full"
    >
        <ModEditSubmissionTopbar
            data-test-id="mod-edit-submission-topbar"
        />
    </div>
    <div
        v-if="moderationScreenStore.editFacilityScreenIsActive()
            || moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
        class="h-16 w-full"
    >
        <ModEditFacilityOrProfessionalTopbar />
    </div>
    <div
        v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()"
        class="h-16 w-full"
    >
        <ModCreateFacilityOrProfessionalTopbar />
    </div>
    <div
        v-if="moderationScreenStore.createFacilityScreenIsActive()"
        class="h-16 w-full"
    >
        <ModCreateFacilityOrProfessionalTopbar />
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const moderationScreenStore = useModerationScreenStore()
</script>
