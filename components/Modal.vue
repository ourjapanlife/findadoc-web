<template>
    <div
        class="absolute z-10 bg-primary-bg rounded-xl overflow-hidden
        hover:shadow-inner hover:shadow-secondary-bg/90"
    >
        <div class="modal">
            <button
                type="button"
                class="close-button absolute right-6 top-5 bg-primary-inverted rounded-lg px-2 py-.5
                group hover:bg-primary-hover transition-all duration-200"
                @click="store.hideModal()"
            >
                <span class="close-icon">
                    <svg
                        class="stroke-primary group-hover:stroke-primary-inverted"
                        width="20"
                        heigh="20"
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
                </span>
            </button>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useModalStore } from '~/stores/modalStore'

const store = useModalStore()
</script>

