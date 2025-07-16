<template>
    <div class="flex items-center justify-center gap-2 mt-4">
        <button
            :disabled="!hasPrev"
            class="w-10 h-10 flex items-center justify-center rounded text-primary disabled:opacity-30
            disabled:cursor-not-allowed hover:bg-bg-accent transition-colors"
            @click="goToFirstPage"
        >
            <SVGFirstPage class="w-4 h-4 text-primary" />
        </button>

        <button
            :disabled="!hasPrev"
            class="w-10 h-10 flex items-center justify-center rounded text-primary disabled:opacity-30
            disabled:cursor-not-allowed hover:bg-bg-accent transition-colors"
            @click="goToPrev"
        >
            <SVGLeftArrow class="w-4 h-4 text-primary" />
        </button>

        <span class="text-sm text-gray-700 px-4 h-10 flex items-center">
            {{ startIndex }}-{{ endIndex }} {{ $t('pagination.of') }} {{ totalItems }} {{ $t('pagination.results') }}
        </span>

        <button
            :disabled="!hasNext"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-accent transition-colors"
            @click="goToNext"
        >
            <SVGRightArrow class="w-4 h-4 text-primary" />
        </button>

        <button
            :disabled="!hasNext"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-accent transition-colors"
            @click="goToLastPage"
        >
            <SVGLastPage class="w-4 h-4 text-primary" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SVGLeftArrow from '~/assets/icons/left-arrow-pagination.svg'
import SVGRightArrow from '~/assets/icons/right-arrow-pagination.svg'
import SVGFirstPage from '~/assets/icons/first-page-pagination.svg'
import SVGLastPage from '~/assets/icons/last-page-pagination.svg'

const props = defineProps<{
    currentOffset: number
    totalItems: number
    itemsPerPage: number
}>()

const emit = defineEmits<{
    (e: 'update:offset', value: number): void
}>()

const startIndex = computed(() => props.currentOffset + 1)
const endIndex = computed(() => Math.min(props.currentOffset + props.itemsPerPage, props.totalItems))

const hasPrev = computed(() => props.currentOffset > 0)
const hasNext = computed(() => props.currentOffset + props.itemsPerPage < props.totalItems)

function goToFirstPage() {
    if (hasPrev.value) {
        emit('update:offset', 0)
    }
}

function goToPrev() {
    if (hasPrev.value) {
        emit('update:offset', props.currentOffset - props.itemsPerPage)
    }
}

function goToNext() {
    if (hasNext.value) {
        emit('update:offset', props.currentOffset + props.itemsPerPage)
    }
}

function goToLastPage() {
    if (hasNext.value) {
        const lastPageOffset = Math.max(0, Math.floor((props.totalItems - 1) / props.itemsPerPage) * props.itemsPerPage)
        emit('update:offset', lastPageOffset)
    }
}
</script>
