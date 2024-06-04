<template>
    <div class="h-full flex flex-col">
        <div class="results-header flex flex-row ml-9 mr-5 mb-6 pt-5">
            <span class="flex-1 w-1/2 font-bold self-center">
                {{ $t('searchResultsList.doctorsNearby') }}
            </span>
            <button role="button" aria="filters" class="filters py-1 px-2 border border-primary/40 rounded-xl flex flex-row flex-0
                group hover:bg-primary/50 hover:border-primary/10 hover:transition-all">
                <SVGHamburgerListIcon role="img" alt="hamburger menu icon" title="hamburger list icon"
                    class="fill-primary/50 h-5 w-5 self-center group-hover:fill-primary-text-inverted/50" />
                <span class="text-primary-text/50 pl-1 font-bold self-center group-hover:text-primary-text-inverted/50">
                    {{ $t('searchResultsList.filters') }}
                </span>
            </button>
        </div>
        <div v-if="loadingStore.isLoading">
            <div class="h-full flex flex-col justify-center items-center w-full">
                <div class="flex justify-center align-middle">
                    <div class="flex text-primary self-center text-4xl">Loading</div>
                    <SVGLoadingIcon data-testid='svg-loading-icon' role="img" alt="loading animation"
                        title="loading animation" class="flex h-28" />
                </div>
            </div>
        </div>
        <div v-else-if="hasResults">
            <div id="searchResults" class="flex flex-col landscape:overflow-y-scroll h-full">
                <div @click="resultsStore.setActiveSearchResult(searchResult.professional.id)" :key="index"
                    v-for="(searchResult, index) in resultsStore.searchResultsList" class="results-list flex flex-col">
                    <div class="flex-1 h-24 w-6/8 border-b-2 border-primary/20 p-3
                        hover:border-transparent hover:bg-primary/5 transition-all hover:cursor-pointer">
                        <SearchResultsListItem
                            :name="`${searchResult.professional.names[0].firstName} ${searchResult.professional.names[0].lastName}`"
                            :degrees="searchResult.professional.degrees"
                            :facility-name="localeStore.locale.code == Locale.JaJp ? searchResult.facilities[0]?.nameJa : searchResult.facilities[0]?.nameEn"
                            :specialties="searchResult.professional.specialties"
                            :spoken-languages="searchResult.professional.spokenLanguages" />
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="h-full flex flex-col">
                <SVGNoSearchResults class="p-12" />
                <span class="text-primary-text pl-1 font-bold self-center group-hover:text-primary-text-inverted/50">{{
                    $t('searchResultsList.noResults') }}</span>
                <span class="text-primary-text self-center">{{
                    $t('searchResultsList.noResultsSubtext') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGHamburgerListIcon from '~/assets/icons/hamburger-list-icon.svg'
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import SVGNoSearchResults from '~/assets/icons/no-search-results-graphic.svg'
import { computed, onMounted } from 'vue';
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useLocaleStore } from '../stores/localeStore'
import { useLoadingStore } from '../stores/loadingStore'
import { Locale } from '~/typedefs/gqlTypes.js';
import noSearchResultsGraphic from '@/assets/icons/no-search-results-graphic.svg'
const resultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const loadingStore = useLoadingStore()

onMounted(() => {
    resultsStore.search()
})

const hasResults = computed(() => resultsStore.searchResultsList.length > 0)

</script>
