<template>
    <div
        v-if="city"
        data-testid="hub-city-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <BreadcrumbNav :items="crumbs" />

        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold leading-tight text-primary-text">
                {{ heading }}
            </h1>
            <p class="m-0 text-sm text-primary-text-muted">
                {{ facilityCountText }}
            </p>
        </header>

        <HubRelatedFacets
            :heading="t('hubPage.specialtiesHeading')"
            :items="citySpecialtyItems"
            test-id="hub-city-specialty-list"
        />
        <HubRelatedFacets
            :heading="t('hubPage.languagesHeading')"
            :items="cityLanguageItems"
            test-id="hub-city-language-list"
        />

        <HubFacilityList :facilities="city.facilities" />
    </div>

    <div
        v-else-if="facet"
        data-testid="hub-facet-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <BreadcrumbNav :items="crumbs" />

        <header class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold leading-tight text-primary-text">
                {{ heading }}
            </h1>
            <p class="m-0 text-sm text-primary-text-muted">
                {{ professionalCountText }}
            </p>
        </header>

        <HubRelatedFacets
            :heading="samePlaceHeading"
            :items="samePlaceItems"
            test-id="hub-related-same-place"
        />
        <HubRelatedFacets
            :heading="nearbyHeading"
            :items="nearbyItems"
            test-id="hub-related-nearby"
        />

        <HubFacilityList :facilities="facet.facilities" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, navigateTo, useAsyncData, useHead, useRoute } from '#imports'
import { isJapaneseLocale } from '~/utils/activeLocale'
import { canonicalPathMatches, slugifySegment } from '~/utils/clinicPath'
import { cityHubCrumbs, facetCrumbs } from '~/utils/directoryLinks'
import { facetDocumentTitle } from '~/utils/facetIndex'
import { loadPrefectureLeaf } from '~/utils/hubDirectory'
import { useDirectoryRelatedLinks } from '~/composables/useDirectoryLinks'
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
const secondSlug = slugifySegment(String(route.params.city ?? ''))

if (!prefectureSlug || !secondSlug || isReservedHubSegment(prefectureSlug)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data } = await useAsyncData(
    `hub-leaf:${prefectureSlug}:${secondSlug}`,
    () => loadPrefectureLeaf(prefectureSlug, secondSlug)
)

if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const related = await useDirectoryRelatedLinks(data.value)

const city = computed(() => data.value?.type === 'city' ? data.value.city : undefined)
const facet = computed(() => data.value?.type === 'facet' ? data.value.facet : undefined)
const canonicalPath = computed(() => city.value?.path ?? facet.value?.path ?? '')
const prefecturePath = computed(() => prefectureHubPathFromSlug(
    city.value?.prefectureSlug ?? facet.value?.prefectureSlug ?? prefectureSlug
))
const isJapanese = computed(() => isJapaneseLocale(locale.value))

const displayPrefecture = computed(() => {
    const prefectureEn = city.value?.prefectureEn ?? facet.value?.prefectureEn ?? ''
    const prefectureJa = city.value?.prefectureJa ?? facet.value?.prefectureJa ?? ''
    if (isJapanese.value) {
        return prefectureJa || prefectureEn
    }
    return prefectureEn
})

const displayCity = computed(() => {
    if (!city.value) {
        return ''
    }
    return isJapanese.value
        ? (city.value.cityJa || city.value.cityEn)
        : city.value.cityEn
})

const heading = computed(() => {
    if (facet.value?.kind === 'specialty') {
        return t('hubPage.specialtyHeading', {
            specialty: facet.value.label,
            prefecture: displayPrefecture.value
        })
    }
    if (facet.value?.kind === 'language') {
        return t('hubPage.languageHeading', {
            language: facet.value.label,
            prefecture: displayPrefecture.value
        })
    }
    return t('hubPage.cityHeading', {
        city: displayCity.value,
        prefecture: displayPrefecture.value
    })
})
const crumbs = computed(() => {
    const shared = {
        homeLabel: t('breadcrumbs.home'),
        prefectureLabel: displayPrefecture.value,
        prefecturePath: prefecturePath.value
    }
    if (facet.value) {
        return facetCrumbs({
            ...shared,
            facetLabel: facet.value.label
        })
    }
    return cityHubCrumbs({
        ...shared,
        cityLabel: displayCity.value
    })
})
const facilityCountText = computed(() => t('hubPage.facilityCount', city.value?.facilities.length ?? 0))
const professionalCountText = computed(() => t('hubPage.professionalCount', facet.value?.professionalCount ?? 0))
const citySpecialtyItems = computed(() => related.value?.prefectureSpecialties ?? [])
const cityLanguageItems = computed(() => (related.value?.prefectureLanguages ?? []).map(item => ({
    path: item.path,
    label: t('hubPage.languageChip', { language: item.label })
})))
const samePlaceHeading = computed(() => (
    facet.value?.kind === 'language'
        ? t('hubPage.relatedLanguagesHeading')
        : t('hubPage.relatedSpecialtiesHeading')
))
const nearbyHeading = computed(() => {
    if (facet.value?.kind === 'language') {
        return t('hubPage.nearbyLanguageHeading', { language: facet.value.label })
    }
    return t('hubPage.nearbySpecialtyHeading', { specialty: facet.value?.label ?? '' })
})
const samePlaceItems = computed(() => (related.value?.samePlace ?? []).map(item => ({
    path: item.path,
    label: facet.value?.kind === 'language'
        ? t('hubPage.languageChip', { language: item.label })
        : item.label
})))
const nearbyItems = computed(() => (related.value?.nearbySame ?? []).map(item => ({
    path: item.path,
    label: isJapanese.value ? item.labelJa : item.label
})))
const documentTitle = computed(() => {
    if (facet.value) {
        return facetDocumentTitle({
            kind: facet.value.kind,
            label: facet.value.label,
            prefectureEn: displayPrefecture.value || facet.value.prefectureEn
        })
    }
    return hubCityDocumentTitle(displayCity.value, displayPrefecture.value)
})
const brandedTitle = computed(() => formatPageTitle(documentTitle.value))
const metaDescription = computed(() => {
    if (facet.value?.kind === 'specialty') {
        return t('hubPage.specialtyMeta', {
            specialty: facet.value.label,
            prefecture: displayPrefecture.value
        })
    }
    if (facet.value?.kind === 'language') {
        return t('hubPage.languageMeta', {
            language: facet.value.label,
            prefecture: displayPrefecture.value
        })
    }
    return t('hubPage.cityMeta', {
        city: displayCity.value,
        prefecture: displayPrefecture.value
    })
})
const robots = computed(() => {
    if (facet.value || !city.value) {
        return undefined
    }
    return isIndexableCityHub(city.value.facilities.length) ? undefined : 'noindex'
})

if (!canonicalPathMatches(route.path, canonicalPath.value)) {
    await navigateTo(canonicalPath.value, { redirectCode: 301, replace: true })
} else {
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
}
</script>
