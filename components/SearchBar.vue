<template>
    <div class="flex flex-0 max-w-4xl">
        <div
            id="search-fields"
            class="grid-cols-3 mx-4"
        >
            <div class="search-specialty col-span-1 inline-block w-1/3 py-4">
                <select
                    v-model="searchResultsStore.selectedSpecialties"
                    class="rounded-l-full rounded-r-none w-full px-1 border-2 border-primary/60
                    py-1.5 drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ t('searchBar.selectSpecialty') }}
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
                    v-model="searchResultsStore.selectedCity"
                    class="w-full px-1 border-y-2 border-primary/60 py-1.5 drop-shadow-md
                        text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ t('searchBar.selectLocation') }}
                    </option>
                    <option>{{ placeHolderTextDisplay }}</option>
                    <option
                        v-for="(cityDetails) in locationDropdownOptions"
                        :key="cityDetails.cityDisplayText"
                        :value="cityDetails.cityDisplayText"
                    >
                        {{ cityDetails.cityDisplayText }}: ({{ cityDetails.cityOccurrenceCount }})
                    </option>
                </select>
            </div>
            <div class="search-language col-span-1 inline-block w-1/3 py-4">
                <select
                    v-model="searchResultsStore.selectedLanguages"
                    class="rounded-r-full rounded-l-none w-full px-1 border-2 border-primary/60
                        py-1.5 drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                    data-testid="search-bar-language"
                >
                    <option
                        value=""
                        class="text-primary-text-muted hidden"
                        disabled
                        selected
                    >
                        {{ t('searchBar.selectLanguage') }}
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
                <span class="self-center text-primary-text-inverted">{{ t('searchBar.search') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import SVGSearchIcon from '~/assets/icons/search-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocationsStore } from '~/stores/locationsStore.js'
import { useSpecialtiesStore, type SpecialtyDisplayOption } from '~/stores/specialtiesStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'

const { t } = useI18n()

const localeStore = useLocaleStore()
const locationsStore = useLocationsStore()
const searchResultsStore = useSearchResultsStore()
const specialtiesStore = useSpecialtiesStore()

const languageOptions = localeStore.localeDisplayOptions
const languageOptionsWithPlaceHolder = setSearchBarLanguageDropdownOptions()

const locationDropdownOptions: ComputedRef<CityDisplayItems> = computed(() =>
    createLocationDropdownOptions(locationsStore.citiesDisplayOptions))
const specialtyDropdownOptions: Ref<SpecialtyDisplayOption[]> = ref(specialtiesStore.specialtyDisplayOptions)
const languageDropdownOptions: Ref<LocaleDisplay[]> = ref(languageOptionsWithPlaceHolder)

const placeHolderTextDisplay = '----Any----'

onMounted(async () => {
    // Initialize locations when component is mounted. The dropdown options are reactive, so they will update automatically
    await locationsStore.fetchLocations()
})

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
function createLocationDropdownOptions(cities: string[]) {
    const cityDisplayTextObject: CityDisplayItems = {}

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

async function search() {
    await searchResultsStore.search()
}
</script>
