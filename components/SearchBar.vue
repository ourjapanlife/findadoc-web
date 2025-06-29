<template>
    <div class="w-full my-2">
        <!-- Search Bar -->
        <button
            class="flex my-2 py-1 rounded w-full border-1 border-primary/20
                    drop-shadow-md text-xs
                    bg-secondary-bg hover:bg-secondary-hover/50 transition-all
                    cursor-pointer"
            alt="filters panel"
            data-testid="filters-panel-summary"
            @click="openFiltersPanel()"
        >
            <!-- Selected Specialties -->
            <div class="search-specialty flex pl-4">
                <FiltersIcon
                    role="img"
                    alt="filters icon"
                    title="filters icon"
                    class="filters-icon w-6 mr-1 fill-accent"
                />
                <span class="block text-start text-lg pl-2 text-accent">
                    Search and filter doctors
                </span>
            </div>
        </button>
        <!-- Alternative Search Bar -->
        <div class="hidden">
            <button
                class="flex flex-col my-2 py-1 rounded w-full border-2 border-primary/20
                    drop-shadow-md text-primary-text-muted text-xs
                    bg-primary-bg hover:bg-primary-hover/50 transition-all
                    cursor-pointer"
                alt="filters panel"
                data-testid="filters-panel-summary"
                @click="openFiltersPanel()"
            >
                <!-- <Multiselect
                v-model="selectedSearchFilters"
                :multiple="true"
                mode="tags"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Select specialties"
                label="displayText"
                track-by="code"
                class="w-full"
            /> -->
                <!-- Selected Specialties -->
                <div class="search-specialty">
                    <span class="block text-start pl-2">
                        • {{ selectedSpecialtyText }}
                    </span>
                </div>
            </button>
            <button
                class="flex flex-col my-2 py-1 rounded w-full border-2 border-primary/20
                    drop-shadow-md text-primary-text-muted text-xs
                    bg-primary-bg hover:bg-primary-hover/50 transition-all
                    cursor-pointer"
                alt="filters panel"
                data-testid="filters-panel-summary"
                @click="openFiltersPanel()"
            >
                <!-- Selected Locations -->
                <div class="search-location">
                    <span class="block text-start pl-2">
                        • {{ selectedLocationText }}
                    </span>
                </div>
            </button>
            <button
                class="flex flex-col my-2 py-1 rounded w-full border-2 border-primary/20
                    drop-shadow-md text-primary-text-muted text-xs
                    bg-primary-bg hover:bg-primary-hover/50 transition-all
                    cursor-pointer"
                alt="filters panel"
                data-testid="filters-panel-summary"
                @click="openFiltersPanel()"
            >
                <!-- Selected Languages -->
                <div class="search-language">
                    <span class="block text-start pl-2">
                        • {{ selectedLanguageText }}
                    </span>
                </div>
            </button>
        </div>
        <!-- Filters Panel -->
        <FiltersPanel />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FiltersIcon from '~/assets/icons/equalizer-icon.svg'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'

const { t } = useI18n()

const searchResultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const selectedSpecialtyText = computed(() => {
    const specialty = (searchResultsStore.selectedSpecialties && searchResultsStore.selectedSpecialties.length > 0)
        ? specialtiesStore.specialtyDisplayOptions.find(opt => opt.code === searchResultsStore.selectedSpecialties?.[0])
        : null
    return specialty ? specialty.displayText : t('searchBar.allSpecialties')
})

const selectedLocationText = computed(() => searchResultsStore.selectedCity || t('searchBar.allLocations'))

const selectedLanguageText = computed(() => {
    const selectedLanguage = localeStore.activeLocale
    return selectedLanguage.displayText
})

function openFiltersPanel() {
    useBottomSheetStore().showBottomSheet(BottomSheetType.FiltersPanel)
}
</script>
