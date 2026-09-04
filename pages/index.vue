<template>
    <div
        id="index"
        data-testid="home-page"
        class="w-full bg-primary-bg"
    >
        <!-- Hero -->
        <section class="page-section py-12 landscape:py-16">
            <div
                class="page-container flex flex-col gap-8 landscape:flex-row landscape:items-center landscape:gap-12"
            >
                <div class="flex flex-col gap-5 landscape:max-w-xl landscape:flex-1">
                    <h1
                        data-testid="home-heading"
                        class="page-title"
                    >
                        {{ t('home.heroHeading') }}
                    </h1>
                    <p class="text-lg text-primary-text-muted landscape:text-xl">
                        {{ t('home.heroLead') }}
                    </p>
                    <HomeSearchEntry class="mt-1" />
                </div>
                <!--
                    An <img>, not an inline SVG component: the illustration is 127 KB even after
                    svgo, and inlining it put that in every prerendered page's HTML on the
                    critical path. As a file it is cached once and never blocks the text.
                    Bound rather than static so the compiler leaves the public URL alone.
                -->
                <img
                    :src="heroIllustration"
                    :alt="t('home.heroImageAlt')"
                    width="1536"
                    height="1024"
                    fetchpriority="high"
                    decoding="async"
                    class="h-auto w-full self-center landscape:max-w-lg landscape:flex-1"
                >
            </div>
        </section>

        <!-- Browse by need -->
        <section class="page-section border-y border-accent-bg bg-secondary-bg">
            <div class="page-container flex flex-col gap-2">
                <h2 class="section-heading">
                    {{ t('home.browseNeedHeading') }}
                </h2>
                <p class="section-lead">
                    {{ t('home.browseNeedLead') }}
                </p>
                <ul class="mt-5 grid list-none grid-cols-2 gap-3 p-0 landscape:grid-cols-4">
                    <li
                        v-for="category in categories"
                        :key="category.code"
                    >
                        <NuxtLink
                            :to="categoryLink(category.code)"
                            :data-testid="`home-category-${category.code}`"
                            class="flex h-full min-h-16 items-center rounded-xl border border-accent-bg bg-primary-bg
                                   px-4 py-3 font-semibold text-primary-text transition-colors
                                   hover:border-primary hover:bg-primary/5"
                        >
                            {{ category.displayText }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Browse by area -->
        <section class="page-section">
            <div class="page-container flex flex-col gap-2">
                <h2 class="section-heading">
                    {{ t('home.browseAreaHeading') }}
                </h2>
                <p class="section-lead">
                    {{ t('home.browseAreaLead') }}
                </p>
                <ul class="mt-5 flex list-none flex-wrap gap-2.5 p-0">
                    <li
                        v-for="prefecture in prefectures"
                        :key="prefecture.name"
                    >
                        <NuxtLink
                            :to="{ path: '/search', query: { prefecture: prefecture.name } }"
                            :data-testid="`home-prefecture-${prefecture.name}`"
                            class="chip h-11 px-4 transition-colors hover:border-primary hover:bg-primary/5"
                        >
                            {{ prefectureLabel(prefecture) }}
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/search"
                            class="link inline-flex h-11 items-center px-2"
                        >
                            {{ t('home.browseAreaAll') }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>

        <!-- How it works -->
        <section class="page-section border-y border-accent-bg bg-secondary-bg">
            <div class="page-container flex flex-col gap-6">
                <h2 class="section-heading">
                    {{ t('home.howHeading') }}
                </h2>
                <ol class="m-0 grid list-none grid-cols-1 gap-6 p-0 landscape:grid-cols-3">
                    <li
                        v-for="step in steps"
                        :key="step.number"
                        class="flex flex-col gap-2"
                    >
                        <span
                            class="flex h-9 w-9 items-center justify-center rounded-full bg-primary
                                   font-bold text-primary-text-inverted"
                            aria-hidden="true"
                        >{{ step.number }}</span>
                        <h3 class="text-lg font-semibold text-primary-text">
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
        <section class="page-section">
            <div class="page-container flex flex-col gap-6">
                <h2 class="section-heading">
                    {{ t('home.impactHeading') }}
                </h2>
                <ul class="grid list-none grid-cols-1 gap-4 p-0 landscape:grid-cols-3">
                    <li
                        v-for="stat in stats"
                        :key="stat"
                        class="card px-5 py-6 text-lg font-semibold text-primary-text"
                    >
                        {{ stat }}
                    </li>
                </ul>
                <p class="max-w-3xl text-primary-text-muted">
                    {{ t('about.storyParagraph2') }}
                </p>
                <NuxtLink
                    to="/about"
                    class="link w-fit"
                >
                    {{ t('home.missionLink') }}
                </NuxtLink>
            </div>
        </section>

        <!-- Contribute -->
        <section class="page-section bg-primary py-14">
            <div class="page-container-narrow flex flex-col items-center gap-4 text-center">
                <h2 class="text-2xl font-bold text-primary-text-inverted landscape:text-3xl">
                    {{ t('home.contributeHeading') }}
                </h2>
                <p class="text-lg text-primary-text-inverted/90">
                    {{ t('home.contributeBody') }}
                </p>
                <NuxtLink
                    to="/submit"
                    data-testid="home-contribute-cta"
                    class="btn btn-on-primary mt-2 text-lg"
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
import { useHead } from '#imports'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { BROWSE_CATEGORIES, DIRECTORY_STATS, TOP_PREFECTURES, type PrefectureEntry } from '~/utils/homeDirectory'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes'

const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()

useHead({ title: computed(() => t('home.heroHeading')) })

const heroIllustration = '/illustrations/characters-together-welcomescreen.svg'

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

// Framed as approximate so they do not read as a live counter; see DIRECTORY_STATS.
const stats = computed(() => [
    t('home.statFacilities', { n: DIRECTORY_STATS.facilities }),
    t('home.statProfessionals', { n: DIRECTORY_STATS.professionals }),
    t('home.statLanguages', { n: DIRECTORY_STATS.languages })
])
</script>
