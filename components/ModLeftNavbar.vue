<template>
    <div class="w-64 p-4 border-r border-slate-300">
        <div v-if="store.activeScreen === ModerationScreen.Dashboard ">
            <ModDashboardLeftNavbar />
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.EditSubmission">
            <ModSubmissionLeftNavbar />
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.EditHealthcareProfessional">
            <p class="text-xl font-bold">
                <ModHealthcareProfessionalLeftNavbar />
            </p>
        </div>
        <div v-else-if="store.activeScreen === ModerationScreen.EditFacility">
            <p class="text-xl font-bold">
                NAVBAR REVIEW FACILITY
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const store = useModerationScreenStore()
</script>
