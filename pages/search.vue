<template>
    <div
        id="search-container"
        data-testid="search-page"
        class="flex w-full flex-col"
    >
        <h1 class="sr-only">
            {{ t('search.pageHeading') }}
        </h1>

        <SearchFilterBar v-model:show-map="showMap" />

        <div
            class="page-container flex flex-col gap-6 px-4 py-6 landscape:flex-row landscape:items-start
                   landscape:gap-8 landscape:px-6"
        >
            <!-- List first. The map is opt-in and sits beside the list in landscape, above it in portrait. -->
            <SearchMapPanel
                v-if="showMap"
                class="w-full landscape:order-last landscape:w-[42%] landscape:shrink-0"
                @select="openDetails"
                @deselect="closeDetails"
            />
            <SearchResultsList class="min-w-0 flex-1" />
        </div>

        <SearchDetailsPanel
            :open="!!searchResultsStore.activeFacility"
            @close="closeDetails"
        >
            <SearchResultDetails
                v-if="searchResultsStore.activeFacility"
                :facility="searchResultsStore.activeFacility"
            />
        </SearchDetailsPanel>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, type LocationQuery, type LocationQueryRaw } from 'vue-router'
import { useHead } from '#imports'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { buildSearchQuery, parseSearchQuery } from '~/utils/searchDirectory'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const searchResultsStore = useSearchResultsStore()

useHead({ title: computed(() => t('topNav.search')) })

const SHOW_MAP_STORAGE_KEY = 'search.showMap'
const showMap = ref(false)

/*
 * The URL is the source of truth for the search state: filters and the open facility both
 * live in the query string, so every state is linkable and Back/Forward move through them.
 * Two watchers keep the store and the URL in step; each checks for a real difference first,
 * so the pair cannot ping-pong.
 */
function sameList<T>(a: readonly T[] | undefined, b: readonly T[] | undefined): boolean {
    if (a === b) return true
    if (!a || !b) return !a?.length && !b?.length
    return a.length === b.length && a.every((value, index) => value === b[index])
}

/**
 * Writes only what actually differs. `parseSearchQuery` returns fresh arrays on every call, so
 * assigning them unconditionally made the store's `filters` computed look changed on any query
 * change at all — which reset pagination and re-fitted the map merely because a result was
 * opened or closed.
 */
function applyQuery(query: LocationQuery) {
    const state = parseSearchQuery(query)

    if (searchResultsStore.selectedCity !== state.city) {
        searchResultsStore.selectedCity = state.city
    }
    if (searchResultsStore.selectedPrefecture !== state.prefecture) {
        searchResultsStore.selectedPrefecture = state.prefecture
    }
    if (!sameList(searchResultsStore.selectedSpecialties, state.specialties)) {
        searchResultsStore.selectedSpecialties = state.specialties
    }
    if (!sameList(searchResultsStore.selectedLanguages, state.languages)) {
        searchResultsStore.selectedLanguages = state.languages
    }
    searchResultsStore.activeFacilityId = state.facilityId
}

function queryFromStore(): LocationQueryRaw {
    return buildSearchQuery({
        ...searchResultsStore.filters,
        facilityId: searchResultsStore.activeFacilityId
    })
}

function sameQuery(a: LocationQueryRaw, b: LocationQuery): boolean {
    const normalise = (query: LocationQueryRaw | LocationQuery) =>
        JSON.stringify(Object.entries(query)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
            .sort(([a1], [b1]) => a1.localeCompare(b1)))

    return normalise(a) === normalise(b)
}

// Seed the store before anything renders, so the first paint already reflects the link.
applyQuery(route.query)

watch(() => route.query, query => {
    if (!sameQuery(queryFromStore(), query)) {
        applyQuery(query)
    }
})

watch(queryFromStore, query => {
    if (!sameQuery(query, route.query)) {
        router.replace({ query })
    }
})

function openDetails(facilityId: string) {
    router.push({ query: { ...queryFromStore(), facility: facilityId } })
}

/**
 * Closing should feel like Back when the panel was opened from this page, and like a plain
 * close when the visitor arrived on a shared link. Vue Router records the previous URL in
 * history.state, which is enough to tell the two apart.
 */
function closeDetails() {
    if (!searchResultsStore.activeFacilityId) return

    /*
     * Back is only the right gesture when the previous entry is this page *without* a facility
     * open. If it carries its own ?facility=, going back reopens that one instead of closing,
     * which reads as the panel refusing to shut.
     */
    const previous = import.meta.client && typeof window.history.state?.back === 'string'
        ? window.history.state.back
        : ''
    const previousIsListView = previous.startsWith(route.path)
      && !new URLSearchParams(previous.split('?')[1] ?? '').has('facility')

    if (previousIsListView) {
        router.back()
        return
    }

    const { facility: _facility, ...rest } = queryFromStore()
    router.replace({ query: rest })
}

onMounted(() => {
    try {
        showMap.value = localStorage.getItem(SHOW_MAP_STORAGE_KEY) === 'true'
    } catch {
        // Storage may be unavailable; the map simply starts hidden.
    }

    searchResultsStore.loadDirectory()
})

watch(showMap, value => {
    try {
        localStorage.setItem(SHOW_MAP_STORAGE_KEY, String(value))
    } catch {
        // Same as above: a preference that cannot be stored is still honoured for this visit.
    }
})
</script>
