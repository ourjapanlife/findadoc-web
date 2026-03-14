<template>
    <div
        v-if="isOpen"
        data-testid="confirmation-modal"
        class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-50 bg-secondary bg-opacity-40"
    >
        <div
            ref="modal"
            v-close-on-outside-click="{
                onOutside: cancelAction,
                when: () => isOpen,
            }"
            class="absolute z-50 bg-primary-bg rounded-xl overflow-hidden shadow-lg shadow-primary
      hover:shadow-inner hover:shadow-primary/90 w-[92vw] max-w-md"
            role="dialog"
            aria-modal="true"
            :aria-label="title || 'Confirmation'"
        >
            <!-- Header -->
            <div class="relative px-6 pt-6 pb-4 border-b border-primary/10">
                <button
                    type="button"
                    class="absolute right-6 top-5 bg-primary-inverted
          rounded-lg px-2 py-1 group hover:bg-primary-hover transition-all duration-200"
                    :aria-label="t('common.close', 'Close')"
                    @click="cancelAction"
                >
                    <svg
                        class="stroke-primary group-hover:stroke-primary-inverted"
                        width="20"
                        height="20"
                        viewBox="4 0 15 25"
                    >
                        <path
                            stroke-width="3"
                            fill="none"
                            d="M6.25,6.25,17.75,17.75"
                        />
                        <path
                            stroke-width="3"
                            fill="none"
                            d="M6.25,17.75,17.75,6.25"
                        />
                    </svg>
                </button>

                <h2 class="text-lg font-semibold text-primary">
                    {{ title }}
                </h2>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 text-primary">
                <p class="whitespace-pre-line leading-relaxed">
                    {{ message }}
                </p>
            </div>

            <!-- Actions -->
            <div class="px-6 pb-6 pt-2 flex justify-end gap-3">
                <button
                    type="button"
                    class="px-4 py-2 rounded-lg border border-primary/20 hover:bg-primary/5 transition"
                    @click="cancelAction"
                >
                    {{ textCancel }}
                </button>

                <button
                    type="button"
                    :data-testid="(mode === 'update' || mode === 'create') ? 'submission-unsaved-confirmation-btn' : undefined"
                    class="px-4 py-2 rounded-lg bg-primary text-primary-inverted hover:bg-primary-hover transition"
                    @click="confirmAction"
                >
                    {{ textConfirm }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'

const modal = ref<HTMLElement | null>(null)

const {
    confirmation,
    cancelAction,
    confirmAction
} = useNuxtApp().$confirmationDialog

const { t } = useI18n()

const isOpen = computed(() => Boolean(confirmation.value))

// Default to update mode if none provided
const mode = computed<'create' | 'update'>(() => confirmation.value?.mode ?? 'update')

// All defaults live here (single source of truth)
const title = computed(() =>
    confirmation.value?.title ?? t(`unsavedChanges.${mode.value}.title`))

const message = computed(() =>
    confirmation.value?.message ?? t(`unsavedChanges.${mode.value}.message`))

const textConfirm = computed(() =>
    confirmation.value?.textConfirm ?? t(`unsavedChanges.${mode.value}.confirm`))

const textCancel = computed(() =>
    confirmation.value?.textCancel ?? t(`unsavedChanges.${mode.value}.cancel`))

// ESC closes (cancel)
const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) cancelAction()
}

watch(isOpen, open => {
    if (!import.meta.client) return
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
}, { immediate: true })

onUnmounted(() => {
    if (!import.meta.client) return
    window.removeEventListener('keydown', onKeydown)
})
</script>
