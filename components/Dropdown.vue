<template>
    <div
        class="flex text-center rounded-full px-2 py-1 landscape:px-2 landscape:py-1.5 border-2 border-primary/80
        landscape:border-primary/60 drop-shadow-md text-primary-text bg-secondary-bg/5
        landscape:bg-primary-bg hover:bg-primary-hover/10 transition-colors"
        @click="toggleDropdown"
    >
        <slot />
        <SvgoAccordionArrow
            id="accordion"
            role="img"
            title="accordion arrow"
            :class="dropdownIsOpen
                ? 'w-6 h-6 transition duration-300 fill-primary'
                : 'w-6 h-6 transition duration-300 fill-primary -rotate-180'"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const dropdownIsOpen = ref(false)

function toggleDropdown() {
    dropdownIsOpen.value = !dropdownIsOpen.value
}
</script>
