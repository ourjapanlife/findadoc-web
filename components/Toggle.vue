<template>
    <!-- <label class="switch">
        <input
            id="isChecked"
            v-model="toggleChecked"
            type="checkbox"
            @input="toggleLightDarkMode"
        >
        <span
            id="slider"
            :class="toggleChecked ? 'slider round bg-primary' : 'slider round bg-neutral-500'"
        />
    </label> -->
    <div
        class="flex flex-col"
        @click="toggleLightDarkMode"
    >
        <p
            id="state-text"
            class="text-primary"
        >
            {{ state ? 'Dark' : 'Light' }}
        </p>
        <div
            id="newToggle"
            class="w-9 h-5 z-auto rounded-full bg-secondary transition duration-500"
        >
            <div
                id="new-toggle-slider"

                :class="toggleChecked ? 'w-3 h-3 m-1 rounded-full transition duration-300 bg-accent absolute bg-primary translate-x-4' : 'w-3 h-3 m-1 rounded-full transition duration-300 bg-accent absolute bg-primary'"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    state: Boolean
})

let toggleChecked = props.state

const emit = defineEmits(['theme-change'])

const toggleLightDarkMode = () => {
    // document.getElementById('newToggle')?.classList.toggle('justify-end')
    // document.getElementById('new-toggle-slider')?.classList.toggle('translate-x-4')
    // document.getElementById('new-toggle-slider')?.classList.toggle('bg-primary')

    toggleChecked = !toggleChecked
    emit('theme-change', toggleChecked)
}
</script>
