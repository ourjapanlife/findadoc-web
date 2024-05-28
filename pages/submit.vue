<template>
    <div class="flex flex-col h-full w-full place-self-center overflow-y-auto pb-8">
        <SubmissionForm v-show="!store.submissionCompleted" />
        <SubmissionCompleted v-show="store.submissionCompleted" />
    </div>
</template>

<script lang="ts" setup>
import { useSubmissionStore } from "~/stores/submissionStore";
import { nextTick, onMounted } from "vue";

const store = useSubmissionStore();

onMounted(async () => {
    await nextTick();

    store.resetForm();
});
</script>
