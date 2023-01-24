<template>
    <div class="absolute z-10 bg-secondary-bg hover:shadow-inner hover:shadow-secondary-bg/90 rounded-lg">
        <div v-if="isOpen" class="modal">
            <button @click="closeModal" class="close-button absolute right-5">
                <span>&times;</span>
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
