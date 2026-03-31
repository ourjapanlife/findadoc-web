<template>
    <div :class="`${buttonTypes[props.buttonStyle]} ${baseStyles}`">
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    buttonStyle: {
        type: String,
        required: true
    }
})

const baseStyles = 'inline w-fit h-fit px-6 py-3 flex justify-center items-center rounded-full cursor-pointer'

const buttonTypes = {
    primary: 'bg-primary hover:bg-primary-hover active:opacity-50 text-white',
    primaryOutline: 'border-primary hover:bg-primary-hover hover:text-white active:opacity-50 text-primary border-2',
    destructive: 'bg-error hover:opacity-50 active:opacity-75 text-white'
}
</script>
