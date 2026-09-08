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
import { isEntityRoute, pageMetaI18nKey, pageTitleKeyForPath } from '~/utils/pageTitles'
import { canonicalUrl, isNoindexRoute, openGraphLocale } from '~/utils/seo'
import { formatPageTitle } from '~/utils/site'
import { useHead, useRoute } from '#imports'

initializeGqlClient()

const route = useRoute()
const { t, locale } = useI18n()

const canonical = computed(() => canonicalUrl(route.path))

// Titles live in PAGE_META_TITLE_ROUTES, not in each page, so a missing public
// route is a type/test failure instead of a forgotten useHead. Canonical, og:url,
// and noindex follow the same path so they cannot drift from the document title.
// Entity routes (`/clinic/…`, `/doctor/…`, `/tokyo`, `/tokyo/dentistry`) set their own title from the
// record — omitting `title` here lets that win instead of the brand-only fallback.
// The template function must be set at runtime: nuxt.config head is serialized
// into the app manifest, and functions declared there are silently dropped.
useHead(computed(() => {
    const head: {
        title?: string
        titleTemplate: (title?: string) => string
        link: { rel: string, href: string, key: string }[]
        meta: Array<{ name?: string, property?: string, content: string, key?: string }>
    } = {
        titleTemplate: (title?: string) => formatPageTitle(title),
        link: [{ rel: 'canonical', href: canonical.value, key: 'canonical' }],
        meta: [
            { property: 'og:url', content: canonical.value, key: 'og:url' },
            { property: 'og:locale', content: openGraphLocale(String(locale.value)), key: 'og:locale' }
        ]
    }

    if (!isEntityRoute(route.path)) {
        const key = pageTitleKeyForPath(route.path)
        head.title = key ? t(pageMetaI18nKey(key)) : ''
    }

    if (isNoindexRoute(route.path)) {
        head.meta.push({ name: 'robots', content: 'noindex', key: 'robots' })
    }

    return head
}))
</script>
