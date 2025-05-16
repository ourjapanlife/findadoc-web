<template>
    <div class="flex items-center justify-between mt-4">
        <p class="text-sm text-gray-600">
            {{ startItem }} - {{ endItem }} of {{ totalItems }}
        </p>
        <div class="flex gap-2">
            <button
                v-if="currentPage > 1"
                class="text-gray-600 disabled:opacity-30"
                :disabled="currentPage === 1"
                @click="emit('update:currentPage', currentPage - 1)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L6.707 7l4.647 4.646a.5.5 0 0
                        1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708 0z"
                    />
                </svg>
            </button>
            <button
                v-if="currentPage < totalPages"
                class="text-gray-600 disabled:opacity-30"
                :disabled="currentPage === totalPages"
                @click="emit('update:currentPage', currentPage + 1)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.646 1.646a.5.5 0 0 1 .708 0l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 1
                        1-.708-.708L9.293 7 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const startItem: Ref<number> = computed(() =>
    props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1)

const endItem: Ref<number> = computed(() =>
    props.totalItems === 0 ? 0 : Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>
