<template>
    <label class="switch">

        <input
            id="isChecked"
            v-model="toggleChecked"
            type="checkbox"
            @input="toggleDarkLightMode"
        >
        <span
            class="slider round bg-neutral-500"
            :class="!props.state ? 'bg-primary' :'bg-neutral-500'"
        />
    </label>
</template>

<script setup lang="ts">
const props = defineProps({
    state: Boolean
})

const toggleChecked = !props.state

const emit = defineEmits(['theme-change'])

const toggleDarkLightMode = () => {
    emit('theme-change', props.state)
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
