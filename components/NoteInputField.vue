
<template>
    <div class="flex flex-col items-start">
        <div class="flex justify-start items-center">
            <label
                class="mb-2 mr-2 text-center text-primary-text font-bold font-sans"
                :class="`${textSize}`"
            >
                {{ label }}
            </label>
            <label v-if="!required">{{ t('noteInputField.optional') }}</label>
        </div>
        <textarea
            v-model="model"
            class="mb-5 px-3 py-3.5 w-96 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            :placeholder="placeholder"
        />
    </div>
</template>

<script setup lang="ts">
import type { TextSize } from '~/typedefs/tailwindTypes'
import { useI18n } from '#imports'

const { t } = useI18n()
const model = defineModel<string>()

defineProps<{
    label: string
    placeholder?: string
    required: boolean
    textSize?: TextSize
}>()
</script>
