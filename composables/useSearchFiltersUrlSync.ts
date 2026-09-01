import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'
import {
    buildSearchFilterQuery,
    getSearchFiltersFromStore,
    readSearchFiltersFromQuery,
    searchFiltersEqual
} from '~/utils/searchFiltersUrl.js'

type SearchFiltersUrlSyncOptions = {
    observeHistory?: boolean
}

export function useSearchFiltersUrlSync(options: SearchFiltersUrlSyncOptions = {}) {
    const route = useRoute()
    const router = useRouter()
    const searchResultsStore = useSearchResultsStore()
    const specialtiesStore = useSpecialtiesStore()
    const localeStore = useLocaleStore()

    const urlFilters = computed(() => readSearchFiltersFromQuery(route.query, {
        specialtyCodes: specialtiesStore.specialtyDisplayOptions.map(option => option.code),
        languageCodes: localeStore.localeDisplayOptions.map(option => option.code)
    }))

    const activeFilters = computed(() => getSearchFiltersFromStore(
        searchResultsStore.selectedCity,
        searchResultsStore.selectedSpecialties,
        searchResultsStore.selectedLanguages
    ))

    const hasSearchFiltersInUrl = computed(() => Object.values(urlFilters.value)
        .some(filterValue => filterValue !== undefined))

    function applyFiltersFromUrl() {
        const filters = readSearchFiltersFromQuery(route.query, {
            specialtyCodes: specialtiesStore.specialtyDisplayOptions.map(option => option.code),
            languageCodes: localeStore.localeDisplayOptions.map(option => option.code)
        })

        searchResultsStore.selectedCity = filters.city
        searchResultsStore.selectedSpecialties = filters.specialty
            ? [filters.specialty]
            : []
        searchResultsStore.selectedLanguages = filters.language
            ? [filters.language]
            : []
    }

    async function syncUrlWithActiveFilters() {
        const nextQuery = buildSearchFilterQuery(route.query, activeFilters.value)
        const currentQuery = buildSearchFilterQuery(route.query, urlFilters.value)

        if (JSON.stringify(nextQuery) === JSON.stringify(currentQuery)) return

        await router.push({ query: nextQuery })
    }

    async function restoreFiltersFromHistory() {
        if (searchFiltersEqual(activeFilters.value, urlFilters.value)) return

        applyFiltersFromUrl()
        await searchResultsStore.search()
    }

    if (options.observeHistory !== false) {
        watch(() => route.query, () => {
            void restoreFiltersFromHistory()
        })
    }

    return {
        activeFilters,
        hasSearchFiltersInUrl,
        initializeFiltersFromUrl: applyFiltersFromUrl,
        restoreFiltersFromHistory,
        syncUrlWithActiveFilters
    }
}
