<template>
    <div>
        <select v-model="selectedDashboardView" class="font-bold border-b border-black mb-2">
            <option :key="dashboardViewOption.value" :value="dashboardViewOption.value"
                v-for="(dashboardViewOption, index) in modDashboardViewOptions">
                {{ $t(dashboardViewOption.displayText) }}
            </option>
        </select>
        <div class="flex flex-col">
            <button @click="updateSubmissionListViewState(submissionListEntry.value)"
                class="flex flex-row items-center text-start p-1" :key="submissionListEntry.value"
                :class="{ 'border-b border-gray-300': index !== submissionListViewOptions.length - 1 }"
                v-for="(submissionListEntry, index) in submissionListViewOptions ">
                <div class="flex items-center justify-center w-1/5">
                    <component :is="submissionListEntry.svgIcon" class="h-5" />
                </div>
                {{ $t(submissionListEntry.displayText) }} ({{ submissionListEntry.count }})
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import NoteStackAddSvg from "../assets/icons/note-stack-add.svg"
import CheckBoxSvg from "../assets/icons/check-box.svg"
import DisabledByDefault from "../assets/icons/disabled-by-default.svg"

const modDashboardViewOptions = [{
    displayText: "Facilities",
    value: "facilities"
},
{
    displayText: "Healthcare Professionals",
    value: "healthcareProfessionals"
}]

const submissionListViewOptions = [{
    displayText: "For Review",
    value: "forReview",
    svgIcon: NoteStackAddSvg,
    count: 0,
},
{
    displayText: "Approved",
    value: "approved",
    svgIcon: CheckBoxSvg,
    count: 0,
},
{
    displayText: "Rejected",
    value: "rejected",
    svgIcon: DisabledByDefault,
    count: 0,
}]

const selectedSubmissionListView: Ref<String> = ref(submissionListViewOptions[0].value)
const selectedDashboardView: Ref<String> = ref(modDashboardViewOptions[0].value)

const updateSubmissionListViewState = (submissionListViewOptionValue: string) => {
    selectedSubmissionListView.value = submissionListViewOptionValue;
};

</script>
