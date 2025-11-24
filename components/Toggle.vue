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
            class="text-secondary"
        >
            {{ state ? 'Dark' : 'Light' }}
        </p>
        <div
            id="newToggle"
            class="w-9 h-5 z-auto rounded-full bg-neutral-500 transition duration-500"
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

<style>
    .switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
    }

    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }

    .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: .4s;
    transition: .4s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    }

    input:checked + .slider {
    }

    input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
    -webkit-transform: translateX(22px);
    -ms-transform: translateX(22px);
    transform: translateX(22px);
    }

  /* Rounded sliders */
    .slider.round {
    border-radius: 34px;
    }

    .slider.round:before {
    border-radius: 50%;
    }
</style>
