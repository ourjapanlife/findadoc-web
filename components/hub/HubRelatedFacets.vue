<template>
    <section
        v-if="items.length"
        class="flex flex-col gap-3"
        :data-testid="testId"
    >
        <h2 class="text-lg font-semibold text-primary-text">
            {{ heading }}
        </h2>
        <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
            <li
                v-for="item in items"
                :key="item.path"
            >
                <NuxtLink
                    :to="item.path"
                    class="chip h-8 px-3 text-sm"
                >
                    {{ item.label }}
                </NuxtLink>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    heading: string
    items: { path: string, label: string }[]
    testId: string
}>()
</script>
