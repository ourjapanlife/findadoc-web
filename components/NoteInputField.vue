<template>
    <div
        class="relative w-fit"
    >
        <div class="flex items-center justify-between w-96">
            <label
                class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal"
            >Moderator Notes</label>
            <div
                class="absolute top-0 right-0 mt-2 mr-2"
            >
                <button
                    v-if="!isEditing"
                    data-testid="note-edit-button"
                    @click="startEditing"
                >
                    <PencilEdit class="w-4" />
                </button>
                <button
                    v-else
                    data-testid="note-save-button"
                    @click="saveNote"
                >
                    <CheckmarkSave class="w-4" />
                </button>
            </div>
        </div>
        <div>
            <div
                v-if="!isEditing"
                class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <span
                    :class="!props.noteInputValue ? 'text-gray-400' : ''"
                >
                    {{ props.noteInputValue || 'No Notes Available' }}
                </span>
            </div>
            <textarea
                v-if="isEditing"
                v-model="editingNote"
                class="mb-5 px-3 py-3.5 w-96 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PencilEdit from '../assets/icons/pencil-edit.svg'
import CheckmarkSave from '../assets/icons/check-mark.svg'

const props = defineProps<{ noteInputValue: string }>()
const emit = defineEmits<{ (e: 'update:noteInputValue', value: string): void }>()

const editingNote = ref(props.noteInputValue)
const isEditing = ref(false)

const startEditing = () => {
    editingNote.value = props.noteInputValue
    isEditing.value = true
}

const saveNote = () => {
    emit('update:noteInputValue', editingNote.value)
    isEditing.value = false
}
</script>
