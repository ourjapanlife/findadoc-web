<template>
    <div class="flex flex-row flex-0 w-128">
        <div id="search-fields" class="grid-cols-3 mx-4">
            <div class="search-specialty col-span-1 inline-block w-1/3 py-4">
                <select class="font-bold rounded-l-full rounded-r-none w-full">
                    <option value=""></option>
                    <option :key="index" v-for="(specialty, index) in specialtyDropdownOptions">
                        {{ specialty.names[0] }}
                    </option>
                </select>
            </div>
            <div class="search-location col-span-1 inline-block w-1/3 py-4">
                <select class="font-bold rounded-none w-full">
                    <option value=""></option>
                    <option :key="index" v-for="(location, index) in locationDropdownOptions">
                        {{ location }}
                    </option>
                </select>
            </div>
            <div class="search-language col-span-1 inline-block w-1/3 py-4">
                <select class="font-bold rounded-r-full rounded-l-none w-full">
                    <option value=""></option>
                    <option :key="index" v-for="(language, index) in languageDropdownOptions">
                        {{ language }}
                    </option>
                </select>
            </div>
        </div>
        <div id="search-button" class="flex items-center">
            <button id="searchButton" class="flex flex-0 flex-row rounded-full bg-orange w-28 pl-1 pr-2 py-2 text-sm align-middle justify-center">
                <img alt="search icon" class="search-icon w-5 mr-1" src="@/assets/images/search-icon.svg" />
                <span class="self-center text-white">Search</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const specialtyMockData = [{
    id: 1,
    names: [{
        name: 'Dentist',
        locale: 'english'
    }]
}, {
    id: 2,
    names: [{
        name: 'Psychiatrist',
        locale: 'english'
    }]
}]
const locationMockData = ['Tokyo', 'Chiba', 'Saitama', 'Setagaya', 'Minato', 'Nagano', 'Kyoto', 'Osaka', 'Nara']
const languageMockData = ['English', 'Japanese']

const specialtyDropdownOptions = ref(specialtyMockData)
const locationDropdownOptions = ref(locationMockData)
const languageDropdownOptions = ref(languageMockData)

</script>
