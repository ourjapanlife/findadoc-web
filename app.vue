<template>
    <NuxtLayout>
        <NuxtPage />
        <!--
            Client-only: the dialog reads $confirmationDialog, which is provided by a
            .client plugin and is therefore undefined during SSR. It has nothing to
            render server-side anyway — it only ever appears in response to a user
            action.
        -->
        <ClientOnly>
            <ConfirmationDialog />
        </ClientOnly>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { initializeGqlClient } from './utils/graphql.js'
import { pageMetaI18nKey, pageTitleKeyForPath } from '~/utils/pageTitles'
import { canonicalUrl, isNoindexRoute, openGraphLocale } from '~/utils/seo'
import { formatPageTitle } from '~/utils/site'
import { useHead, useRoute } from '#imports'

initializeGqlClient()

const route = useRoute()
const { t, locale } = useI18n()

const pageTitle = computed(() => {
    const key = pageTitleKeyForPath(route.path)
    return key ? t(pageMetaI18nKey(key)) : ''
})

const canonical = computed(() => canonicalUrl(route.path))

// Titles live in PAGE_META_TITLE_ROUTES, not in each page, so a missing public
// route is a type/test failure instead of a forgotten useHead. Canonical, og:url,
// and noindex follow the same path so they cannot drift from the document title.
// The template function must be set at runtime: nuxt.config head is serialized
// into the app manifest, and functions declared there are silently dropped.
useHead({
    title: pageTitle,
    titleTemplate: (title?: string) => formatPageTitle(title),
    link: computed(() => [{ rel: 'canonical', href: canonical.value, key: 'canonical' }]),
    meta: computed(() => {
        const tags: Array<{ name?: string, property?: string, content: string, key?: string }> = [
            { property: 'og:url', content: canonical.value, key: 'og:url' },
            { property: 'og:locale', content: openGraphLocale(String(locale.value)), key: 'og:locale' }
        ]

        if (isNoindexRoute(route.path)) {
            tags.push({ name: 'robots', content: 'noindex', key: 'robots' })
        }

        return tags
    })
})
</script>
