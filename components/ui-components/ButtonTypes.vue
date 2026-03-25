<template>
    <div :class="buttonTypes[buttonStyle]">
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    buttonStyle: {
        type: String
    }
})

const buttonStyle = props.buttonStyle

// console.log(props.button)

const buttonTypes = {
    primary: 'bg-primary px-6 py-3 flex justify-center items-center rounded-full cursor-pointer',
    secondary: 'bg-secondary p-2 flex justify-center items-center rounded-full cursor-pointer'
}

console.log(buttonTypes[buttonStyle])
</script>
