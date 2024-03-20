<template>
    <div class="flex flex-col place-self-center mb-10">
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

    await store.resetForm();
});
</script>
