<template>
    <div
        data-testid="clinic-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <NuxtLink
            to="/search"
            class="btn btn-ghost btn-sm -ml-1 self-start"
            data-testid="clinic-back-to-search"
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
            {{ t('clinicPage.backToSearch') }}
        </NuxtLink>

        <BreadcrumbNav :items="crumbs" />

        <SearchResultDetails
            :facility="facility"
            heading="h1"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, navigateTo, useAsyncData, useHead, useRoute } from '#imports'
import { fetchClinicById } from '~/utils/clinicFacility'
import { canonicalPathMatches, facilityDocumentTitle, facilityIdFromSlugParam, facilityPath } from '~/utils/clinicPath'
import { facilityCrumbs, facilityHubPaths } from '~/utils/directoryLinks'
import { isJapaneseLocale } from '~/utils/activeLocale'
import { formatPageTitle } from '~/utils/site'

const route = useRoute()
const { t, locale } = useI18n()

const facilityId = facilityIdFromSlugParam(String(route.params.slug ?? ''))

if (!facilityId) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data } = await useAsyncData(`clinic-${facilityId}`, () => fetchClinicById(facilityId))

if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const canonicalPath = facilityPath(data.value)

if (!canonicalPathMatches(route.path, canonicalPath)) {
    await navigateTo(canonicalPath, { redirectCode: 301, replace: true })
}

const facility = computed(() => data.value!)

const displayName = computed(() => {
    const record = facility.value
    return (isJapaneseLocale(locale.value) ? record.nameJa : record.nameEn) || record.nameEn
})

const metaDescription = computed(() => {
    const address = facility.value.contact?.address
    const city = isJapaneseLocale(locale.value)
        ? (address?.cityJa || address?.cityEn || '')
        : (address?.cityEn || address?.cityJa || '')
    const prefecture = isJapaneseLocale(locale.value)
        ? (address?.prefectureJa || address?.prefectureEn || '')
        : (address?.prefectureEn || address?.prefectureJa || '')

    return t('clinicPage.metaDescription', {
        name: displayName.value,
        city,
        prefecture
    })
})

const documentTitle = computed(() => facilityDocumentTitle(displayName.value))
const brandedTitle = computed(() => formatPageTitle(documentTitle.value))

const locationPrefecture = computed(() => {
    const address = facility.value.contact?.address
    return isJapaneseLocale(locale.value)
        ? (address?.prefectureJa || address?.prefectureEn || '')
        : (address?.prefectureEn || address?.prefectureJa || '')
})

const locationCity = computed(() => {
    const address = facility.value.contact?.address
    return isJapaneseLocale(locale.value)
        ? (address?.cityJa || address?.cityEn || '')
        : (address?.cityEn || address?.cityJa || '')
})

const crumbs = computed(() => {
    const hubs = facilityHubPaths(facility.value.contact?.address)
    return facilityCrumbs({
        homeLabel: t('breadcrumbs.home'),
        prefectureLabel: locationPrefecture.value,
        prefecturePath: hubs.prefecturePath,
        cityLabel: locationCity.value,
        cityPath: hubs.cityPath,
        facilityLabel: displayName.value
    })
})

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
