
<template>
    <div class="flex flex-col items-start">
        <label class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ t('modNoteInputField.label') }}
        </label>
        <textarea
            v-model="model"
            class="mb-5 px-3 py-3.5 w-96 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
        />
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()
const model = defineModel<string>()
</script>
