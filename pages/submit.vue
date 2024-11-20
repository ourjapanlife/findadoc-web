<template>
    <div class="flex flex-col h-full w-full place-self-center overflow-y-auto pb-8">
        <SubmissionForm v-if="!submissionStore.submissionCompleted" />
        <SubmissionCompleted v-if="submissionStore.submissionCompleted" />
    </div>
</template>

<script lang="ts" setup>
import { useSubmissionStore } from '~/stores/submissionStore'

const submissionStore = useSubmissionStore()
</script>
