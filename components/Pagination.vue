<template>
    <div class="flex items-center justify-center gap-2 mt-4">
        <!-- First page -->
        <button
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
                disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(1)"
        >
            <SVGFirstPage class="w-4 h-4 text-primary" />
        </button>

        <!-- Prev page -->
        <button
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
                disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(currentPage - 1)"
        >
            <SVGLeftArrow class="w-4 h-4 text-primary" />
        </button>

        <!-- Page numbers -->
        <span
            v-for="page in visiblePages"
            :key="page"
            class="mx-1"
        >
            <button
                v-if="typeof page === 'number'"
                :class="[
                    'w-8 h-8 rounded flex items-center justify-center font-semibold text-primary',
                    currentPage === Number(page)
                        ? 'bg-rimary text-primary border border-primary'
                        : 'bg-primary text-primary hover:bg-primary',
                ]"

                :disabled="currentPage === Number(page)"
                @click="goToPage(Number(page))"
            >
                {{ page }}
            </button>
            <span
                v-else
                class="px-1 text-gray-500"
            >
                {{ ellipsisToShowMoreContent }}
            </span>
        </span>

        <!-- Next page -->
        <button
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
                disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(currentPage + 1)"
        >
            <SVGRightArrow class="w-4 h-4 text-primary" />
        </button>

        <!-- Last page -->
        <button
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded text-primary
                disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(totalPages)"
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
    currentPage: number
    totalItems: number
    itemsPerPage: number
}>()

const ellipsisToShowMoreContent = '...'

const emit = defineEmits<{
    (e: 'update:currentPage', value: number): void
}>()

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.itemsPerPage))

function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:currentPage', page)
    }
}

function createSequentialNumberArray(start: number, end: number): number[] {
    const length = end - start + 1
    if (length <= 0) return []
    return Array.from({ length }, (_, i) => start + i)
}

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = props.currentPage
    const pages: (number | string)[] = []

    // If total pages are 3 or less, display all pages directly without ellipsis.
    if (total <= 3) {
        return createSequentialNumberArray(1, total)
    }

    // Show '1' only if the current page is beyond page 2,
    const shouldShowFirstPage = current > 2
    if (shouldShowFirstPage) {
        pages.push(1)
    }

    // show them if the current page is beyond page 3,
    const shouldShowLeadingEllipsis = current > 3
    if (shouldShowLeadingEllipsis) {
        pages.push(ellipsisToShowMoreContent)
    }

    // Calculate the range for the central block of pages.
    const start = Math.max(1, current - 1)
    const end = Math.min(total, current + 1)
    const middlePages = createSequentialNumberArray(start, end)
    pages.push(...middlePages)

    // Show them if the current page is sufficiently far from the end
    // (at least 3 pages before the end), indicating a "gap" between the central pages and the last page.
    const shouldShowTrailingEllipsis = current < total - 2
    if (shouldShowTrailingEllipsis) {
        pages.push(ellipsisToShowMoreContent)
    }

    // Show the last page if the current page is not among the very last two pages
    const shouldShowLastPage = current < total - 1
    if (shouldShowLastPage) {
        pages.push(total)
    }

    return pages
})
</script>
