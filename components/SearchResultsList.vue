<template>
    <div class="h-full">
        <div class="results-header flex flex-row ml-9 mr-5 mb-6 pt-5">
            <span class="flex-1 w-1/2 font-bold self-center">
                {{ $t('searchResultsList.doctorsNearby') }}
            </span>
            <button role="button" aria="filters" class="filters py-1 px-2 border border-primary/40 rounded-xl flex flex-row flex-0
                group hover:bg-primary hover:transition-all">
                <svg role="img" alt="hamburger menu icon" title="hamburger list icon"
                    class="hamburger-list-icon fill-primary h-5 w-5 self-center group-hover:fill-primary-text-inverted">
                    <use xlink:href="../assets/images/hamburger-list-icon.svg#hamburger-list-icon-svg" />
                </svg>
                <span class="pl-1 font-bold self-center group-hover:text-primary-text-inverted">{{ $t('searchResultsList.filters') }}</span>
            </button>
        </div>
        <div id="searchResults" class="flex flex-col overflow-y-scroll h-full">
            <div @click="store.setActiveSearchResult(searchResult.professional.id)" :key="index"
                v-for="(searchResult, index) in store.searchResultsList" class="results-list flex flex-col">
                <div class="flex-1 h-24 w-6/8 border-b-2 border-primary/20 p-3
                    hover:border-transparent hover:bg-primary/5 transition-all hover:cursor-pointer">
                    <SearchResultsListItem
                        :name="`${searchResult.professional.names[0].firstName}, ${searchResult.professional.names[0].lastName}`"
                        :facility-name="localeStore.locale?.code == Locale.EnUs ? searchResult.facilities[0].nameEn : searchResult.facilities[0].nameJa"
                        :specialties="searchResult.professional.specialties"
                        :spoken-languages="searchResult.professional.spokenLanguages" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useLocaleStore } from '../stores/localeStore'
import { Locale } from '~/typedefs/gqlTypes.js';

const store = useSearchResultsStore()
const localeStore = useLocaleStore()

</script>
