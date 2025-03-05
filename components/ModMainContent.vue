<template>
    <div class="h-full overflow-hidden">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModSubmissionListContainer />
        </div>
        <div
            v-if="moderationScreenStore.editSubmissionScreenIsActive()"
            class="h-full overflow-hidden"
        >
            <ModEditSubmissionForm />
        </div>
        <div
            v-if="moderationScreenStore.editFacilityScreenIsActive()"
            class="h-full overflow-hidden"
        >
            <form class="p-4 h-full overflow-y-auto">
                <ModEditFacilitySection />
            </form>
        </div>
        <div
            v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
            class="h-full overflow-hidden"
        >
            <form
                class="p-4 h-full overflow-y-auto"
            >
                <ModEditHealthcareProfessionalSection />
            </form>
        </div>
        <div
            v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()"
            class="h-full overflow-hidden"
        >
            <form
                class="p-4 h-full overflow-y-auto"
            >
                <ModCreateHealthcareProfessionalSection />
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted, watch } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'

const route = useRoute()

const moderationScreenStore = useModerationScreenStore()
const moderationSubmissionsStore = useModerationSubmissionsStore()
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalStore = useHealthcareProfessionalsStore()

const routePathForModerationScreen = computed(() => route.path as string)
const selectedIdFromModSubmissionList = computed(() => route.params.id as string)

const setActiveScreenBasedOnRoute = async () => {
    await nextTick()
    if (routePathForModerationScreen.value.includes('edit-submission') && selectedIdFromModSubmissionList.value) {
        moderationScreenStore.setActiveScreen(ModerationScreen.EditSubmission)
        moderationSubmissionsStore.selectedSubmissionId = selectedIdFromModSubmissionList.value
        return
    }
    if (routePathForModerationScreen.value.includes('edit-facility') && selectedIdFromModSubmissionList.value) {
        moderationScreenStore.setActiveScreen(ModerationScreen.EditFacility)
        facilitiesStore.selectedFacilityId = selectedIdFromModSubmissionList.value
        return
    }
    if (
        routePathForModerationScreen.value.includes('edit-healthcare-professional') && selectedIdFromModSubmissionList.value) {
        moderationScreenStore.setActiveScreen(ModerationScreen.EditHealthcareProfessional)
        healthcareProfessionalStore.selectedHealthcareProfessionalId = selectedIdFromModSubmissionList.value
        return
    }
    if (
        routePathForModerationScreen.value.includes('create-healthcare-professional')) {
        moderationScreenStore.setActiveScreen(ModerationScreen.CreateHealthcareProfessional)
        return
    }

    // This will default the screen based on the route to the dashboard if all the other stuff fails
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    moderationSubmissionsStore.selectedSubmissionId = ''
    facilitiesStore.selectedFacilityId = ''
    healthcareProfessionalStore.selectedHealthcareProfessionalId = ''
}

watch(selectedIdFromModSubmissionList, setActiveScreenBasedOnRoute)
watch(routePathForModerationScreen, setActiveScreenBasedOnRoute)

onMounted(() => {
    setActiveScreenBasedOnRoute()
})
</script>
