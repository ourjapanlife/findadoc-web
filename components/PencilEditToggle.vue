<template>
    <div class="flex items-center gap-2">
        <template v-if="isEditing">
            <input
                v-model="localValue"
                class="border px-2 py-1 rounded"
                :placeholder="placeholder"
                :disabled="disabled"
            >
            <button
                class="text-green-600 hover:underline"
                @click="onSave"
            >
                ✓
            </button>
            <button
                class="text-red-600 hover:underline"
                @click="onCancel"
            >
                ✕
            </button>
        </template>

        <template v-else>
            <span>{{ modelValue || placeholder || '—' }}</span>
            <button
                class="text-blue-600 hover:underline"
                :disabled="disabled"
                @click="isEditing = true"
            >
                ✏️
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'save' | 'cancel'): void
}>()

const isEditing = ref(false)
const localValue = ref('')

watch(() => isEditing.value, editing => {
    if (editing) {
        localValue.value = props.modelValue
    }
})

function onSave() {
    emit('update:modelValue', localValue.value)
    emit('save')
    isEditing.value = false
}

function onCancel() {
    emit('cancel')
    isEditing.value = false
}
</script>
