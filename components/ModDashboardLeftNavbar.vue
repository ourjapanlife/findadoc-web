<template>
    <div>
        <select @change="updateSelectedDashboardView" class="font-bold text-lg p-1 border-b border-black mb-2 w-full">
            <option value="facilities" class="p-3">
                {{ $t("modDashboardLeftNav.facilities") }}
            </option>
            <option value="healthcareProfessionals">
                {{ $t("modDashboardLeftNav.healthcareProfessionals") }}
            </option>
        </select>
        <div class="flex flex-col">
            <div class="flex w-full justify-start items-center border-b-2 border-slate-200 px-5 py-3">
                <SVGNoteStackAddSvg class="h-4 mr-3" />
                <button data-testid="mod-dashboard-leftnav-for-review"
                    @click="updateSubmissionListViewState('forReview')"
                    class="flex flex-row items-center text-start p-1">
                    {{ $t("modDashboardLeftNav.forReview") }} ({{ ModScreenStore.forReviewCount }})
                </button>
            </div>
            <div class="flex w-full justify-start items-center border-b-2 border-slate-200 px-5 py-3">
                <SVGCheckBoxSvg class="h-5 mr-3" />
                <button data-testid="mod-dashboard-leftnav-approved" @click=" updateSubmissionListViewState('approved')"
                    class="flex flex-row items-center text-start p-1 ">
                    {{ $t("modDashboardLeftNav.approved") }} ({{ ModScreenStore.acceptedCount }})
                </button>
            </div>
            <div class="flex flex-row w-full justify-start items-center px-5 py-3">
                <SVGDisabledByDefault class="h-4 mr-3" />
                <button data-testid="mod-dashboard-leftnav-rejected" @click="updateSubmissionListViewState('rejected')"
                    class="flex flex-row items-center text-start p-1">
                    {{ $t("modDashboardLeftNav.rejected") }} ({{ ModScreenStore.rejectedCount }})
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import SVGNoteStackAddSvg from "../assets/icons/note-stack-add.svg"
import SVGCheckBoxSvg from "../assets/icons/check-box.svg"
import SVGDisabledByDefault from "../assets/icons/disabled-by-default.svg"
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const ModScreenStore = useModerationScreenStore();
ModScreenStore.updateCounts();


const selectedSubmissionListView: Ref<string> = ref("forReview")
const selectedDashboardView: Ref<string> = ref("facilities")

const updateSubmissionListViewState = (submissionListViewOptionValue: string) => {
    selectedSubmissionListView.value = submissionListViewOptionValue
}

const updateSelectedDashboardView = (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value
    selectedDashboardView.value = selectedValue
}
</script>
