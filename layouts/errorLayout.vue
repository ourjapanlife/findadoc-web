<template>
    <div class="flex min-h-dvh w-full flex-col bg-primary-bg font-sans text-primary-text">
        <TopNav class="shrink-0" />

        <main class="page-section flex flex-1 items-center">
            <div
                class="page-container flex flex-col items-center gap-8 text-center
                       landscape:flex-row landscape:justify-between landscape:text-left"
            >
                <div class="flex max-w-xl flex-col gap-4">
                    <h1 class="page-title">
                        {{ t('errorPage.title') }}
                    </h1>
                    <p class="text-lg text-primary-text-muted">
                        {{ t('errorPage.description') }}
                    </p>
                    <div class="mt-2 flex flex-wrap justify-center gap-3 landscape:justify-start">
                        <a
                            href="/"
                            class="btn btn-primary"
                            @click="track('Not found escaped', { to: 'home' })"
                        >
                            {{ t('errorPage.returnHome') }}
                        </a>
                        <NuxtLink
                            to="/search"
                            class="btn btn-secondary"
                            @click="track('Not found escaped', { to: 'search' })"
                        >
                            {{ t('topNav.search') }}
                        </NuxtLink>
                        <a
                            href="/sitemap.xml"
                            class="btn btn-ghost"
                        >
                            {{ t('errorPage.sitemap') }}
                        </a>
                        <a
                            href="/llms.txt"
                            class="btn btn-ghost"
                        >
                            {{ t('errorPage.guide') }}
                        </a>
                    </div>
                    <p class="text-primary-text-muted">
                        {{ t('errorPage.recovery') }}
                    </p>
                </div>
                <img
                    :src="illustration"
                    alt=""
                    width="1024"
                    height="1536"
                    loading="lazy"
                    decoding="async"
                    class="h-auto w-48 shrink-0 landscape:w-64"
                >
            </div>
        </main>

        <Footer class="shrink-0" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUmami } from '~/composables/useUmamiTracking'
import { notFoundArea } from '~/utils/analyticsEvents'

const { t } = useI18n()
const { track } = useUmami()

// Bound rather than static so the compiler leaves the public URL alone.
const illustration = '/illustrations/characters-sachi-questioning.svg'

onMounted(() => {
    track('Not found', { area: notFoundArea(window.location.pathname) })
})
</script>
