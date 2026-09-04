<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-active-class="transition-opacity duration-150"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-40 bg-scrim/50 portrait:hidden"
                aria-hidden="true"
                @click="emit('close')"
            />
        </Transition>

        <Transition
            enter-active-class="transition-transform duration-250 ease-out"
            enter-from-class="translate-x-full"
            leave-active-class="transition-transform duration-200 ease-in"
            leave-to-class="translate-x-full"
        >
            <div
                v-if="open"
                role="dialog"
                aria-modal="true"
                aria-labelledby="search-details-title"
                data-testid="search-details-panel"
                class="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-primary-bg
                       landscape:w-[560px] landscape:max-w-[92vw] landscape:border-l landscape:border-accent-bg
                       landscape:shadow-overlay"
                @keydown.esc="emit('close')"
            >
                <div class="flex h-16 shrink-0 items-center justify-between border-b border-accent-bg px-3 landscape:px-4">
                    <button
                        ref="closeButtonRef"
                        type="button"
                        data-testid="search-details-close"
                        class="btn btn-ghost btn-sm -ml-1"
                        @click="emit('close')"
                    >
                        <svg
                            class="h-5 w-5 stroke-current"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M19 12H5m7-7-7 7 7 7" />
                        </svg>
                        {{ t('search.backToResults') }}
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto px-4 py-6 landscape:px-6">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollLock } from '~/composables/useScrollLock'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()

const closeButtonRef = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

// Released on unmount as well as on close, so leaving the route with the panel open cannot
// strand the document with `overflow: hidden`.
useScrollLock(computed(() => props.open))

/*
 * Focus moves into the panel when it opens and back to whatever opened it when it closes.
 * This is what makes the panel usable from the keyboard without a full focus-trap library.
 */
watch(() => props.open, async open => {
    if (!import.meta.client) return

    if (open) {
        previouslyFocused = document.activeElement as HTMLElement | null
        await nextTick()
        closeButtonRef.value?.focus()
    } else {
        previouslyFocused?.focus?.()
        previouslyFocused = null
    }
})
</script>
