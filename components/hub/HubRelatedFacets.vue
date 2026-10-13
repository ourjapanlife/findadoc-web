<template>
    <nav
        v-if="items.length"
        class="flex flex-col gap-3"
        :aria-label="heading"
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
                    @click="onRelated"
                >
                    {{ item.label }}
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useUmami } from '~/composables/useUmamiTracking'
import type { EventProps } from '~/utils/analyticsEvents'

const props = defineProps<{
    heading: string
    items: { path: string, label: string }[]
    testId: string
    kind?: EventProps['Related clicked']['kind']
    from?: EventProps['Related clicked']['from']
}>()

const { track } = useUmami()

function onRelated() {
    const kind = props.kind
    const from = props.from
    if (!kind || !from) return
    track('Related clicked', { kind, from })
}
</script>
