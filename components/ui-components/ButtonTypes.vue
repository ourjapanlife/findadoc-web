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

const buttonTypes = {
    primary: 'bg-primary hover:bg-primary-hover active:opacity-50 text-white inline w-fit h-fit px-6 py-3 flex justify-center items-center rounded-full cursor-pointer',
    primaryOutline: 'border-primary hover:bg-primary-hover hover:text-white active:opacity-50 text-primary border-2 w-fit h-fit px-6 py-3 flex justify-center items-center rounded-full cursor-pointer',
    destructive: 'bg-error hover:opacity-50 w-fit h-fit px-6 py-3 text-white flex justify-center items-center rounded-full cursor-pointer'
}
</script>
