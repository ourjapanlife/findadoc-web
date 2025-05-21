<template>
    <div class="flex items-center justify-center gap-4 mt-4">
        <!-- Left arrow -->
        <button
            v-if="totalPages >0 "
            :disabled="currentPage === 1 || totalPages === 0"
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30"
            @click="emit('update:currentPage', currentPage - 1)"
        >
            <SVGSVGLeftArrow class="w-4 h-4 text-white" />
        </button>
        <!-- Page info -->
        <p
            v-if="totalPages >0 "
            class="text-sm text-gray-600"
        >
            {{ $t("modPagination.page") }} {{ currentPage }} {{ $t("modPagination.of") }} {{ totalPages }}
        </p>
        <!-- Right arrow -->
        <button
            v-if="totalPages >0 "
            :disabled="currentPage === 1 || totalPages === 0"
            class="w-10 h-10 flex items-center justify-center rounded bg-gray-400 disabled:opacity-30"
            @click="emit('update:currentPage', currentPage + 1)"
        >
            <SVGSVGRightArrow class="w-4 h-4 text-white" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SVGSVGLeftArrow from '~/assets/icons/left-arrow-pagination.svg'
import SVGSVGRightArrow from '~/assets/icons/right-arrow-pagination.svg'

const props = defineProps<{
    currentPage: number
    totalItems: number
    itemsPerPage: number
}>()

const emit = defineEmits<{
    (e: 'update:currentPage', value: number): void
}>()

const totalPages: Ref<number> = computed((): number =>
    Math.ceil(props.totalItems / props.itemsPerPage))
</script>
