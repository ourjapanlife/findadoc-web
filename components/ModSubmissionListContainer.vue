<template>
    <div :style="submissionListItemTableColumns" :class="`grid grid-cols-5 p-2`">
        <div class="font-bold text-left p-1">
            #
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.name") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.status") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.modified") }}
        </div>
        <div class="font-bold text-left p-1">
            {{ $t("modPanelSubmissionList.submitted") }}
        </div>

        <div v-for="(fakeDatum, index) in modScreenStore.fakeData" :key="index" class="grid grid-cols-subgrid col-span-5 bg-gray-200" >
            <button @click="handleClickToSubmissionForm(fakeDatum.id)"
            :data-testid='`mod-submission-list-item-${index + 1}`'
            class="grid grid-cols-subgrid col-span-5 bg-gray-200">
                <span class="text-start">{{ index + 1 }}</span>
                <span class="text-start">{{ $t(fakeDatum.name) }}</span>
                <span class="text-start">{{ $t(fakeDatum.status) }}</span>
                <span class="text-start">{{ $t(fakeDatum.modified) }}</span>
                <span class="text-start">{{ $t(fakeDatum.submitted) }}</span>
            </button>
        </div>
    </div>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { useModerationScreenStore } from '~/stores/moderationScreenStore';

const modScreenStore = useModerationScreenStore()

const submissionListItemTableColumns = computed(() => {
    const numOfColumns = 5;
    const defaultColumnWidth = 10;
    const remainingWidth = 100 - defaultColumnWidth;
    const columnWidth = remainingWidth / (numOfColumns - 1);
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numOfColumns - 1}, ${columnWidth}%);`;
});

const handleClickToSubmissionForm = (id: string) => {
    console.log("WE CLICKED THE THING!!")
    useModerationScreenStore().setActiveScreen(1)
    modScreenStore.selectedSubmissionId = id
};


</script>
