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
                        >
                            {{ t('errorPage.returnHome') }}
                        </a>
                        <NuxtLink
                            to="/search"
                            class="btn btn-secondary"
                        >
                            {{ t('topNav.search') }}
                        </NuxtLink>
                    </div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Bound rather than static so the compiler leaves the public URL alone.
const illustration = '/illustrations/characters-sachi-questioning.svg'
</script>
