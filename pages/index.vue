<template>
    <div
        id="index"
        data-testid="home-page"
        class="w-full bg-primary-bg"
    >
        <!-- Hero -->
        <section class="w-full px-6 landscape:px-12 py-12 landscape:py-16">
            <div
                class="max-w-5xl mx-auto flex flex-col landscape:flex-row landscape:items-center
                       gap-8 landscape:gap-12"
            >
                <div class="flex flex-col gap-5 landscape:flex-1 landscape:max-w-xl">
                    <h1
                        data-testid="home-heading"
                        class="text-primary-text font-bold text-4xl landscape:text-5xl text-balance"
                    >
                        {{ t('home.heroHeading') }}
                    </h1>
                    <p class="text-primary-text-muted text-lg landscape:text-xl">
                        {{ t('home.heroLead') }}
                    </p>
                    <HomeSearchEntry class="mt-1" />
                </div>
                <SvgCharactersTogether
                    role="img"
                    :alt="t('home.heroImageAlt')"
                    class="w-full landscape:flex-1 landscape:max-w-lg self-center"
                />
            </div>
        </section>

        <!-- Browse by need -->
        <section class="w-full px-6 landscape:px-12 py-12 bg-secondary-bg border-y border-accent-bg">
            <div class="max-w-5xl mx-auto flex flex-col gap-2">
                <h2 class="text-primary-text font-bold text-2xl landscape:text-3xl">
                    {{ t('home.browseNeedHeading') }}
                </h2>
                <p class="text-primary-text-muted">
                    {{ t('home.browseNeedLead') }}
                </p>
                <ul class="mt-5 grid grid-cols-2 landscape:grid-cols-4 gap-3 list-none p-0">
                    <li
                        v-for="category in categories"
                        :key="category.code"
                    >
                        <NuxtLink
                            :to="categoryLink(category.code)"
                            :data-testid="`home-category-${category.code}`"
                            class="flex items-center h-full min-h-16 px-4 py-3 rounded-xl border border-accent-bg
                                   bg-primary-bg hover:border-primary hover:bg-primary/5 transition-colors
                                   text-primary-text font-semibold
                                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {{ category.displayText }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Browse by area -->
        <section class="w-full px-6 landscape:px-12 py-12">
            <div class="max-w-5xl mx-auto flex flex-col gap-2">
                <h2 class="text-primary-text font-bold text-2xl landscape:text-3xl">
                    {{ t('home.browseAreaHeading') }}
                </h2>
                <p class="text-primary-text-muted">
                    {{ t('home.browseAreaLead') }}
                </p>
                <ul class="mt-5 flex flex-wrap gap-2.5 list-none p-0">
                    <li
                        v-for="prefecture in prefectures"
                        :key="prefecture.name"
                    >
                        <NuxtLink
                            :to="{ path: '/search', query: { prefecture: prefecture.name } }"
                            :data-testid="`home-prefecture-${prefecture.name}`"
                            class="inline-flex items-center px-4 py-2 rounded-full border border-accent-bg
                                   bg-secondary-bg hover:border-primary hover:bg-primary/5 transition-colors
                                   text-primary-text font-medium
                                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {{ prefectureLabel(prefecture) }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/search"
                            class="inline-flex items-center px-4 py-2 rounded-full text-primary font-semibold underline
                                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {{ t('home.browseAreaAll') }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>

        <!-- How it works -->
        <section class="w-full px-6 landscape:px-12 py-12 bg-secondary-bg border-y border-accent-bg">
            <div class="max-w-5xl mx-auto flex flex-col gap-6">
                <h2 class="text-primary-text font-bold text-2xl landscape:text-3xl">
                    {{ t('home.howHeading') }}
                </h2>
                <ol class="grid grid-cols-1 landscape:grid-cols-3 gap-6 list-none p-0 m-0">
                    <li
                        v-for="step in steps"
                        :key="step.number"
                        class="flex flex-col gap-2"
                    >
                        <span
                            class="w-9 h-9 rounded-full bg-primary text-primary-text-inverted
                                   font-bold flex items-center justify-center"
                            aria-hidden="true"
                        >{{ step.number }}</span>
                        <h3 class="text-primary-text font-semibold text-lg">
                            {{ step.title }}
                        </h3>
                        <p class="text-primary-text-muted">
                            {{ step.body }}
                        </p>
                    </li>
                </ol>
            </div>
        </section>

        <!-- Impact and mission -->
        <section class="w-full px-6 landscape:px-12 py-12">
            <div class="max-w-5xl mx-auto flex flex-col gap-6">
                <h2 class="text-primary-text font-bold text-2xl landscape:text-3xl">
                    {{ t('home.impactHeading') }}
                </h2>
                <ul class="grid grid-cols-1 landscape:grid-cols-3 gap-4 list-none p-0">
                    <li
                        v-for="stat in stats"
                        :key="stat"
                        class="px-5 py-6 rounded-xl border border-accent-bg bg-secondary-bg
                               text-primary-text font-semibold text-lg text-center"
                    >
                        {{ stat }}
                    </li>
                </ul>
                <p class="text-primary-text-muted max-w-3xl">
                    {{ t('about.storyParagraph2') }}
                </p>
                <NuxtLink
                    to="/about"
                    class="text-primary font-semibold underline w-fit
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    {{ t('home.missionLink') }}
                </NuxtLink>
            </div>
        </section>

        <!-- Contribute -->
        <section class="w-full px-6 landscape:px-12 py-14 bg-primary">
            <div class="max-w-3xl mx-auto flex flex-col items-center gap-4 text-center">
                <h2 class="text-primary-text-inverted font-bold text-2xl landscape:text-3xl">
                    {{ t('home.contributeHeading') }}
                </h2>
                <p class="text-primary-text-inverted/90 text-lg">
                    {{ t('home.contributeBody') }}
                </p>
                <NuxtLink
                    to="/submit"
                    data-testid="home-contribute-cta"
                    class="mt-2 px-7 py-3 rounded-lg bg-secondary-bg text-primary font-bold text-lg
                           hover:bg-accent-bg transition-colors
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text-inverted"
                >
                    {{ t('home.contributeCta') }}
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SvgCharactersTogether from '~/assets/icons/characters-together-welcomescreen.svg'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { BROWSE_CATEGORIES, TOP_PREFECTURES, type PrefectureEntry } from '~/utils/homeDirectory'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes'

const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()

/*
 * This page deliberately loads no map, no Auth0 and no search. Everything below comes
 * from static enums and translated copy, so the homepage can paint without waiting on
 * the API — the search waterfall belongs to /search.
 */
const prefectures = TOP_PREFECTURES

/**
 * Compare against vue-i18n's active locale, not localeStore. localeStore.activeLocale
 * only updates when someone uses the language picker, so on a direct load carrying the
 * i18n_redirected cookie the page renders Japanese while the store still says en-US.
 * Note i18n uses "ja-JP" while the gql Locale enum uses "ja_JP".
 */
function prefectureLabel(prefecture: PrefectureEntry) {
    return locale.value === 'ja-JP' ? prefecture.nameJa : prefecture.name
}

const categories = computed(() =>
    BROWSE_CATEGORIES
        .map(code => specialtiesStore.specialtyCategories.find(option => option.code === code))
        .filter((option): option is NonNullable<typeof option> => !!option))

/** A category maps to several specialties; the first is the representative filter. */
function categoryLink(code: SpecialtyCategory) {
    const specialty = specialtiesStore.categoryToSpecialtyMap[code]?.[0]
    return specialty
        ? { path: '/search', query: { specialty } }
        : { path: '/search' }
}

const steps = computed(() => [
    { number: 1, title: t('home.howStep1Title'), body: t('home.howStep1Body') },
    { number: 2, title: t('home.howStep2Title'), body: t('home.howStep2Body') },
    { number: 3, title: t('home.howStep3Title'), body: t('home.howStep3Body') }
])

/*
 * Counts are the directory's actual size, measured against production on 2026-09-02
 * and carried statically for the same reason as the prefecture list. They are framed
 * as approximate so they do not read as a live counter.
 */
const stats = computed(() => [
    t('home.statFacilities', { n: 465 }),
    t('home.statProfessionals', { n: 400 }),
    t('home.statLanguages', { n: 14 })
])
</script>
