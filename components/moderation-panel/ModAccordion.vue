<template>
    <details
        :id="id"
        class="group overflow-hidden rounded-lg border border-accent-bg bg-primary-bg"
        open
    >
        <summary
            class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3
                md:px-5 [&::-webkit-details-marker]:hidden"
        >
            <span class="flex min-w-0 items-center gap-3">
                <span
                    class="h-5 w-1 shrink-0 rounded-full"
                    :class="tone === 'healthcare' ? 'bg-accent' : 'bg-primary'"
                    aria-hidden="true"
                />
                <span class="text-base font-semibold tracking-tight text-primary-text">
                    {{ title }}
                </span>
            </span>
            <svg
                class="h-4 w-4 shrink-0 text-primary-text-muted transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 8l4 4 4-4"
                />
            </svg>
        </summary>
        <div class="px-4 pb-4 md:px-5">
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    id?: string
    tone?: 'facility' | 'healthcare'
}>()
</script>
