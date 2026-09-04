<template>
    <div
        data-testid="search-filter-bar"
        class="sticky top-16 z-20 w-full border-b border-accent-bg bg-primary-bg/95 backdrop-blur-md"
    >
        <div class="page-container flex flex-col gap-3 px-4 py-3 landscape:px-6">
            <!-- Summary row: count and controls side by side; on narrow screens the count drops below. -->
            <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <p
                    data-testid="search-result-count"
                    aria-live="polite"
                    class="m-0 min-w-0 text-sm font-medium text-primary-text-muted portrait:order-last portrait:basis-full"
                >
                    {{ countText }}
                </p>
                <div class="flex shrink-0 items-center gap-2 portrait:ml-auto">
                    <button
                        type="button"
                        data-testid="search-filters-toggle"
                        :aria-expanded="filtersOpen"
                        aria-controls="search-filters"
                        class="btn btn-secondary btn-sm landscape:hidden"
                        @click="filtersOpen = !filtersOpen"
                    >
                        <SVGFiltersIcon
                            class="h-4 w-4 fill-current"
                            aria-hidden="true"
                        />
                        {{ t('search.filters') }}
                        <span
                            v-if="activeFilterCount"
                            class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5
                                   text-xs font-bold text-primary-text-inverted"
                        >{{ activeFilterCount }}</span>
                    </button>
                    <button
                        type="button"
                        data-testid="search-map-toggle"
                        :aria-pressed="showMap"
                        class="btn btn-secondary btn-sm"
                        @click="emit('update:showMap', !showMap)"
                    >
                        <SVGMapPinIcon
                            class="h-4 w-4 stroke-current"
                            aria-hidden="true"
                        />
                        {{ showMap ? t('search.hideMap') : t('search.showMap') }}
                    </button>
                </div>
            </div>

            <!-- Filters: always visible in landscape, collapsible in portrait -->
            <form
                id="search-filters"
                data-testid="search-filters"
                :class="filtersOpen ? 'grid' : 'hidden landscape:grid'"
                class="grid-cols-1 gap-3 landscape:grid-cols-[1fr_1fr_1fr_auto] landscape:items-end"
                @submit.prevent
            >
                <div class="min-w-0">
                    <label
                        for="search-specialty"
                        class="field-label"
                    >{{ t('home.searchSpecialtyLabel') }}</label>
                    <select
                        id="search-specialty"
                        v-model="specialty"
                        data-testid="search-specialty"
                        class="field"
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

                <div class="min-w-0">
                    <label
                        for="search-language"
                        class="field-label"
                    >{{ t('home.searchLanguageLabel') }}</label>
                    <select
                        id="search-language"
                        v-model="language"
                        data-testid="search-language"
                        class="field"
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

                <div class="min-w-0">
                    <label
                        for="search-area"
                        class="field-label"
                    >{{ t('home.searchAreaLabel') }}</label>
                    <select
                        id="search-area"
                        v-model="prefecture"
                        data-testid="search-area"
                        class="field"
                    >
                        <option value="">
                            {{ t('home.searchAnyArea') }}
                        </option>
                        <option
                            v-for="entry in prefectures"
                            :key="entry.name"
                            :value="entry.name"
                        >
                            {{ prefectureLabel(entry) }} ({{ entry.approximateFacilities }})
                        </option>
                    </select>
                </div>

                <button
                    type="button"
                    data-testid="search-clear-filters"
                    class="btn btn-ghost h-12 px-4"
                    :class="hasFilters ? '' : 'invisible portrait:hidden'"
                    :tabindex="hasFilters ? undefined : -1"
                    @click="searchResultsStore.clearFilters()"
                >
                    {{ t('search.clearFilters') }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGFiltersIcon from '~/assets/icons/equalizer-icon.svg'
import SVGMapPinIcon from '~/assets/icons/map-pin-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { localeDisplayOptions } from '~/stores/localeStore'
import { ALL_PREFECTURES, SEARCHABLE_LANGUAGES, type PrefectureEntry } from '~/utils/homeDirectory'
import { hasActiveFilters } from '~/utils/searchDirectory'
import type { Locale, Specialty } from '~/typedefs/gqlTypes'

defineProps<{ showMap: boolean }>()
const emit = defineEmits<{ (e: 'update:showMap', value: boolean): void }>()

const { t, locale } = useI18n()
const searchResultsStore = useSearchResultsStore()
const specialtiesStore = useSpecialtiesStore()

const filtersOpen = ref(false)

/*
 * The same three controls as the homepage entry form, bound straight to the store. Results
 * are derived from the filters, so a change applies as soon as it is made — no Search button.
 * The area list is prefectures, not cities: city names are not normalised upstream.
 */
const specialty = computed({
    get: () => searchResultsStore.selectedSpecialties?.[0] ?? '',
    set: value => {
        searchResultsStore.selectedSpecialties = value ? [value as Specialty] : undefined
    }
})

const language = computed({
    get: () => searchResultsStore.selectedLanguages?.[0] ?? '',
    set: value => {
        searchResultsStore.selectedLanguages = value ? [value as Locale] : undefined
    }
})

const prefecture = computed({
    get: () => searchResultsStore.selectedPrefecture ?? '',
    set: value => {
        searchResultsStore.selectedPrefecture = value || undefined
    }
})

const specialtyOptions = computed(() => specialtiesStore.specialtyDisplayOptions)

const languageOptions = computed(() =>
    SEARCHABLE_LANGUAGES
        .map(code => localeDisplayOptions.find(option => option.code === code))
        .filter((option): option is NonNullable<typeof option> => !!option))

const prefectures = ALL_PREFECTURES

function prefectureLabel(entry: PrefectureEntry) {
    return locale.value === 'ja-JP' ? entry.nameJa : entry.name
}

const hasFilters = computed(() => hasActiveFilters(searchResultsStore.filters))

const activeFilterCount = computed(() =>
    [specialty.value, language.value, prefecture.value, searchResultsStore.selectedCity].filter(Boolean).length)

const countText = computed(() => {
    if (searchResultsStore.isLoading) return t('search.loading')
    if (searchResultsStore.hasLoadError) return ''
    return t('searchBar.resultsFound', searchResultsStore.totalResults)
})
</script>
