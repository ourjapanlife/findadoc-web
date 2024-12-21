<template>
    <div
        class="flex items-center px-3 py-3.5 w-96 h-12 bg-secondary-bg
    rounded-lg border border-primary-text-muted text-primary-text
    text-sm font-normal font-sans placeholder-primary-text-muted
    outline outline-0 -outline-offset-2 gap-2 divide-x-2
    focus-within:outline-currentColor
    focus-within:outline-2
    "
    >
        <input
            ref="searchInputElement"
            type="text"
            :placeholder="placeHolderText"
            class="grow focus-visible:outline-none"
            @blur="$emit('searchInputBlur', $event)"
            @keydown.esc="$emit('searchInputBlur', $event)"
            @keydown.down="$emit('searchInputArrowDown', $event)"
            @keydown.up="$emit('searchInputArrowUp', $event)"
            @keydown.enter="$emit('searchInputEnter', $event)"
            @input="$emit('searchInputChange', $event)"
        >
        <span
            v-if="itemsCount > 0"
            class="pl-2"
        >
            {{ itemsCount }}
        </span>
        <button
            type="button"
            @click="searchInputElement?.focus()"
        >
            <SVGLookingGlass
                role="img"
                title="searching icon"
                class="h-6 pl-2"
            />
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'

type Props = {
    itemsCount: number
    placeHolderText: string
}

const { itemsCount, placeHolderText } = defineProps<Props>()

defineEmits(['searchInputBlur', 'searchInputArrowDown', 'searchInputArrowUp', 'searchInputEnter', 'searchInputChange'])

const searchInputModel = defineModel<HTMLInputElement>()
const searchInputElement = ref<HTMLInputElement>()

watch(() => searchInputElement.value, value => {
    searchInputModel.value = value
})
</script>
