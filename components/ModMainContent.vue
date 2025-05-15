<template>
    <div class="h-full overflow-y-auto">
        <div v-if="moderationScreenStore.dashboardScreenIsActive()">
            <ModSubmissionListContainer />
        </div>
        <div
            v-if="moderationScreenStore.editSubmissionScreenIsActive()"
            class="h-full overflow-y-auto"
        >
            <ModEditSubmissionForm />
        </div>
        <div
            v-if="moderationScreenStore.editFacilityScreenIsActive()"
            class="h-full overflow-y-auto"
        >
            <form class="p-4 h-full overflow-y-auto">
                <ModEditFacilitySection />
            </form>
        </div>
        <div
            v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
            class="h-full overflow-y-auto"
        >
            <form
                class="p-4 h-full overflow-y-auto"
            >
                <ModEditHealthcareProfessionalSection />
            </form>
        </div>
        <div
            v-if="moderationScreenStore.createHealthcareProfessionalScreenIsActive()"
            class="h-full overflow-y-auto"
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
    // grab the relevant part of the path
    const pathSnippet = routePathForModerationScreen.value.split('/')[2]

    // for routes that require a selected ID, check before entering the switch
    const editRoutes = ['edit-submission', 'edit-facility', 'edit-healthcare-professional']
    if (editRoutes.includes(pathSnippet) && !selectedIdFromModSubmissionList.value) {
        moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
        moderationSubmissionsStore.selectedSubmissionId = ''
        facilitiesStore.selectedFacilityId = ''
        healthcareProfessionalStore.selectedHealthcareProfessionalId = ''
        return
    }

    switch (pathSnippet) {
        case 'edit-submission':
            moderationScreenStore.setActiveScreen(ModerationScreen.EditSubmission)
            moderationSubmissionsStore.selectedSubmissionId = selectedIdFromModSubmissionList.value
            break
        case 'edit-facility':
            moderationScreenStore.setActiveScreen(ModerationScreen.EditFacility)
            facilitiesStore.selectedFacilityId = selectedIdFromModSubmissionList.value
            break
        case 'edit-healthcare-professional':
            moderationScreenStore.setActiveScreen(ModerationScreen.EditHealthcareProfessional)
            healthcareProfessionalStore.selectedHealthcareProfessionalId = selectedIdFromModSubmissionList.value
            break
        case 'create-healthcare-professional':
            moderationScreenStore.setActiveScreen(ModerationScreen.CreateHealthcareProfessional)
            break
        default:
            moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
            moderationSubmissionsStore.selectedSubmissionId = ''
            facilitiesStore.selectedFacilityId = ''
            healthcareProfessionalStore.selectedHealthcareProfessionalId = ''
    }
}

watch(selectedIdFromModSubmissionList, setActiveScreenBasedOnRoute)
watch(routePathForModerationScreen, setActiveScreenBasedOnRoute)

onMounted(() => {
    setActiveScreenBasedOnRoute()
})
</script>
