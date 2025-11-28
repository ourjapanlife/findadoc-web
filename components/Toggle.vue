<template>
    <div
        class="flex flex-col"
        @click="toggle"
    >
        <p
            class="text-primary"
        >
            {{ toggleText }}
        </p>
        <div
            class="w-9 h-5 rounded-full bg-secondary transition duration-500"
        >
            <div
                :class="toggleChecked ? `${sliderStyling} translate-x-4` : sliderStyling"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    isToggledOn: Boolean,
    toggleText: String
})

let toggleChecked = props.isToggledOn

const sliderStyling = 'w-3 h-3 m-1 rounded-full transition duration-300 absolute bg-primary'

const emit = defineEmits(['toggled-on-off'])

const toggle = () => {
    toggleChecked = !toggleChecked
    emit('toggled-on-off', toggleChecked)
}
</script>
