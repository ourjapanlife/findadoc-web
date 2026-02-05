<template>
    <div
        class="flex flex-col bg-primary-bg mx-2 h-full overflow-hidden landscape:pt-6"
    >
        <!-- Search Filters Bar -->
        <div
            v-if="isPortrait"
            data-testid="searchbar"
            class="results-header flex flex-col justify-center shrink-0"
        >
            <SearchBar class="mx-4" />
        </div>
        <!-- Divider line -->
        <div
            v-if="isPortrait"
            class="h-px border border-accent/10 my-2 mx-auto w-20 shrink-0"
        />
        <!-- Loading List Placeholder -->
        <Loader
            v-if="showLoader"
            class="flex-1 flex justify-center items-center"
        />
        <!-- Results List -->
        <div
            v-else-if="hasResults"
            ref="resultsContainerRef"
            data-testid="search-results-list-container"
            class="flex-1 overflow-y-auto"
            @scroll="handleScroll"
        >
            <div
                id="searchResults"
                class="results-list flex flex-col pb-40 mb-40 landscape:pb-22 landscape:mb-0"
                data-testid="search-results-list"
            >
                <div
                    v-for="(searchResult, index) in searchResultsStore.searchResultsList"
                    :key="searchResult.id"
                    class="flex flex-col drop-shadow-md my-4 mx-4 py-1 min-h-36 rounded-md border-t-2
                    border-primary/10 transition-all cursor-pointer"
                    :class="[
                        searchResultsStore.activeFacilityId === searchResult.id
                            ? 'bg-secondary/10 hover:bg-secondary/30 border-2 border-secondary/10'
                            : 'bg-primary-bg hover:bg-primary-hover/50',

                    ]"
                >
                    <div
                        v-if="searchResult.healthcareProfessionals[0]"
                        @click="resultClicked(searchResult.id, searchResult.healthcareProfessionals[0].id,
                                              getLocalizedName(searchResult.healthcareProfessionals[0]?.names))"
                    >
                        <SearchResultsListItem
                            :name="getLocalizedName(searchResult.healthcareProfessionals[0]?.names)"
                            :degrees="searchResult.healthcareProfessionals[0]?.degrees"
                            :facility-name="localeStore.activeLocale.code == Locale.JaJp
                                ? searchResult.nameJa
                                : searchResult.nameEn"
                            :specialties="searchResult.healthcareProfessionals[0]?.specialties"
                            :spoken-languages="searchResult.healthcareProfessionals[0]?.spokenLanguages"
                            :data-testid="`search-result-list-item-${index}`"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="flex-1 flex justify-center items-center"
        >
            <div class="flex flex-col">
                <SVGNoSearchResults class="portrait:px-4 h-12" />
                <span class="text-primary-text px-1 font-bold self-center group-hover:text-primary-text-inverted/50">{{
                    t('searchResultsList.noResults') }}</span>
                <span class="text-primary-text self-center text-center">{{
                    t('searchResultsList.noResultsSubtext') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useLocaleStore } from '../stores/localeStore'
import { useLoadingStore } from '../stores/loadingStore'
import { useBottomSheetStore, BottomSheetType } from '../stores/bottomSheetStore'
import { Locale, type LocalizedName } from '~/typedefs/gqlTypes.js'
import SVGNoSearchResults from '~/assets/icons/no-search-results-graphic.svg'
import { useScreenOrientation } from '~/composables/useScreenOrientation'
import { useUmami } from '~/composables/useUmamiTracking'

const { t } = useI18n()

const searchResultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const loadingStore = useLoadingStore()
const bottomSheetStore = useBottomSheetStore()
const { isPortrait } = useScreenOrientation()
const { track } = useUmami()

const hasResults = computed(() => searchResultsStore.searchResultsList.length)
const showLoader = computed(() => loadingStore.isLoading && !hasResults.value && !searchResultsStore.isPrefetchingSearchResults)

// Emit events
const emit = defineEmits(['scrolled'])

onMounted(() => {
    if (!searchResultsStore.isPrefetchingSearchResults) searchResultsStore.search()
})

function handleScroll() {
    emit('scrolled')
}

function resultClicked(facilityId: string, professionalId: string, hp: string) {
    searchResultsStore.setActiveFacility(facilityId)
    searchResultsStore.setActiveProfessional(professionalId)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)

    track('Search results list item', { hp })
}

function getLocalizedName(
names: Array<LocalizedName>
) {
    if (!names || !names.length) return ''

    const currentLocale = localeStore.activeLocale.code
    const localePrefix = currentLocale.split('-')[0] || 'en'

    const selectedName
        = names.find(name => name.locale === currentLocale)
          || names.find(name => name.locale.startsWith(localePrefix))
          || names[0]

    return `${selectedName?.firstName} ${selectedName?.lastName}`
}
</script>
