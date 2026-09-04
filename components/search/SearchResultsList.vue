<template>
    <section
        :aria-label="t('search.resultsRegion')"
        :aria-busy="searchResultsStore.isLoading"
        class="flex flex-col gap-4"
    >
        <!-- Failed load -->
        <div
            v-if="searchResultsStore.hasLoadError"
            data-testid="search-load-error"
            role="alert"
            class="card flex flex-col items-start gap-4 p-6"
        >
            <p class="m-0 text-primary-text">
                {{ t('search.loadError') }}
            </p>
            <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="searchResultsStore.reloadDirectory()"
            >
                {{ t('search.retry') }}
            </button>
        </div>

        <!-- Loading -->
        <ul
            v-else-if="searchResultsStore.isLoading"
            data-testid="search-skeleton"
            class="m-0 flex list-none flex-col gap-4 p-0"
            aria-hidden="true"
        >
            <li
                v-for="index in 4"
                :key="index"
                class="card flex flex-col gap-3 p-5"
            >
                <div class="skeleton h-5 w-2/3" />
                <div class="skeleton h-4 w-1/3" />
                <div class="flex gap-2">
                    <div class="skeleton h-7 w-20 rounded-full" />
                    <div class="skeleton h-7 w-16 rounded-full" />
                </div>
                <div class="skeleton h-4 w-1/2" />
            </li>
        </ul>

        <!-- Nothing matched -->
        <div
            v-else-if="!searchResultsStore.totalResults"
            data-testid="search-empty"
            class="card flex flex-col items-center gap-4 p-8 text-center"
        >
            <!-- Foreground shapes are currentColor; the backdrop blob follows the accent token. -->
            <SVGNoSearchResults
                class="h-20 w-auto text-primary"
                aria-hidden="true"
            />
            <div class="flex flex-col gap-1">
                <p class="m-0 text-lg font-semibold text-primary-text">
                    {{ t('searchResultsList.noResults') }}
                </p>
                <p class="m-0 text-primary-text-muted">
                    {{ t('searchResultsList.noResultsSubtext') }}
                </p>
            </div>
            <button
                v-if="hasFilters"
                type="button"
                class="btn btn-secondary btn-sm"
                @click="searchResultsStore.clearFilters()"
            >
                {{ t('search.clearFilters') }}
            </button>
        </div>

        <!-- Results -->
        <template v-else>
            <ul
                data-testid="search-results-list"
                class="m-0 flex list-none flex-col gap-4 p-0"
            >
                <li
                    v-for="(result, index) in searchResultsStore.paginatedResults"
                    :key="result.id"
                    :data-testid="`search-result-list-item-${index}`"
                >
                    <SearchResultCard
                        :result="result"
                        :active="searchResultsStore.activeFacilityId === result.id"
                    />
                </li>
            </ul>

            <div
                v-if="searchResultsStore.hasMore"
                class="flex flex-col items-center gap-2 py-2"
            >
                <button
                    type="button"
                    data-testid="load-more-button"
                    class="btn btn-secondary"
                    @click="handleLoadMore"
                >
                    {{ loadMoreLabel }}
                </button>
            </div>
        </template>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGNoSearchResults from '~/assets/icons/no-search-results-graphic.svg'
import SearchResultCard from '~/components/search/SearchResultCard.vue'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { useUmami } from '~/composables/useUmamiTracking'
import { hasActiveFilters } from '~/utils/searchDirectory'

const { t } = useI18n()
const searchResultsStore = useSearchResultsStore()
const { track } = useUmami()

const hasFilters = computed(() => hasActiveFilters(searchResultsStore.filters))

const remainingResults = computed(() =>
    searchResultsStore.totalResults - searchResultsStore.paginatedResults.length)

/*
 * One interpolated string, not three fragments glued together: "load more" + count +
 * "remaining" only reads correctly in English, and put the count in the wrong place in
 * Japanese and Russian.
 */
const loadMoreLabel = computed(() => t('searchResultsList.loadMoreCount', { n: remainingResults.value }))

function handleLoadMore() {
    searchResultsStore.loadMore()

    track('Load More Results', {
        currentCount: searchResultsStore.paginatedResults.length,
        totalCount: searchResultsStore.totalResults
    })
}
</script>
