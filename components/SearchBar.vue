<template>
    <div class="w-full my-2">
        <!-- Search Bar -->
        <button
            class="flex flex-col py-1 rounded-full w-full border-2 border-primary/20
                    drop-shadow-md text-primary-text-muted text-xs
                    bg-primary-bg hover:bg-primary-hover/50 transition-all
                    cursor-pointer"
            alt="filters panel"
            data-testid="filters-panel-summary"
            @click="openPanel()"
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
                <span class="block">
                    • {{ selectedSpecialtyText }}
                </span>
            </div>
            <!-- Selected Locations -->
            <div class="search-location">
                <span class="block">
                    • {{ selectedLocationText }}
                </span>
            </div>
            <!-- Selected Languages -->
            <div class="search-language">
                <span class="block">
                    • {{ selectedLanguageText }}
                </span>
            </div>
        </button>
        <!-- Filters Panel -->
        <FiltersPanel ref="filtersPanel" />
        <!-- <Transition
            enter-active-class="transition ease-in-out duration-300 transform: translate(100%, 0)"
            leave-active-class="transition ease-in-out duration-100 transform: translate(-100%, 0)"
            enter-from-class="opacity-0 translate-x-2.5"
            enter-to-class="translate-x-0 opacity-100"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="opacity-0 translate-x-2.5"
        >
            <FiltersPanel
                v-show="isPanelOpen"
                data-testid="filters-panel"
                @closed="closePanel()"
            />
        </Transition> -->
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Multiselect from '@vueform/multiselect'
import { useSearchResultsStore } from '~/stores/searchResultsStore.js'
import { useLocaleStore } from '~/stores/localeStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'

const { t } = useI18n()

const searchResultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const filtersPanel = ref<{ openPanel: () => void, closePanel: () => void } | null>(null)

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

const selectedSearchFilters = ref([selectedSpecialtyText.value,
                                   selectedLocationText.value,
                                   selectedLanguageText.value] as string[])

function openPanel() {
    filtersPanel.value?.openPanel()
}

// function closePanel() {
//     filtersPanel.value?.closePanel()
// }
</script>
