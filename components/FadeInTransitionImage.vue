<template>
    <Transition
        enter-active-class="transition-opacity duration-1000 ease"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-1000 ease"
        leave-to-class="opacity-0"
    >
        <div v-show="!isVisible">
            <SVGLoadingIcon />
        </div>
    </Transition>
    <Transition
        enter-active-class="transition-opacity duration-1000 ease"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-1000 ease"
        leave-to-class="opacity-0"
    >
        <img
            v-show="isVisible"
            :data-testid="dataTestId"
            :class="`${objectStyling} ${borderRadius} ${width} ${height}`"
            :src="src"
            :alt="alt"
            @load="showImg"
            @error="handleError"
        >
    </Transition>
</template>

<script setup lang='ts'>
import { onMounted, ref, type Ref } from 'vue'
import SVGLoadingIcon from '~/assets/icons/loading.svg'

const props = defineProps({
    imgSrc: {
        type: String,
        required: true
    },
    dataTestId: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    objectStyling: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    width: {
        type: String,
        required: true
    },
    borderRadius: {
        type: String,
        required: true
    }
})

const src: Ref<string | undefined> = ref<string>()
const isVisible: Ref<boolean> = ref(false)

const showImg = () => {
    isVisible.value = true
}

const handleError = () => {
    isVisible.value = false
}

onMounted(() => {
    src.value = props.imgSrc
    isVisible.value = false
})
</script>
