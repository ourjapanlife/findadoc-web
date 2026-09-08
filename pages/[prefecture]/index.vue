<template>
    <div
        data-testid="hub-prefecture-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <NuxtLink
            to="/search"
            class="btn btn-ghost btn-sm -ml-1 self-start"
            data-testid="hub-back-to-search"
        >
            <svg
                class="h-5 w-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            {{ t('hubPage.backToSearch') }}
        </NuxtLink>

        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold leading-tight text-primary-text">
                {{ heading }}
            </h1>
            <p class="m-0 text-sm text-primary-text-muted">
                {{ facilityCountText }}
            </p>
        </header>

        <section
            v-if="prefecture.cities.length"
            class="flex flex-col gap-3"
        >
            <h2 class="text-lg font-semibold text-primary-text">
                {{ t('hubPage.citiesHeading') }}
            </h2>
            <ul
                class="m-0 flex list-none flex-wrap gap-2 p-0"
                data-testid="hub-city-list"
            >
                <li
                    v-for="city in prefecture.cities"
                    :key="city.path"
                >
                    <NuxtLink
                        :to="city.path"
                        class="chip h-8 px-3 text-sm"
                    >
                        {{ cityLabel(city) }}
                    </NuxtLink>
                </li>
            </ul>
        </section>

        <section class="flex flex-col gap-3">
            <h2 class="text-lg font-semibold text-primary-text">
                {{ t('hubPage.facilitiesHeading') }}
            </h2>
            <HubFacilityList :facilities="prefecture.facilities" />
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, navigateTo, useAsyncData, useHead, useRoute } from '#imports'
import { isJapaneseLocale } from '~/utils/activeLocale'
import { canonicalPathMatches, slugifySegment } from '~/utils/clinicPath'
import { loadPrefectureHub } from '~/utils/hubDirectory'
import { hubPrefectureDocumentTitle, isReservedHubSegment } from '~/utils/hubPath'
import { formatPageTitle } from '~/utils/site'
import type { HubCity } from '~/utils/hubIndex'

const route = useRoute()
const { t, locale } = useI18n()

const prefectureSlug = slugifySegment(String(route.params.prefecture ?? ''))

if (!prefectureSlug || isReservedHubSegment(prefectureSlug)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data } = await useAsyncData(`hub-prefecture:${prefectureSlug}`, () => loadPrefectureHub(prefectureSlug))

if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

if (!canonicalPathMatches(route.path, data.value.path)) {
    await navigateTo(data.value.path, { redirectCode: 301, replace: true })
}

const prefecture = computed(() => data.value!)
const isJapanese = computed(() => isJapaneseLocale(locale.value))

const displayPrefecture = computed(() => {
    if (isJapanese.value) {
        return prefecture.value.prefectureJa || prefecture.value.prefectureEn
    }
    return prefecture.value.prefectureEn
})

const heading = computed(() => t('hubPage.prefectureHeading', { prefecture: displayPrefecture.value }))
const facilityCountText = computed(() => t('hubPage.facilityCount', prefecture.value.facilities.length))
const documentTitle = computed(() => hubPrefectureDocumentTitle(displayPrefecture.value))
const brandedTitle = computed(() => formatPageTitle(documentTitle.value))
const metaDescription = computed(() => t('hubPage.prefectureMeta', { prefecture: displayPrefecture.value }))

function cityLabel(city: HubCity): string {
    return isJapanese.value
        ? (city.cityJa || city.cityEn)
        : city.cityEn
}

useHead({
    title: documentTitle,
    meta: computed(() => [
        { name: 'description', content: metaDescription.value, key: 'description' },
        { property: 'og:title', content: brandedTitle.value, key: 'og:title' },
        { property: 'og:description', content: metaDescription.value, key: 'og:description' },
        { name: 'twitter:title', content: brandedTitle.value, key: 'twitter:title' },
        { name: 'twitter:description', content: metaDescription.value, key: 'twitter:description' }
    ])
})
</script>
