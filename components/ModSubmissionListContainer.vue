<template>
    <div :style="submissionListItemTableColumns" :class="`grid grid-cols-${submissionListItemHeaders.length} p-2`">
        <div v-for="(submissionListItemHeader, index) in submissionListItemHeaders" :key="index"
            class="font-bold text-left p-1">
            {{ $t(submissionListItemHeader) }}
        </div>

        <div v-for="(fakeDatum, index) in fakeData" :key="index" class="grid grid-cols-subgrid col-span-5 bg-gray-200" >
           <ModSubmissionListItemComponent
           :accessSubmissionForm="accessSubmissionForm"
           :submissionId="fakeDatum.id"
           :submissionNumber="index + 1"
           :submissionName="fakeDatum.Name"
           :submissionStatus="fakeDatum.Status"
           :submissionModifiedDate="fakeDatum.Modified"
           :submissionSubmittedDate="fakeDatum.Submitted"
           />
        </div>

    </div>

</template>



<script setup lang="ts">
import ModSubmissionListItemComponent from './ModSubmissionListItemComponent.vue'
import { ref, Ref, computed } from 'vue'

const submissionListItemHeaders: Ref<String[]> = ref(["#", "Name", "Status", "Modified", "Submitted"]);

const submissionListItemTableColumns = computed(() => {
    const numColumns = submissionListItemHeaders.value.length;
    const defaultColumnWidth = 10;
    const remainingWidth = 100 - defaultColumnWidth;
    const columnWidth = remainingWidth / (numColumns - 1);
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numColumns - 1}, ${columnWidth}%);`;
});

const accessSubmissionForm = (id:String) => {
    // logic on how to pass the data to the submission form that is being edited
}

const fakeData = [
    { "id": "13243214", "Name": "Name 1", "Status": "forReview", "Modified": "Modified 1", "Submitted": "Submitted 1" },
    { "id": "252ewwe", "Name": "Name 2", "Status": "accepted", "Modified": "Modified 2", "Submitted": "Submitted 2" },
    { "id": "3dfdanns", "Name": "Name 3", "Status": "rejected", "Modified": "Modified 3", "Submitted": "Submitted 3" }
];
</script>
