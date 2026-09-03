<template>
    <!--
        action/method are not decoration. The homepage is prerendered, so this form is
        in the HTML and clickable before Vue hydrates — and it is the primary control on
        the page. Without them an early submit fired a native GET to "/" and lost the
        user's selection. With them the same submit lands on /search with the filters
        applied, which is also what happens with JavaScript disabled.
    -->
    <form
        action="/search"
        method="get"
        data-testid="home-search-entry"
        class="w-full max-w-xl bg-secondary-bg border border-accent-bg rounded-2xl shadow-lg
               p-5 flex flex-col gap-3"
        @submit.prevent="submitSearch"
    >
        <div class="flex flex-col gap-1.5 flex-1 min-w-0">
            <label
                for="home-specialty"
                class="text-sm font-semibold text-primary-text"
            >{{ t('home.searchSpecialtyLabel') }}</label>
            <select
                id="home-specialty"
                name="specialty"
                data-testid="home-specialty"
                class="h-12 px-3 rounded-lg border border-primary-text-muted bg-secondary-bg
                       text-primary-text w-full"
            >
                <option value="">
                    {{ t('searchBar.allSpecialties') }}
                </option>
                <option
                    v-for="option in specialtyOptions"
                    :key="option.code"
                    :value="option.code"
                >
                    {{ option.displayText }}
                </option>
            </select>
        </div>

        <div class="flex flex-col gap-1.5 flex-1 min-w-0">
            <label
                for="home-language"
                class="text-sm font-semibold text-primary-text"
            >{{ t('home.searchLanguageLabel') }}</label>
            <select
                id="home-language"
                name="language"
                data-testid="home-language"
                class="h-12 px-3 rounded-lg border border-primary-text-muted bg-secondary-bg
                       text-primary-text w-full"
            >
                <option value="">
                    {{ t('home.searchAnyLanguage') }}
                </option>
                <option
                    v-for="option in languageOptions"
                    :key="option.code"
                    :value="option.code"
                >
                    {{ option.simpleText }}
                </option>
            </select>
        </div>

        <div class="flex flex-col gap-1.5 flex-1 min-w-0">
            <label
                for="home-area"
                class="text-sm font-semibold text-primary-text"
            >{{ t('home.searchAreaLabel') }}</label>
            <select
                id="home-area"
                name="prefecture"
                data-testid="home-area"
                class="h-12 px-3 rounded-lg border border-primary-text-muted bg-secondary-bg
                       text-primary-text w-full"
            >
                <option value="">
                    {{ t('home.searchAnyArea') }}
                </option>
                <option
                    v-for="prefecture in prefectures"
                    :key="prefecture.name"
                    :value="prefecture.name"
                >
                    {{ prefectureLabel(prefecture) }} ({{ prefecture.approximateFacilities }})
                </option>
            </select>
        </div>

        <button
            type="submit"
            data-testid="home-search-submit"
            class="h-12 mt-1 w-full rounded-lg bg-primary hover:bg-primary-hover transition-colors
                   text-primary-text-inverted font-bold
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            {{ t('home.searchSubmit') }}
        </button>
    </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#imports'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { localeDisplayOptions } from '~/stores/localeStore'
import { ALL_PREFECTURES, SEARCHABLE_LANGUAGES, type PrefectureEntry } from '~/utils/homeDirectory'

const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()

const prefectures = ALL_PREFECTURES

/**
 * Compare against vue-i18n's active locale, not localeStore. localeStore.activeLocale
 * only updates when someone uses the language picker, so on a direct load carrying the
 * i18n_redirected cookie the page renders Japanese while the store still says en-US.
 * Note i18n uses "ja-JP" while the gql Locale enum uses "ja_JP".
 */
function prefectureLabel(prefecture: PrefectureEntry) {
    return locale.value === 'ja-JP' ? prefecture.nameJa : prefecture.name
}

/*
 * Both lists come from static enums, so this form costs no API call. The location
 * list is prefectures rather than cities on purpose: city names are not normalised
 * upstream ("Chuo Ward" and "Chuo City" are the same place), which would put two
 * entries for one location in front of the user.
 */
const specialtyOptions = computed(() => specialtiesStore.specialtyDisplayOptions)

const languageOptions = computed(() =>
    SEARCHABLE_LANGUAGES
        .map(code => localeDisplayOptions.find(option => option.code === code))
        .filter((option): option is NonNullable<typeof option> => !!option))

/*
 * Read the selections off the form rather than from refs.
 *
 * With v-model, a value chosen before hydration was wiped the moment Vue hydrated
 * and reset each <select> from its own (empty) reactive state — the user's choice
 * silently vanished and the search ran unfiltered. The form element is the single
 * source of truth for both the JS path and the no-JS path, so there is nothing left
 * to clobber.
 */
function submitSearch(event: Event) {
    const form = event.target as HTMLFormElement
    const query: Record<string, string> = {}

    for (const [key, value] of new FormData(form).entries()) {
        if (typeof value === 'string' && value !== '') {
            query[key] = value
        }
    }

    void navigateTo({ path: '/search', query })
}
</script>
