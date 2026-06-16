<template>
    <div class="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-1">
        <!-- First page -->
        <button
            :disabled="!hasPrev"
            class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-bg transition-colors"
            @click="goToFirstPage"
        >
            <SVGFirstPage class="w-4 h-4 text-primary" />
        </button>

        <button
            :disabled="!hasPrev"
            class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-bg transition-colors"
            @click="goToPrev"
        >
            <SVGLeftArrow class="w-4 h-4 text-primary" />
        </button>

        <span
            class="order-3 w-full sm:order-none sm:w-auto text-center text-xs sm:text-sm text-primary-text-muted
            px-2 sm:px-4 h-8 sm:h-10 flex items-center justify-center"
        >
            {{ startIndex }}-{{ endIndex }} {{ $t('pagination.of') }} {{ totalItems }} {{ $t('pagination.results') }}
        </span>

        <button
            :disabled="!hasNext"
            class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-bg transition-colors"
            @click="goToNext"
        >
            <SVGRightArrow class="w-4 h-4 text-primary" />
        </button>

        <button
            :disabled="!hasNext"
            class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded text-primary
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent-bg transition-colors"
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
