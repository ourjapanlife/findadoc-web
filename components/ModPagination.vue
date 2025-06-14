<template>
    <div class="flex items-center justify-center gap-2 mt-4">
        <!-- First page -->
        <button
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(1)"
        >
            <SVGFirstPage class="w-4 h-4 text-white" />
        </button>

        <!-- Prev page -->
        <button
            :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(currentPage - 1)"
        >
            <SVGLeftArrow class="w-4 h-4 text-white" />
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
                    'w-8 h-8 rounded flex items-center justify-center font-semibold text-black',
                    currentPage === Number(page)
                        ? 'bg-white text-black border border-yellow-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
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
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(currentPage + 1)"
        >
            <SVGRightArrow class="w-4 h-4 text-white" />
        </button>

        <!-- Last page -->
        <button
            :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(totalPages)"
        >
            <SVGLastPage class="w-4 h-4 text-white" />
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

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = props.currentPage
    const pages: (number | string)[] = []

    if (total <= 3) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current > 2) pages.push(1)
    if (current > 3) pages.push(ellipsisToShowMoreContent)

    const start = Math.max(1, current - 1)
    const end = Math.min(total, current + 1)
    const middlePages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    pages.push(...middlePages)

    if (current < total - 2) pages.push(ellipsisToShowMoreContent)
    if (current < total - 1) pages.push(total)

    return pages
})
</script>
