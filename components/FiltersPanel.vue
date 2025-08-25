<template>
    <div
        data-testid="filters-panel-container"
        class="flex w-full"
    >
        <!-- Filters panel -->
        <div
            class="flex flex-col justify-between w-full h-[80vh] pt-6 pb-2"
        >
            <!-- Search fields -->
            <div
                id="search-fields"
                class="grid-cols-3 mx-4"
            >
                <!-- Specialty dropdown -->
                <div class="search-specialty col-span-1 w-full py-4">
                    <select
                        v-model="selectedSpecialties"
                        class="w-full px-1 py-1.5 border-2 border-primary/60 rounded-md text-primary-text
                                    drop-shadow-md bg-primary-bg/10 transition-all"
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
                            :key="specialty.value"
                            :value="specialty.value"
                        >
                            {{ specialty.displayText }}
                        </option>
                    </select>
                </div>
                <!-- Location dropdown -->
                <div class="search-location col-span-2 py-4">
                    <select
                        v-model="selectedLocations"
                        class="w-full px-1 py-1.5 border-2 border-primary/60 rounded-md text-primary-text
                                    drop-shadow-md bg-primary-bg/10 transition-all"
                    >
                        <option
                            value=""
                            class="text-primary-text-muted hidden"
                            disabled
                            selected
                        >
                            {{ t('searchBar.selectLocation') }}
                        </option>
                        <option
                            v-for="(cityDetails) in locationDropdownOptions"
                            :key="cityDetails.value"
                            :value="cityDetails.value"
                        >
                            {{ cityDetails.displayText }}: ({{ cityDetails.cityOccurrenceCount }})
                        </option>
                    </select>
                </div>
                <!-- Language dropdown -->
                <div class="search-language col-span-1 w-full py-4">
                    <select
                        v-model="selectedLanguages"
                        class="w-full px-1 py-1.5 border-2 border-primary/60 rounded-md text-primary-text
                                    drop-shadow-md bg-primary-bg/10 transition-all"
                        data-testid="search-bar-language"
                    >
                        <option
                            v-for="(language) in languageDropdownOptions"
                            :key="language.value"
                            :value="language.value"
                        >
                            {{ language.displayText }}
                        </option>
                    </select>
                </div>
            </div>
            <!-- Search button -->
            <div
                id="search-button"
                class="flex items-center"
            >
                <button
                    id="searchButton"
                    class="flex flex-0 flex-row rounded-md
                                w-full mx-4 pl-1 pr-2 py-4 text-sm align-middle justify-center
                                bg-accent hover:bg-accent-hover transition-all"
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
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGSearchIcon from '~/assets/icons/search-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocationsStore } from '~/stores/locationsStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'
import { type Specialty, Locale } from '~/typedefs/gqlTypes.js'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'

const { t } = useI18n()

const localeStore = useLocaleStore()
const locationsStore = useLocationsStore()
const searchResultsStore = useSearchResultsStore()
const specialtiesStore = useSpecialtiesStore()
const bottomSheetStore = useBottomSheetStore()

const locationDropdownOptions: Ref<LocationDropdownOption[]> = ref([])
const specialtyDropdownOptions: Ref<DropdownOption[]> = ref([])
const languageDropdownOptions: Ref<DropdownOption[]> = ref([])

const selectedSpecialties: Ref<string> = ref('')
const selectedLocations: Ref<string> = ref('')
const selectedLanguages: Ref<string> = ref(localeStore.activeLocale.code)

interface DropdownOption {
    displayText: string
    value: string
}

interface LocationDropdownOption extends DropdownOption {
    cityOccurrenceCount: number
}

// -- Internal functions --

onMounted(async () => {
    // Initialize locations when component is mounted. The dropdown options are reactive, so they will update automatically
    await createLocationDropdownOptions()
    createLanguageDropdownOptions()
    createSpecialtyDropdownOptions()
})

function createLanguageDropdownOptions() {
    // This will remove any codes code that is falsy
    const dropdownOptions = localeStore.localeDisplayOptions.map(locale => ({
        displayText: locale.displayText,
        value: locale.code
    })) as DropdownOption[]

    // Remove any options that have a falsy code
    dropdownOptions.filter(locale => locale.value)

    languageDropdownOptions.value = dropdownOptions
}

function createSpecialtyDropdownOptions() {
    const dropdownOptions = specialtiesStore.specialtyDisplayOptions.map(specialty => ({
        displayText: specialty.displayText,
        value: specialty.code
    })) as DropdownOption[]

    // Add the "All" option to the top of the list
    dropdownOptions.unshift({ displayText: t('searchBar.allSpecialties'), value: '' })

    specialtyDropdownOptions.value = dropdownOptions
}

async function createLocationDropdownOptions(): Promise<void> {
    // Show an interim loading state while we fetch the locations
    locationDropdownOptions.value = [{ displayText: t('searchBar.selectLocation'), value: '', cityOccurrenceCount: 0 }]

    await locationsStore.fetchLocations()

    const localeStore = useLocaleStore()

    const allCities = localeStore.activeLocale.code === Locale.EnUs
        ? locationsStore.allCitiesEnglishList
        : locationsStore.allCitiesJapaneseList

    const newLocationDropdownOptions: LocationDropdownOption[] = []

    // Add the cities to the dropdown and add a count for each city
    allCities.forEach(city => {
        const matchingLocation = newLocationDropdownOptions.find(option => option.displayText === city)

        if (matchingLocation) {
            matchingLocation.cityOccurrenceCount += 1
        } else {
            newLocationDropdownOptions.push({ displayText: city, value: city, cityOccurrenceCount: 1 })
        }
    })

    // Add the "All" option to the top of the list
    newLocationDropdownOptions.unshift({ displayText: t('searchBar.allLocations'),
        value: '',
        cityOccurrenceCount: allCities.length })

    locationDropdownOptions.value = newLocationDropdownOptions
}

watch(selectedSpecialties, () => {
    // If the selected specialty is empty, clear the selected specialties
    searchResultsStore.selectedSpecialties = selectedSpecialties.value === ''
        ? []
        : [selectedSpecialties.value as Specialty]
})

watch(selectedLocations, () => {
    searchResultsStore.selectedCity = selectedLocations.value ? selectedLocations.value : undefined
})

watch(selectedLanguages, () => {
    searchResultsStore.selectedLanguages = selectedLanguages.value ? [selectedLanguages.value as Locale] : []
})

async function search() {
    await searchResultsStore.search()
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultsList)
}
</script>
