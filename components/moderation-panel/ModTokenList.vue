<template>
    <ul
        v-if="labels.length"
        class="m-0 mt-3 flex list-none flex-wrap gap-2 p-0"
    >
        <li
            v-for="(label, index) in labels"
            :key="`${index}-${label}`"
            class="chip"
        >
            {{ label }}
        </li>
    </ul>
</template>

<script setup lang="ts">
defineProps<{
    labels: string[]
}>()
</script>
