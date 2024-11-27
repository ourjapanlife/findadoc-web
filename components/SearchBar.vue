<template>
    <div class="flex flex-0 max-w-4xl">
        <div
            id="search-fields"
            class="grid-cols-3 mx-4"
            :class="{ hidden: route.path !== '/' }"
        >
            <div class="search-specialty col-span-1 inline-block w-1/3 py-4">
                <select
                    v-model="selectedSpecialty"
                    class="rounded-l-full rounded-r-none w-full px-1 border-2 border-primary/60
                    py-1.5 drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ $t('searchBar.selectSpecialty') }}
                    </option>
                    <option
                        v-for="(specialty) in specialtyDropdownOptions"
                        :key="specialty.code"
                        :value="specialty.code"
                    >
                        {{ specialty.displayText }}
                    </option>
                </select>
            </div>
            <div class="search-location col-span-1 inline-block w-1/3 py-4">
                <select
                    v-model="selectedLocation"
                    class="w-full px-1 border-y-2 border-primary/60 py-1.5 drop-shadow-md
                        text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ $t('searchBar.selectLocation') }}
                    </option>
                    <option>{{ placeHolderTextDisplay }}</option>
                    <option
                        v-for="(cityDetails) in citySearchBarDisplayText"
                        :key="cityDetails.cityDisplayText"
                        :value="cityDetails.cityDisplayText"
                    >
                        {{ cityDetails.cityDisplayText }}: ({{ cityDetails.cityOccurrenceCount }})
                    </option>
                </select>
            </div>
            <div class="search-language col-span-1 inline-block w-1/3 py-4">
                <select
                    v-model="selectedLanguage"
                    class="rounded-r-full rounded-l-none w-full px-1 border-2 border-primary/60 py-1.5
                        drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                    data-testid="search-bar-language"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ $t('searchBar.selectLanguage') }}
                    </option>
                    <option
                        v-for="(language) in languageDropdownOptions"
                        :key="language.code"
                        :value="language.code"
                    >
                        {{ language.simpleText }}
                    </option>
                </select>
            </div>
        </div>
        <div
            id="search-button"
            class="flex items-center"
            :class="{ hidden: route.path !== '/' }"
        >
            <button
                id="searchButton"
                class="flex flex-0 flex-row rounded-full bg-primary w-28 pl-1 pr-2 py-2 text-sm align-middle justify-center
                    hover:bg-primary-hover transition-all"
                data-testid="search-button"
                @click="search"
            >
                <SVGSearchIcon
                    role="img"
                    alt="search icon"
                    title="search icon"
                    class="search-icon w-5 h-5 mr-1 fill-primary-text-inverted"
                />
                <span class="self-center text-primary-text-inverted">{{ $t('searchBar.search') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import SVGSearchIcon from '~/assets/icons/search-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocationsStore } from '~/stores/locationsStore.js'
import { useSpecialtiesStore, type SpecialtyDisplayOption } from '~/stores/specialtiesStore.js'
import type { Locale, Specialty } from '~/typedefs/gqlTypes.js'
import { useLocaleStore, type LocaleDisplay } from '~/stores/localeStore.js'

const localeStore = useLocaleStore()
const locationsStore = useLocationsStore()
const searchResultsStore = useSearchResultsStore()
const specialtiesStore = useSpecialtiesStore()
const route = useRoute()

await locationsStore.fetchLocations()

const languageOptions = localeStore.localeDisplayOptions
const languageOptionsWithPlaceHolder = setSearchBarLanguageDropdownOptions()

const locationDropdownOptions: Ref<string[]> = ref(locationsStore.citiesDisplayOptions)
const specialtyDropdownOptions: Ref<SpecialtyDisplayOption[]> = ref(specialtiesStore.specialtyDisplayOptions)
const languageDropdownOptions: Ref<LocaleDisplay[]> = ref(languageOptionsWithPlaceHolder)

const selectedSpecialty: Ref<Specialty | string> = ref('')
const selectedLocation: Ref<string> = ref('')
const selectedLanguage: Ref<Locale | string> = ref('')

const placeHolderTextDisplay = '----Any----'

function setSearchBarLanguageDropdownOptions() {
    // This will remove any codes code that is falsy
    const localeOptionsWithLocaleCodes = languageOptions.filter(locale => locale.code)
    // This will add the placeholder text
    localeOptionsWithLocaleCodes
        .unshift({ code: '', simpleText: placeHolderTextDisplay, displayText: placeHolderTextDisplay })

    return localeOptionsWithLocaleCodes
}

interface CityDisplayItems {
    [cityName: string]: {
        cityDisplayText: string
        cityOccurrenceCount: number
    }
}
function createCityDisplayText() {
    const cityDisplayTextObject: CityDisplayItems = {}

    const cities = locationsStore.citiesDisplayOptions

    cities.forEach(city => {
        if (city === placeHolderTextDisplay) {
            return
        }
        if (cityDisplayTextObject[city]) {
            cityDisplayTextObject[city].cityOccurrenceCount += 1
        } else {
            cityDisplayTextObject[city] = {
                cityDisplayText: city,
                cityOccurrenceCount: 1
            }
        }
    })

    return cityDisplayTextObject
}

const citySearchBarDisplayText: CityDisplayItems = createCityDisplayText()

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
