<template>
    <div class="flex flex-0 w-128">
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
                    <option :key="index" v-for="(language, index) in languageDropdownOptions">
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
import { ref, Ref } from 'vue'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { useLocationsStore } from '~/stores/locationsStore'
import { Locale, Specialty } from "~/typedefs/gqlTypes.js"
import { useLocaleStore, LocaleDisplay } from '~/stores/localeStore.js'

const specialtyOptions = [
    { code: 'ANY', displayText: '----Any----' },
    { code: 'ALLERGY_AND_IMMUNOLOGY', displayText: "AllergyAndImmunology" },
    { code: 'ANESTHESIOLOGY', displayText: "Anesthesiology" },
    { code: 'DERMATOLOGY', displayText: "Dermatology" },
    { code: 'DIAGNOSTIC_RADIOLOGY', displayText: "DiagnosticRadiology" },
    { code: 'EMERGENCY_MEDICINE', displayText: "EmergencyMedicine" },
    { code: 'FAMILY_MEDICINE', displayText: "FamilyMedicine" },
    { code: 'INTERNAL_MEDICINE', displayText: "InternalMedicine" },
    { code: 'MEDICAL_GENETICS', displayText: "MedicalGenetics" },
    { code: 'NEUROLOGY', displayText: "Neurology" },
    { code: 'NUCLEAR_MEDICINE', displayText: "NuclearMedicine" },
    { code: 'OBSTETRICS_AND_GYNECOLOGY', displayText: "ObstetricsAndGynecology" },
    { code: 'OPHTHALMOLOGY', displayText: "Ophthalmology" },
    { code: 'PATHOLOGY', displayText: "Pathology" },
    { code: 'PEDIATRICS', displayText: "Pediatrics" },
    { code: 'PHYSICAL_MEDICINE_AND_REHABILITATION', displayText: "PhysicalMedicineAndRehabilitation" },
    { code: 'PREVENTIVE_MEDICINE', displayText: "PreventiveMedicine" },
    { code: 'PSYCHIATRY', displayText: "Psychiatry" },
    { code: 'RADIATION_ONCOLOGY', displayText: "RadiationOncology" },
    { code: 'SURGERY', displayText: "Surgery" },
    { code: 'UROLOGY', displayText: "Urology" }] as SpecialtyDisplayOption[]

interface SpecialtyDisplayOption {
    code: Specialty
    displayText: string
}

const localeStore = useLocaleStore()
const locationsStore = useLocationsStore()
const searchResultsStore = useSearchResultsStore()

locationsStore.fetchLocations()
const languageOptions = [{
    code: 'ANY',
    simpleText: '----Any----',
    displayText: '----Any----'
}, ...localeStore.mvpLocaleDisplayOptions]

const locationDropdownOptions: Ref<string[]> = ref(locationsStore.citiesDisplayOptions)
const specialtyDropdownOptions: Ref<SpecialtyDisplayOption[]> = ref(specialtyOptions)
const languageDropdownOptions: Ref<LocaleDisplay[]> = ref(languageOptions)

const selectedSpecialty: Ref<Specialty | undefined> = ref(undefined)
const selectedLocation: Ref<string> = ref('')
const selectedLanguage: Ref<Locale | undefined> = ref(undefined)

const search = () => {
    searchResultsStore.search(selectedLocation.value, selectedSpecialty.value, selectedLanguage.value)
}
</script>
