<template>
    <div class="results-header flex flex-row mx-5 mt-5 mb-6">
        <span class="flex-1 w-1/2 font-bold self-center">
            Doctors Nearby
        </span>
        <div class="filters py-1 px-2 border border-solid border-slate-600 rounded-xl flex flex-row flex-0">
            <img alt="hamburger menu icon" class="hamburger-icon" src="@/assets/images/hamburgerListIcon.svg" width="25"
                height="25" />
            <span class="pl-1 font-bold">Filters</span>
        </div>
    </div>
    <div :key="index" v-for="(searchResult, index) in searchResults" class="results-list flex flex-col">
        <div class="flex-1 h-24 w-6/8 border-b-2 p-3">
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