<template>
    <div
        data-testid="hub-city-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <NuxtLink
            :to="prefecturePath"
            class="btn btn-ghost btn-sm -ml-1 self-start"
            data-testid="hub-back-to-prefecture"
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
            {{ backToPrefectureText }}
        </NuxtLink>

        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold leading-tight text-primary-text">
                {{ heading }}
            </h1>
            <p class="m-0 text-sm text-primary-text-muted">
                {{ facilityCountText }}
            </p>
        </header>

        <HubFacilityList :facilities="city.facilities" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, navigateTo, useAsyncData, useHead, useRoute } from '#imports'
import { isJapaneseLocale } from '~/utils/activeLocale'
import { canonicalPathMatches, slugifySegment } from '~/utils/clinicPath'
import { loadCityHub } from '~/utils/hubDirectory'
import {
    hubCityDocumentTitle,
    isIndexableCityHub,
    isReservedHubSegment,
    prefectureHubPathFromSlug
} from '~/utils/hubPath'
import { formatPageTitle } from '~/utils/site'

const route = useRoute()
const { t, locale } = useI18n()

const prefectureSlug = slugifySegment(String(route.params.prefecture ?? ''))
const citySlug = slugifySegment(String(route.params.city ?? ''))

if (!prefectureSlug || !citySlug || isReservedHubSegment(prefectureSlug)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data } = await useAsyncData(
    `hub-city:${prefectureSlug}:${citySlug}`,
    () => loadCityHub(prefectureSlug, citySlug)
)

if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

if (!canonicalPathMatches(route.path, data.value.path)) {
    await navigateTo(data.value.path, { redirectCode: 301, replace: true })
}

const city = computed(() => data.value!)
const prefecturePath = computed(() => prefectureHubPathFromSlug(city.value.prefectureSlug) ?? '/search')
const isJapanese = computed(() => isJapaneseLocale(locale.value))

const displayPrefecture = computed(() => {
    if (isJapanese.value) {
        return city.value.prefectureJa || city.value.prefectureEn
    }
    return city.value.prefectureEn
})

const displayCity = computed(() => {
    if (isJapanese.value) {
        return city.value.cityJa || city.value.cityEn
    }
    return city.value.cityEn
})

const heading = computed(() => t('hubPage.cityHeading', {
    city: displayCity.value,
    prefecture: displayPrefecture.value
}))
const facilityCountText = computed(() => t('hubPage.facilityCount', city.value.facilities.length))
const backToPrefectureText = computed(() => t('hubPage.backToPrefecture', { prefecture: displayPrefecture.value }))
const documentTitle = computed(() => hubCityDocumentTitle(displayCity.value, displayPrefecture.value))
const brandedTitle = computed(() => formatPageTitle(documentTitle.value))
const metaDescription = computed(() => t('hubPage.cityMeta', {
    city: displayCity.value,
    prefecture: displayPrefecture.value
}))
const robots = computed(() => (isIndexableCityHub(city.value.facilities.length) ? undefined : 'noindex'))

useHead({
    title: documentTitle,
    meta: computed(() => [
        { name: 'description', content: metaDescription.value, key: 'description' },
        { property: 'og:title', content: brandedTitle.value, key: 'og:title' },
        { property: 'og:description', content: metaDescription.value, key: 'og:description' },
        { name: 'twitter:title', content: brandedTitle.value, key: 'twitter:title' },
        { name: 'twitter:description', content: metaDescription.value, key: 'twitter:description' },
        ...(robots.value ? [{ name: 'robots', content: robots.value, key: 'robots' }] : [])
    ])
})
</script>
