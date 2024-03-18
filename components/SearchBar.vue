<template>
    <div class="flex flex-0 max-w-4xl">
        <div id="search-fields" class="grid-cols-3 mx-4">
            <div class="search-specialty col-span-1 inline-block w-1/3 py-4">
                <select v-model="selectedSpecialty" class="rounded-l-full rounded-r-none w-full px-1 border-2 border-primary/60
                    py-1.5 drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all">
                    <option value="" class="text-primary-text-muted hidden" disabled selected>
                        {{ $t('searchBar.selectSpecialty') }}
                    </option>
                    <option :key="specialty.code" :value="specialty.code"
                        v-for="(specialty, index) in specialtyDropdownOptions">
                        {{ specialty.displayText }}
                    </option>
                </select>
            </div>
            <div class="search-location col-span-1 inline-block w-1/3 py-4">
                <select v-model="selectedLocation" class="w-full px-1 border-y-2 border-primary/60 py-1.5 drop-shadow-md
                        text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all">
                    <option value="" class="text-primary-text-muted hidden" disabled selected>
                        {{ $t('searchBar.selectLocation') }}
                    </option>
                    <option :key="location" :value="location" v-for="(location, index) in locationDropdownOptions">
                        {{ location }}
                    </option>
                </select>
            </div>
            <div class="search-language col-span-1 inline-block w-1/3 py-4">
                <select v-model="selectedLanguage" class="rounded-r-full rounded-l-none w-full px-1 border-2 border-primary/60 py-1.5
                        drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                    data-testid="search-bar-language">
                    <option value="" class="text-primary-text-muted hidden" disabled selected>
                        {{ $t('searchBar.selectLanguage') }}
                    </option>
                    <option :key="language.code" :value="language.code" v-for="(language, index) in languageDropdownOptions">
                        {{ language.simpleText }}
                    </option>
                </select>
            </div>
        </div>
        <div id="search-button" class="flex items-center">
            <button id="searchButton" class="flex flex-0 flex-row rounded-full bg-primary w-28 pl-1 pr-2 py-2 text-sm align-middle justify-center
                    hover:bg-primary-hover transition-all" @click="search" data-testid="search-button">
                <svg role="img" alt="search icon" title="search icon"
                    class="search-icon w-5 h-5 mr-1 fill-primary-text-inverted">
                    <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                </svg>
                <span class="self-center text-primary-text-inverted">{{ $t('searchBar.search') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watchEffect } from 'vue'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocationsStore } from '~/stores/locationsStore.js'
import { useSpecialtiesStore, SpecialtyDisplayOption } from '~/stores/specialtiesStore.js'
import { Locale, Specialty } from "~/typedefs/gqlTypes.js"
import { useLocaleStore, LocaleDisplay } from '~/stores/localeStore.js'

const localeStore = useLocaleStore()
const locationsStore = useLocationsStore()
const searchResultsStore = useSearchResultsStore()
const specialtiesStore = useSpecialtiesStore()

await locationsStore.fetchLocations()

const languageOptions = [{
    code: '',
    simpleText: '----Any----',
    displayText: '----Any----'
}, ...localeStore.mvpLocaleDisplayOptions]

const locationDropdownOptions: Ref<string[]> = ref(locationsStore.citiesDisplayOptions)
const specialtyDropdownOptions: Ref<SpecialtyDisplayOption[]> = ref(specialtiesStore.specialtyDisplayOptions)
const languageDropdownOptions: Ref<LocaleDisplay[]> = ref(languageOptions)

const selectedSpecialty: Ref<Specialty | String> = ref('')
const selectedLocation: Ref<string> = ref('')
const selectedLanguage: Ref<Locale | String> = ref('')

watchEffect(() => {
    locationDropdownOptions.value = locationsStore.citiesDisplayOptions
})

async function search() {
    const blankRemovedLocation = selectedLocation.value == '----Any----' ? '' : selectedLocation.value
    const blankRemovedSpecialty = selectedSpecialty.value == '----Any----' ? undefined : selectedSpecialty.value as Specialty
    const blankRemovedLanguage = selectedLanguage.value == '----Any----' ? undefined : selectedLanguage.value as Locale

    await searchResultsStore.search(blankRemovedLocation, blankRemovedSpecialty, blankRemovedLanguage)
}
</script>
