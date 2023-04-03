<template>
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
            <span class="pl-1 font-bold self-center group-hover:text-primary-text-inverted">Filters</span>
        </button>
        <div :key="index" v-for="(searchResult, index) in searchResults" class="results-list flex flex-col">
            <div class="flex-1 h-24 w-6/8 border-b-2 border-primary/20 p-3
                hover:border-transparent hover:bg-primary/5 transition-all">
                <SearchResultsListItem :name="searchResult.healthcareProfessionalName"
                    :facility-name="searchResult.facilityName"
                    :specialty="searchResult.specialty"
                    :spoken-languages="searchResult.spokenLanguages" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import mockData from '~/test/mockData/facilityMockData.json'

const defaultResults = mockData.locations

const searchResults = ref(defaultResults)

</script>
