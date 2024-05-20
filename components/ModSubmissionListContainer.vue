<template>
    <div :style="submissionListItemTableColumns" :class="`grid grid-cols-${submissionListItemHeaders.length} p-2`">
        <div v-for="(submissionListItemHeader, index) in submissionListItemHeaders" :key="index"
            class="font-bold text-left p-1">
            {{ $t(submissionListItemHeader) }}
        </div>

        <!-- <div v-for="(fakeDatum, index) in fakeData" :key="index" class="grid grid-cols-subgrid col-span-5 bg-gray-200">
            <span>{{ index + 1 }}</span>
            <span>{{ $t(fakeDatum.Name) }}</span>
            <span>{{ $t(fakeDatum.Status) }}</span>
            <span>{{ $t(fakeDatum.Modified) }}</span>
            <span>{{ $t(fakeDatum.Submitted) }}</span>
        </div> -->

    </div>

</template>



<script setup lang="ts">
import { ref, Ref, computed } from 'vue';

const submissionListItemHeaders: Ref<String[]> = ref(["#", "Name", "Status", "Modified", "Submitted"]);

const submissionListItemTableColumns = computed(() => {
    const numColumns = submissionListItemHeaders.value.length;
    const defaultColumnWidth = 10;
    const remainingWidth = 100 - defaultColumnWidth;
    const columnWidth = remainingWidth / (numColumns - 1);
    return `grid-template-columns: ${defaultColumnWidth}% repeat(${numColumns - 1}, ${columnWidth}%);`;
});

// const fakeData = [
//     { "#": 1, "Name": "Name 1", "Status": "forReview", "Modified": "Modified 1", "Submitted": "Submitted 1" },
//     { "#": 2, "Name": "Name 2", "Status": "accepted", "Modified": "Modified 2", "Submitted": "Submitted 2" },
//     { "#": 3, "Name": "Name 3", "Status": "rejected", "Modified": "Modified 3", "Submitted": "Submitted 3" }
// ];
</script>
