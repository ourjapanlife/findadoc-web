<template>
  <button @click="handleClickToSubmissionForm" class="grid grid-cols-subgrid col-span-5 bg-gray-200">
            <span class="text-start">{{ submissionNumber }}</span>
            <span class="text-start">{{ $t(submissionName) }}</span>
            <span class="text-start">{{ $t(submissionStatus) }}</span>
            <span class="text-start">{{ $t(submissionModifiedDate) }}</span>
            <span class="text-start">{{ $t(submissionSubmittedDate) }}</span>
  </button> 
</template>

<script setup lang="ts">
import { PropType, defineProps } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore';

const props = defineProps({
    submissionId: {
        type: String,
        required: true
    },
    submissionNumber: {
        type: Number,
        required: true,
    },
    submissionName: {
        type: String,
        required: true,
    },
    submissionStatus: {
        type: String,
        required: true,
    },
    submissionModifiedDate: {
        type: [String, null] as PropType<string | null>,
        required: false,
    },
    submissionSubmittedDate: {
        type: String,
        required: true,
    },
    accessSubmissionForm: {
        type: Function as PropType<(id: String) => void>,
        required: true, 
    },
});

const handleClickToSubmissionForm = () => {
    useModerationScreenStore().setActiveScreen(1)
    props.accessSubmissionForm(props.submissionId)
};

</script>