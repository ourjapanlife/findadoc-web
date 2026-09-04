<template>
    <div
        data-testid="search-map-panel"
        class="card h-[45svh] overflow-hidden landscape:sticky landscape:top-36 landscape:h-[calc(100svh-10.5rem)]"
    >
        <!--
            LazyMapContainer: the Google Maps SDK and its wrapper are a separate chunk that only
            downloads when someone actually asks for the map. The list never pays for it.
        -->
        <ClientOnly>
            <LazyMapContainer
                @select="id => emit('select', id)"
                @deselect="emit('deselect')"
            />
            <template #fallback>
                <div
                    class="skeleton h-full w-full rounded-none"
                    aria-hidden="true"
                />
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'select', facilityId: string): void
    (e: 'deselect'): void
}>()
</script>
