<template>
    <nav
        v-if="items.length"
        data-testid="app-access-left-nav"
        class="w-56 shrink-0 border-r border-secondary-bg/40 bg-secondary-bg/30 flex flex-col
            overflow-y-auto portrait:w-48"
        :aria-label="t('appAccessNav.ariaLabel')"
    >
        <ul class="flex flex-col gap-1 p-3 text-sm font-medium text-primary-text">
            <li
                v-for="item in items"
                :key="item.to"
            >
                <NuxtLink
                    :to="item.to"
                    class="block rounded-lg px-3 py-2 transition-colors hover:bg-primary-hover/10"
                    :class="linkClass(item.to)"
                >
                    {{ t(item.labelKey) }}
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useAppAccessNavItems } from '~/composables/useAppAccessNavItems'

const { t } = useI18n()
const route = useRoute()
const { items } = useAppAccessNavItems()

function linkClass(path: string) {
    const active = path === '/'
        ? route.path === '/'
        : route.path === path || route.path.startsWith(`${path}/`)
    return active ? 'bg-primary/15 text-primary font-semibold' : 'text-primary-text'
}
</script>
