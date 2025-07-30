<template>
    <div class="flex items-center gap-2">
        <template v-if="localIsEditing">
            <input
                v-model="localValue"
                class="border px-2 py-1 rounded"
                :placeholder="placeholder"
                :disabled="disabled"
            >
            <button
                class="text-primary-600 hover:text-primary-700 w-5 h-5 flex items-center justify-center"
                aria-label="Save"
                @click="onSave"
            >
                <SVGSaveIcon class="w-full h-full" />
            </button>
            <button
                class="text-red-600 hover:text-red-700 w-5 h-5 flex items-center justify-center"
                aria-label="Cancel"
                @click="onCancel"
            >
                <SVGDeleteIcon class="w-full h-full" />
            </button>
        </template>

        <template v-if="!localIsEditing">
            <span>{{ modelValue || placeholder || '—' }}</span>
            <button
                class="text-primary-600 hover:text-primary-700 w-5 h-5 flex items-center justify-center"
                :disabled="disabled"
                aria-label="Edit"
                @click="startEditing"
            >
                <SVGEditIcon class="w-full h-full" />
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import SVGSaveIcon from '@/assets/icons/check-edit-toggle.svg'
import SVGDeleteIcon from '@/assets/icons/cross-edit-toggle.svg'
import SVGEditIcon from '@/assets/icons/pencil-edit-toggle.svg'

const props = defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
    isEditing: boolean // prop for v-model
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'save' | 'cancel'): void
    (e: 'update:isEditing', value: boolean): void
}>()

const localValue = ref('')

const localIsEditing = computed({
    get: () => props.isEditing,
    set: (value: boolean) => emit('update:isEditing', value)
})

watch(() => props.modelValue, newValue => {
    if (!localIsEditing.value) {
        localValue.value = newValue
    }
}, { immediate: true })

watch(() => localIsEditing.value, editing => {
    if (editing) {
        localValue.value = props.modelValue
    }
})

function startEditing() {
    localIsEditing.value = true
}

function onSave() {
    emit('update:modelValue', localValue.value)
    emit('save')
    localIsEditing.value = false
}

function onCancel() {
    emit('cancel')
    localIsEditing.value = false
}
</script>
