<template>
    <div
        class="absolute z-10 bg-secondary-bg hover:shadow-inner hover:shadow-secondary-bg/90 rounded-lg overflow-hidden">
        <div v-if="isOpen" class="modal">
            <button @click="closeModal" class="close-button absolute right-5 top-5 h-6 bg-primary-inverted rounded-lg px-1.5 py-.5">
                <span class="close-icon text-primary-text-inverted">
                    <svg class="" width="16" heigh="16" viewBox="4 0 16 25">
                        <path stroke="black" stroke-width="4" fill="none" d="M6.25,6.25,17.75,17.75" />
                        <path stroke="black" stroke-width="4" fill="none" d="M6.25,17.75,17.75,6.25" />
                    </svg>
                </span>
            </button>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(true)

const closeModal = () => {
    isOpen.value = false
}

</script>
