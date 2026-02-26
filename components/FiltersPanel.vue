<template>
    <!-- Filters panel -->
    <div
        class="flex flex-col w-full landscape:h-full portrait:max-h-[70svh] pt-6"
        data-testid="filters-panel-container"
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
            <div class="location-filters">
                <p class="w-full bg-primary/20 rounded px-4 py-1 mb-2 text-sm font-medium">
                    {{ t('searchBar.selectLocation') }}
                </p>
                <!-- REGION -->
                <div
                    v-for="region in regionDropdownOptions"
                    :key="region.value"
                    class="border-b border-primary/20 last:border-b-0"
                >
                    <div class="flex items-center justify-between py-2">
                        <!-- checkbox and label -->
                        <label
                            label="checkbox"
                            class="flex items-center gap-3 cursor-pointer"
                            @change="selectRegion(selectedRegion === region.value ? '' : region.value)"
                        >
                            <input
                                type="checkbox"
                                :checked="selectedRegion === region.value"
                                class="w-4 h-4 rounded"
                            >
                            <span> {{ region.displayText }} </span>
                        </label>
                        <!-- dropdown arrow -->
                        <button
                            class="p-1 hover:bg-primary-bg/20 rounded"
                            @click="togglePrefectureSection(region.value)"
                        >
                            <svg
                                class="w-4 h-4 text-primary-text transition-transform duration-200"
                                :class="{ 'rotate-180': openPrefectureSections[region.value] }"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>
                    <!-- prefecture dropdown -->
                    <div
                        v-if="selectedRegion === region.value"
                        class="py-2 px-3"
                    >
                        <div
                            v-for="prefecture in prefectureDropdownOptions"
                            :key="prefecture.value"
                            :value="prefecture.value"
                            class="border-b border-primary/20 last:border-b-0"
                        >
                            <div class="flex items-center justify-between py-2">
                                <!-- checkbox and label -->
                                <label
                                    label="checkbox"
                                    class="flex items-center gap-3 cursor-pointer"
                                    @change="selectPrefecture(selectedPrefecture=== prefecture.value ? '' : prefecture.value)"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="selectedPrefecture === prefecture.value"
                                        class="w-4 h-4 rounded"
                                    >
                                    <span> {{ prefecture.displayText }} </span>
                                </label>
                                <!-- dropdown arrow -->
                                <button
                                    class="p-1 hover:bg-primary-bg/20 rounded"
                                    @click="toggleCitySection(prefecture.value)"
                                >
                                    <svg
                                        class="w-4 h-4 text-primary-text transition-transform duration-200"
                                        :class="{ 'rotate-180': openCitySections[prefecture.value] }"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <!-- city dropdown -->
                            <div
                                v-if="selectedPrefecture=== prefecture.value"
                                class="py-2 px-3"
                            >
                                <div
                                    v-for="city in cityDropdownOptions"
                                    :key="city.value"
                                    :value="city.value"
                                    class="border-b border-primary/20 last:border-b-0"
                                >
                                    <div class="flex items-center justify-between py-2">
                                        <!-- checkbox and label -->
                                        <label
                                            label="checkbox"
                                            class="flex items-center gap-3 cursor-pointer"
                                            @change="selectCity(selectedCity=== city.value ? '' : city.value)"
                                        >
                                            <input
                                                type="checkbox"
                                                :checked="selectedCity === city.value"
                                                class="w-4 h-4 rounded"
                                            >
                                            <span> {{ city.displayText }} </span>
                                        </label>
                                    </div>
                                </div>
                                <p
                                    v-if="cityDropdownOptions.length === 0"
                                    class="text-sm text-primary-text-muted py-2"
                                >
                                    {{ t('modHealthcareProfessionalSection.noFacilitiesWereFound') }}
                                </p>
                            </div>
                        </div>
                    </div>
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

                <!-- Search button -->
                <div
                    id="search-button"
                    class="flex items-center shrink-0 px-4 pt-3 pb-4"
                >
                    <button
                        id="searchButton"
                        class="flex flex-none flex-row rounded-md
                                w-full pl-1 pr-2 py-4 text-sm align-middle justify-center
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
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGSearchIcon from '~/assets/icons/search-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocationsStore, regionDisplayName, prefectureDisplayName, cityDisplayName } from '~/stores/locationsStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'
import { type Specialty, Locale } from '~/typedefs/gqlTypes.js'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'
import type { Region, Prefecture, City } from '~/typedefs/locationTypes'
import { regionsEnum, getPrefecturesByRegion, getCitiesByPrefecture } from '~/typedefs/locationTypes'

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
const selectedLanguages: Ref<string> = ref(localeStore.activeLocale.code)

// Locations search rework. cities is string for API call
const selectedRegion: Ref<Region | ''> = ref('')
const selectedPrefecture: Ref<Prefecture | ''> = ref('')
const selectedCity: Ref<string> = ref('')
// Needed for toggling
const openPrefectureSections: Ref<Record<string, boolean>> = ref({})
const openCitySections: Ref<Record<string, boolean>> = ref({})

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

// Region dropdowns
const regionDropdownOptions = computed(() => {
    const isEnglish = localeStore.activeLocale.code === Locale.EnUs
    return regionsEnum.map(region => ({
        value: region,
        displayText: isEnglish ? regionDisplayName[region].en : regionDisplayName[region].ja
    }))
})
// Prefecture dropdowns
const prefectureDropdownOptions = computed(() => {
    const isEnglish = localeStore.activeLocale.code === Locale.EnUs
    // Get prefectures of selected region
    if (!selectedRegion.value) return []
    // Helper function
    const prefectures = getPrefecturesByRegion(selectedRegion.value)
    return prefectures.map(prefecture => ({
        value: prefecture,
        displayText: isEnglish ? prefectureDisplayName[prefecture].en : prefectureDisplayName[prefecture].ja
    }))
})
// City dropdowns
const cityDropdownOptions = computed(() => {
    const isEnglish = localeStore.activeLocale.code === Locale.EnUs
    // Get cities by selected prefecture
    if (!selectedPrefecture.value) return []

    const cities = getCitiesByPrefecture(selectedPrefecture.value)

    // Only show cities that have facilities listed. Create new set below
    const citiesWithFacilities = new Set(locationDropdownOptions.value.map(option => option.value))

    // First filter cities by getting name of city, then checking if thats in existing cities with facilities
    // Then, on those filtered cities, map (create new array) for those options
    // So, prefectures will only show cities that have facilities
    return cities.filter(city => {
        const displayName = isEnglish ? cityDisplayName[city].en : cityDisplayName[city].ja
        return citiesWithFacilities.has(displayName)
    }).map(city => {
        const displayName = isEnglish ? cityDisplayName[city].en : cityDisplayName[city].ja
        // Find/Check for cities from the options that match city names filtered & placed in the map from above
        // Then check the count and return it in the displayText
        const count = locationDropdownOptions.value.find(location => location.value === displayName)?.cityOccurrenceCount
        return {
            value: city,
            displayText: `${displayName} (${count})`
        }
    })
})

// Watch statement to prevent prefectures and cities that dont match
watch(selectedRegion, () => {
    selectedPrefecture.value = ''
    selectedCity.value = ''
})
watch(selectedPrefecture, () => {
    selectedCity.value = ''
})
watch(selectedCity, () => {
    if (!selectedCity.value) {
        searchResultsStore.selectedCity = undefined
    }
    const isEnglish = localeStore.activeLocale.code === Locale.EnUs
    const cityKey = selectedCity.value as City
    searchResultsStore.selectedCity = isEnglish ? cityDisplayName[cityKey].en : cityDisplayName[cityKey].ja
})

// Selection handlers
function selectRegion(region: Region | '') {
    selectedRegion.value = region
    selectedPrefecture.value = ''
    selectedCity.value = ''
    // Sets sections as closed to default falsy value so arrow points down
    openPrefectureSections.value = {}
    if (region) {
        openPrefectureSections.value[region] = true
    }
}
function selectPrefecture(prefecture: Prefecture | '') {
    selectedPrefecture.value = prefecture
    selectedCity.value = ''
    // Sets sections as closed to default falsy value so arrow points down
    openCitySections.value = {}
    if (prefecture) {
        openCitySections.value[prefecture] = true
    }
}
function selectCity(city: string) {
    selectedCity.value = city
}

// Toggle section visibility
function togglePrefectureSection(region: Region) {
    openPrefectureSections.value[region] = !openPrefectureSections.value[region]
}
function toggleCitySection(prefecture: Prefecture) {
    openCitySections.value[prefecture] = !openCitySections.value[prefecture]
}

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

watch(selectedLanguages, () => {
    searchResultsStore.selectedLanguages = selectedLanguages.value ? [selectedLanguages.value as Locale] : []
})

async function search() {
    await searchResultsStore.search()
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultsList)
}
</script>
