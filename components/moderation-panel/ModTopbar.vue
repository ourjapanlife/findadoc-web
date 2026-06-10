<template>
    <div class="w-full flex flex-col gap-3">
        <div v-if="moderationScreenStore.dashboardScreenIsActive() && !isSettingsView">
            <ModDashboardTopbar />
        </div>
        <div
            v-if="moderationScreenStore.editSubmissionScreenIsActive()"
            class="h-[76px] w-full"
        >
            <ModEditSubmissionTopbar
                data-test-id="mod-edit-submission-topbar"
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const route = useRoute()
const moderationScreenStore = useModerationScreenStore()
const isSettingsView = computed(() => {
    const view = route.query.view
    return typeof view !== 'string' || view === '' || view === 'settings'
})
</script>
