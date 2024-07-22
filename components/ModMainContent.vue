<template>
    <div class="h-full">
        <div v-if="screenStore.activeScreen === ModerationScreen.Dashboard">
            <ModSubmissionListContainer />
        </div>
        <div
            v-else-if="screenStore.activeScreen === ModerationScreen.EditSubmission"
            class="h-full"
        >
            <ModSubmissionsEditFormFacility />
        </div>
        <div
            v-else-if="screenStore.activeScreen === ModerationScreen.EditFacility"
            class="h-full"
        >
            Edit Facility
        </div>
        <div
            v-else-if="screenStore.activeScreen === ModerationScreen.EditHealthcareProfessional"
            class="h-full"
        >
            Edit Healthcare Professional
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted, watch } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModerationSubmissionsListStore } from '~/stores/moderationSubmissionsListStore'

const route = useRoute()

const screenStore = useModerationScreenStore()
const moderationSubmissionsStore = useModerationSubmissionsListStore()

const routePathForModerationScreen = computed(() => route.path as string)
const selectedIdFromModSubmissionList = computed(() => route.params.id as string)

const setActiveScreenBasedOnRoute = async () => {
    await nextTick()
    if (routePathForModerationScreen.value.includes('edit-submission') && selectedIdFromModSubmissionList.value) {
        screenStore.setActiveScreen(ModerationScreen.EditSubmission)
        moderationSubmissionsStore.selectedSubmissionId = selectedIdFromModSubmissionList.value
    } else if (routePathForModerationScreen.value.includes('edit-facility') && selectedIdFromModSubmissionList.value) {
        screenStore.setActiveScreen(ModerationScreen.EditFacility)
        moderationSubmissionsStore.selectedFacilityId = selectedIdFromModSubmissionList.value
    } else if (routePathForModerationScreen.value.includes('edit-healthcare-professional') && selectedIdFromModSubmissionList.value) {
        screenStore.setActiveScreen(ModerationScreen.EditHealthcareProfessional)
        moderationSubmissionsStore.selectedHealthcareProfessionalId = selectedIdFromModSubmissionList.value
    } else {
        screenStore.setActiveScreen(ModerationScreen.Dashboard)
        moderationSubmissionsStore.selectedSubmissionId = ''
        moderationSubmissionsStore.selectedFacilityId = ''
        moderationSubmissionsStore.selectedHealthcareProfessionalId = ''
    }
}

watch(selectedIdFromModSubmissionList, setActiveScreenBasedOnRoute)

onMounted(() => {
    setActiveScreenBasedOnRoute()
})
</script>
