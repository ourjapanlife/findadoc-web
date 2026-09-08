<template>
    <div
        data-testid="doctor-page"
        class="page-container flex flex-col gap-6 px-4 py-8"
    >
        <NuxtLink
            to="/search"
            class="btn btn-ghost btn-sm -ml-1 self-start"
            data-testid="doctor-back-to-search"
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
            {{ t('doctorPage.backToSearch') }}
        </NuxtLink>

        <DoctorDetails :professional="professional" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createError, navigateTo, useAsyncData, useHead, useRoute } from '#imports'
import { fetchDoctorById } from '~/utils/doctorProfessional'
import { professionalDocumentTitle, professionalIdFromSlugParam, professionalPath } from '~/utils/doctorPath'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { toGqlLocale } from '~/utils/activeLocale'
import { formatPageTitle } from '~/utils/site'
import { localeDisplayOptions } from '~/stores/localeStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'

const route = useRoute()
const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()

const professionalId = professionalIdFromSlugParam(String(route.params.slug ?? ''))

if (!professionalId) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data } = await useAsyncData(`doctor-${professionalId}`, () => fetchDoctorById(professionalId))

if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const canonicalPath = professionalPath(data.value)
const currentPath = route.path.length > 1 && route.path.endsWith('/')
    ? route.path.slice(0, -1)
    : route.path

if (currentPath !== canonicalPath) {
    await navigateTo(canonicalPath, { redirectCode: 301, replace: true })
}

const professional = computed(() => data.value!)

const displayName = computed(() => formatHealthcareProfessionalName(professional.value.names, toGqlLocale(locale.value)))

const metaDescription = computed(() => {
    const specialties = (professional.value.specialties ?? [])
        .map(code => specialtiesStore.specialtyDisplayOptions.find(option => option.code === code)?.displayText)
        .filter((name): name is string => !!name)
        .join(', ')
    const languages = (professional.value.spokenLanguages ?? [])
        .map(code => localeDisplayOptions.find(option => option.code === code)?.simpleText)
        .filter((name): name is string => !!name)
        .join(', ')

    return t('doctorPage.metaDescription', {
        name: displayName.value,
        specialties: specialties || t('doctorPage.specialtiesFallback'),
        languages: languages || t('doctorPage.languagesFallback')
    })
})

const documentTitle = computed(() => professionalDocumentTitle(displayName.value))
const brandedTitle = computed(() => formatPageTitle(documentTitle.value))

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
