<template>
    <div>
        <select @change="updateSelectedDashboardView" class="font-semibold p-1 border-b border-black mb-2">
            <option value="facilities">
                {{ $t("modDashboardLeftNav.facilities") }}
            </option>
            <option value="healthcareProfessionals">
                {{ $t("modDashboardLeftNav.healthcareProfessionals") }}
            </option>
        </select>
        <div class="flex flex-col">
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGNoteStackAddSvg class="h-4" />
                <button data-testid="mod-dashboard-leftnav-for-review"
                    @click="updateSubmissionListViewState('forReview')"
                    class="flex flex-row items-center text-start p-1">
                    {{ $t("modDashboardLeftNav.forReview") }} ({{ 0 }})
                </button>
            </div>
            <div class="flex w-4/5 justify-start items-center border-b-2 border-slate-200">
                <SVGCheckBoxSvg class="h-5" />
                <button data-testid="mod-dashboard-leftnav-approved" @click=" updateSubmissionListViewState('approved')"
                    class="flex flex-row items-center text-start p-1 ">
                    {{ $t("modDashboardLeftNav.approved") }} ({{ 0 }})
                </button>
            </div>
            <div class="flex flex-row w-4/5 justify-start items-center ">
                <SVGDisabledByDefault class="h-4" />
                <button data-testid="mod-dashboard-leftnav-rejected" @click="updateSubmissionListViewState('rejected')"
                    class="flex flex-row items-center text-start p-1">
                    {{ $t("modDashboardLeftNav.rejected") }} ({{ 0 }})
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
