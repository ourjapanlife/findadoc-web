<template>
    <div class="w-64 p-4 border-r border-slate-300">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModDashboardLeftNavbar />
        </div>
        <div v-if="moderationScreenStore.editSubmissionScreenIsActive()">
            <ModSubmissionLeftNavbar />
        </div>
        <div v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()">
            <ModHealthcareProfessionalLeftNavbar />
        </div>
        <div v-if="moderationScreenStore.editFacilityScreenIsActive()">
            <ModEditFacilityLeftNavBar />
        </div>
        <div v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()">
            <p class="text-xl font-bold">
                NAVBAR CREATE HEALTHCARE PROFESSIONAL PLACEHOLDER
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const moderationScreenStore = useModerationScreenStore()
</script>
