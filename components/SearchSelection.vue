<template>
    <div
        class="flex justify-center py-1 rounded-b w-full border-1 border-primary/20 text-xs
                    bg-secondary-bg hover:bg-secondary-hover/50 transition-all"
    >
        <!-- Selected Languages -->
        <div class="search-language">
            <span class="block text-start pl-2 max-w-1/3 overflow-hidden text-ellipsis whitespace-nowrap">
                {{ selectedLanguageText }}
            </span>
        </div>
        <!-- Selected Specialties -->
        <div class="search-specialty">
            <span class="block text-start pl-2 max-w-1/3 overflow-hidden text-ellipsis whitespace-nowrap">
                • {{ selectedSpecialtyText }}
            </span>
        </div>
        <!-- Selected Locations -->
        <div class="search-location">
            <span class="block text-start pl-2 max-w-1/3 overflow-hidden text-ellipsis whitespace-nowrap">
                • {{ selectedLocationText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
</script>
