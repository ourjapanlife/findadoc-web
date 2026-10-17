<template>
    <button
        v-if="available"
        type="button"
        class="btn btn-secondary btn-sm shrink-0"
        data-testid="mod-form-mode-toggle"
        @click="toggle"
    >
        {{ buttonLabel }}
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import { useModerationFormEditingSource } from '~/composables/useModerationFormMode'

const { t } = useI18n()
const editing = useModerationFormEditingSource()
const available = computed(() => editing !== null)
const buttonLabel = computed(() =>
    editing?.value ? t('modForm.preview') : t('modForm.edit'))

function toggle() {
    if (!editing) return
    editing.value = !editing.value
}
</script>
