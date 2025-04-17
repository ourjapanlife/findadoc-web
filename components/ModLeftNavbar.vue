<template>
    <div class="w-64 p-4 border-r border-slate-300">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModDashboardLeftNavbar />
        </div>
        <div v-if="moderationScreenStore.editSubmissionScreenIsActive()">
            <ModSubmissionLeftNavbar />
        </div>
        <div v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()">
            <p class="text-xl font-bold">
                <ModHealthcareProfessionalLeftNavbar />
            </p>
        </div>
        <div v-if="moderationScreenStore.editFacilityScreenIsActive()">
            <p class="text-xl font-bold">
                NAVBAR REVIEW FACILITY PLACEHOLDER
            </p>
        </div>
        <div v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()">
            <p class="text-xl font-bold">
                NAVBAR CREATE FACILITY PLACEHOLDER
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const moderationScreenStore = useModerationScreenStore()
</script>
