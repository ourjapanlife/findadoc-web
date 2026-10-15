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
import { jsonLdScript, organizationJsonLd } from '~/utils/structuredData'
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
useHead(() => {
    // Unhead's meta and link inputs are discriminated unions. A shared
    // `{ name?: string, property?: string }` element is not assignable to any
    // member, so each tag keeps its own literal shape.
    const meta: Array<
      | { property: 'og:url' | 'og:locale', content: string, key: string }
      | { name: 'robots', content: 'noindex', key: string }
    > = [
        { property: 'og:url', content: canonical.value, key: 'og:url' },
        { property: 'og:locale', content: openGraphLocale(String(locale.value)), key: 'og:locale' }
    ]

    if (isNoindexRoute(route.path, route.query)) {
        meta.push({ name: 'robots', content: 'noindex', key: 'robots' })
    }

    // Entity routes set their own title from the record. Omitting `title` lets that
    // win. A public route with no catalog key still sends '' so the brand fallback applies.
    let title: string | undefined
    if (!isEntityRoute(route.path)) {
        const key = pageTitleKeyForPath(route.path)
        title = key ? t(pageMetaI18nKey(key)) : ''
    }

    return {
        ...(title !== undefined ? { title } : {}),
        titleTemplate: (title?: string) => formatPageTitle(title),
        link: [{ rel: 'canonical' as const, href: canonical.value, key: 'canonical' }],
        meta,
        script: [jsonLdScript('ld-organization', organizationJsonLd())]
    }
})
</script>
