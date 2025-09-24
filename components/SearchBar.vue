<template>
    <div class="my-2 landscape:flex landscape:flex-row landscape:w-full landscape:gap-2 landscape:items-center">
        <!-- Search Button -->
        <button
            class="flex items-center w-full mb-2 landscape:mb-0 landscape:w-auto
                   landscape:flex-none h-10 px-4 rounded border-1 border-primary/20
                   drop-shadow-md
                   bg-secondary-bg hover:bg-secondary-hover/50 transition-all
                   cursor-pointer"
            alt="filters panel"
            data-testid="filters-panel-summary"
            @click="openFiltersPanel()"
        >
            <div class="flex items-center gap-2">
                <FiltersIcon
                    role="img"
                    alt="filters icon"
                    title="filters icon"
                    class="filters-icon w-5 h-5 fill-accent"
                />
                <span class="block text-start text-base leading-normal text-accent">
                    {{ t('searchBar.searchAndFilterDoctors') }}
                </span>
            </div>
        </button>
        <!-- Search Bar -->
        <div
            class="flex items-center justify-center h-10 rounded-b w-full landscape:flex-1 landscape:rounded
             border-1 border-primary/20 text-xs text-accent
             bg-primary-bg transition-all"
        >
            <!-- Selected Languages -->
            <div class="search-language flex-1 landscape:flex-1">
                <span
                    class="block text-start pl-2 max-w-full landscape:max-w-full overflow-hidden text-ellipsis
                           whitespace-nowrap"
                >
                    {{ selectedLanguageText }}
                </span>
            </div>
            <!-- Selected Specialties -->
            <div class="search-specialty flex-1 landscape:flex-1">
                <span
                    class="block text-start pl-2 max-w-full landscape:max-w-full overflow-hidden text-ellipsis
                           whitespace-nowrap"
                >
                    • {{ selectedSpecialtyText }}
                </span>
            </div>
            <!-- Selected Locations -->
            <div class="search-location flex-1 landscape:flex-1">
                <span
                    class="block text-start pl-2 max-w-full landscape:max-w-full overflow-hidden text-ellipsis
                           whitespace-nowrap"
                >
                    • {{ selectedLocationText }}
                </span>
            </div>
        </div>
        <!-- Results count -->
        <span
            class="block text-sm text-center
                   text-primary-text-muted self-center
                   landscape:ml-auto"
        >
            {{ t('searchBar.resultsFound', searchResultsStore.totalResults) }}
        </span>
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
