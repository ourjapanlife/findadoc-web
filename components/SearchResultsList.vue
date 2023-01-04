<template>
    <div class="results-header flex flex-row ml-9 mr-5 mb-6 pt-5">
        <span class="flex-1 w-1/2 font-bold self-center">
            Doctors Nearby
        </span>
        <div class="filters py-1 px-2 border border-solid border-primary/40 rounded-xl flex flex-row flex-0">
            <svg role="img" alt="hamburger menu icon" title="hamburger list icon"
                class="hamburger-list-icon fill-primary h-10 w-10">
                <use xlink:href="../assets/images/hamburger-list-icon.svg#hamburger-list-icon-svg" />
            </svg>
            <span class="pl-1 font-bold self-center">Filters</span>
        </div>
    </div>
    <div :key="index" v-for="(searchResult, index) in searchResults" class="results-list flex flex-col">
        <div class="flex-1 h-24 w-6/8 border-b-2 border-primary/40 p-3">
            <SearchResult v-model:name="searchResult.name" v-model:facilityName="searchResult.facilityName"
                v-model:specialty="searchResult.specialty" v-model:spokenLanguages="searchResult.spokenLanguages" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const defaultResults = [{
    name: 'test person 1',
    specialty: 'Practitioner',
    facilityName: 'LifeSavers',
    spokenLanguages: ['japanese', 'english']
}, {
    name: 'test person 2',
    specialty: 'Psychiatrist',
    facilityName: 'Rest Assured',
    spokenLanguages: ['english']
}, {
    name: 'test person 3',
    specialty: 'Oncologist',
    facilityName: 'Bring me back to life',
    spokenLanguages: ['japanese']
}]

const searchResults = ref(defaultResults)

</script>
