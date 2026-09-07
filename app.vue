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
import { documentTitlePath, pageMetaI18nKey, pageTitleKeyForPath } from '~/utils/pageTitles'
import { formatPageTitle } from '~/utils/site'
import { useHead, useRoute } from '#imports'

initializeGqlClient()

const route = useRoute()
const { t } = useI18n()

// Titles live in PAGE_META_TITLE_ROUTES, not in each page, so a missing public
// route is a type/test failure instead of a forgotten useHead. The template
// function must be set at runtime: nuxt.config head is serialized into the app
// manifest, and functions declared there are silently dropped.
useHead({
    title: computed(() => {
        // route.fullPath keeps this reactive on in-app navigations. On a generate
        // SPA shell the payload route can still be `/` while LoginForm awaits Auth0;
        // documentTitlePath prefers the URL the visitor actually opened.
        const path = documentTitlePath(
            route.path,
            import.meta.client ? window.location.pathname : undefined
        )
        const key = pageTitleKeyForPath(path)
        return key ? t(pageMetaI18nKey(key)) : ''
    }),
    titleTemplate: (title?: string) => formatPageTitle(title)
})
</script>
