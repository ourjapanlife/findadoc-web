<template>
    <div class="flex flex-col h-full w-full place-self-center overflow-y-auto pb-8">
        <SubmissionForm v-show="!store.submissionCompleted" />
        <SubmissionCompleted v-show="store.submissionCompleted" />
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted } from 'vue'
import { useSubmissionStore } from '~/stores/submissionStore'

const store = useSubmissionStore()

onMounted(async () => {
    await nextTick()

    store.resetForm()
})
</script>
