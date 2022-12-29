<template>
    <div class="results-header flex flex-row">
        <span class="flex-1 w-32">
            Doctors Nearby
        </span>
        <img alt="profile icon" class="profile-icon w-12" src="@/assets/images/profileIcon.svg" width="125"
            height="125" />
    </div>
    <div :key="index" v-for="(searchResult, index) in searchResults" class="flex flex-col">
        <div class="flex-1 h-24 w-32">
            <SearchResult v-model:name="searchResult.name" v-model:facilityName="searchResult.facilityName"
                v-model:specialty="searchResult.specialty" v-model:spokenLanguages="searchResult.spokenLanguages" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const defaultResults = [{
    name: 'test person',
    specialty: 'Practitioner',
    facilityName: 'LifeSavers',
    spokenLanguages: ['Japanese', 'English']
}]

const searchResults = ref(defaultResults)

return {
    searchResults
}
</script>
