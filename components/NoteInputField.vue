
<template>
    <div class="flex w-full flex-col">
        <label class="field-label">
            {{ label }}
            <span
                v-if="!required"
                class="ml-1 font-normal text-primary-text-muted"
            >
                ({{ t('noteInputField.optional') }})
            </span>
        </label>
        <textarea
            v-model="model"
            class="field field-textarea"
            :placeholder="placeholder"
            :readonly="!isEditing"
            :tabindex="isEditing ? undefined : -1"
        />
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import { useModerationFormEditing } from '~/composables/useModerationFormMode'

const { t } = useI18n()
const isEditing = useModerationFormEditing()
const model = defineModel<string>()

defineProps<{
    label: string
    placeholder?: string
    required: boolean
}>()
</script>
