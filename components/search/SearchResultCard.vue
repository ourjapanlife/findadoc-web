<template>
    <article
        data-testid="search-result-card"
        class="card relative flex flex-col gap-3 p-5 transition-colors"
        :class="active ? 'border-primary bg-primary/5' : 'hover:border-primary hover:bg-primary/5'"
    >
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <h3 class="text-lg font-semibold leading-snug text-primary-text">
                    <!--
                        Stretched link: the heading is the one focusable control, and its
                        ::after covers the card so the whole surface is clickable. Being a real
                        link to ?facility=… gives open-in-new-tab and Back-closes-it for free.
                    -->
                    <NuxtLink
                        :to="detailsRoute"
                        :aria-current="active ? 'true' : undefined"
                        class="after:absolute after:inset-0 after:rounded-xl after:content-['']"
                    >
                        {{ facilityName }}
                    </NuxtLink>
                </h3>
                <p class="m-0 text-sm text-primary-text-muted">
                    {{ addressSummary }}
                </p>
            </div>
            <svg
                class="mt-1 h-5 w-5 shrink-0 stroke-primary-text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="m9 6 6 6-6 6" />
            </svg>
        </div>

        <ul
            v-if="languages.length"
            class="m-0 flex list-none flex-wrap gap-1.5 p-0"
            :aria-label="t('search.languagesSpoken')"
        >
            <li
                v-for="languageName in languages"
                :key="languageName"
                class="chip h-7 px-2.5 text-xs"
            >
                {{ languageName }}
            </li>
        </ul>

        <ul class="m-0 flex list-none flex-col gap-2 p-0 text-primary-text">
            <li
                v-for="professional in visibleProfessionals"
                :key="professional.id"
                class="flex flex-col"
            >
                <span class="leading-snug">
                    <span class="font-medium">{{ professional.name }}</span>
                    <span
                        v-if="professional.degrees"
                        class="text-sm text-primary-text-muted"
                    >, {{ professional.degrees }}</span>
                </span>
                <span
                    v-if="professional.specialties"
                    class="text-sm leading-snug text-primary-text-muted"
                >{{ professional.specialties }}</span>
            </li>
            <li
                v-if="hiddenProfessionalCount > 0"
                class="text-sm font-medium text-primary"
            >
                {{ moreProfessionalsText }}
            </li>
        </ul>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { localeDisplayOptions } from '~/stores/localeStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { isJapaneseLocale, toGqlLocale } from '~/utils/activeLocale'
import type { FacilitySearchResult } from '~/utils/searchDirectory'

const props = defineProps<{
    result: FacilitySearchResult
    active?: boolean
}>()

const MAX_VISIBLE_PROFESSIONALS = 3

const { t, locale } = useI18n()
const route = useRoute()
const specialtiesStore = useSpecialtiesStore()

// Keyed off vue-i18n, not localeStore: the store lags behind a cookie-driven locale.
const isJapanese = computed(() => isJapaneseLocale(locale.value))

const facilityName = computed(() => (isJapanese.value ? props.result.nameJa : props.result.nameEn) || props.result.nameEn)

const addressSummary = computed(() => {
    const address = props.result.contact?.address
    if (!address) return ''

    return isJapanese.value
        ? `${address.prefectureJa ?? ''}${address.cityJa ?? ''}`
        : [address.cityEn, address.prefectureEn].filter(Boolean).join(', ')
})

/** Every language spoken by any matching professional here, most common first. */
const languages = computed(() => {
    const counts = new Map<string, number>()
    for (const professional of props.result.healthcareProfessionals) {
        for (const code of professional.spokenLanguages ?? []) {
            counts.set(code, (counts.get(code) ?? 0) + 1)
        }
    }

    /*
     * Drop codes the locale list cannot name rather than showing the fallback string: an
     * unmatched code used to render the raw translation key as if it were a language.
     */
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([code]) => localeDisplayOptions.find(option => option.code === code)?.simpleText)
        .filter((name): name is string => !!name)
})

const professionals = computed(() => props.result.healthcareProfessionals.map(professional => ({
    id: professional.id,
    name: formatHealthcareProfessionalName(professional.names, toGqlLocale(locale.value)),
    degrees: (professional.degrees ?? []).join(', '),
    specialties: (professional.specialties ?? [])
        .map(code => specialtiesStore.specialtyDisplayOptions.find(option => option.code === code)?.displayText)
        .filter(Boolean)
        .join(', ')
})))

const visibleProfessionals = computed(() => professionals.value.slice(0, MAX_VISIBLE_PROFESSIONALS))
const hiddenProfessionalCount = computed(() => Math.max(0, professionals.value.length - MAX_VISIBLE_PROFESSIONALS))

// In script rather than the template: i18n/cleanUnusedLocaleKeys.js only sees template t() calls with no second argument.
const moreProfessionalsText = computed(() => t('search.moreProfessionals', { n: hiddenProfessionalCount.value }))

const detailsRoute = computed(() => ({
    path: route.path,
    query: { ...route.query, facility: props.result.id }
}))
</script>
