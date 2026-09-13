<template>
    <nav
        data-testid="breadcrumbs"
        :aria-label="t('breadcrumbs.navLabel')"
        class="text-sm text-primary-text-muted"
    >
        <ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
            <li
                v-for="(item, index) in items"
                :key="`${item.label}-${index}`"
                class="inline-flex items-center gap-x-2"
            >
                <NuxtLink
                    v-if="item.to"
                    :to="item.to"
                    class="link link-hover"
                >
                    {{ item.label }}
                </NuxtLink>
                <span
                    v-else
                    aria-current="page"
                    class="font-medium text-primary-text"
                >
                    {{ item.label }}
                </span>
                <span
                    v-if="index < items.length - 1"
                    aria-hidden="true"
                >/</span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { BreadcrumbItem } from '~/utils/directoryLinks'

defineProps<{
    items: BreadcrumbItem[]
}>()

const { t } = useI18n()
</script>
