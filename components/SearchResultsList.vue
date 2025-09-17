<template>
    <div
        class="flex flex-col bg-primary-bg overflow-y-auto mx-2 h-full"
    >
        <!-- Search Filters Bar -->
        <div
            data-testid="searchbar"
            class="results-header flex flex-col justify-center flex-shrink-0"
        >
            <SearchBar class="mx-4" />
        </div>
        <!-- Divider line -->
        <div class="h-px border border-accent/10 my-2 mx-auto w-20 flex-shrink-0" />
        <!-- Loading List Placeholder -->
        <div
            v-if="loadingStore.isLoading"
            class="flex-1 flex justify-center items-center"
        >
            <div class="flex flex-col justify-center align-middle">
                <SVGLoadingIcon
                    data-testid="svg-loading-icon"
                    role="img"
                    alt="loading animation"
                    title="loading animation"
                    class="flex h-12"
                />
            </div>
        </div>
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
                class="results-list flex flex-col pb-40 landscape:pb-4"
                data-testid="search-results-list"
            >
                <div
                    v-for="(searchResult, index) in resultsStore.searchResultsList"
                    :key="index"
                    class="flex flex-col drop-shadow-md my-4 mx-4 py-1 min-h-36 rounded-md border-t-2
                            border-primary/10 transition-all cursor-pointer"
                    :class="[
                        resultsStore.activeResult?.professional.id === searchResult.professional.id
                            ? 'bg-secondary/10 hover:bg-secondary/30 border-2 border-secondary/10'
                            : 'bg-primary-bg hover:bg-primary-hover/50',
                    ]"
                    @click="resultClicked(searchResult.professional.id)"
                >
                    <SearchResultsListItem
                        :name="getLocalizedName(searchResult.professional.names)"
                        :degrees="searchResult.professional.degrees"
                        :facility-name="localeStore.activeLocale.code == Locale.JaJp
                            ? searchResult.facilities[0]?.nameJa
                            : searchResult.facilities[0]?.nameEn"
                        :specialties="searchResult.professional.specialties"
                        :spoken-languages="searchResult.professional.spokenLanguages"
                        :data-testid="`search-result-list-item-${index}`"
                    />
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
import { useBottomSheetStore } from '../stores/bottomSheetStore'
import { Locale } from '~/typedefs/gqlTypes.js'
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import SVGNoSearchResults from '~/assets/icons/no-search-results-graphic.svg'

const { t } = useI18n()

const resultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const loadingStore = useLoadingStore()
const bottomSheetStore = useBottomSheetStore()

const hasResults = computed(() => resultsStore.searchResultsList.length > 0)
const resultsContainerRef = ref<HTMLElement | null>(null)

// Emit events
const emit = defineEmits(['scrolled'])

onMounted(() => {
    resultsStore.search()
})

function handleScroll() {
    emit('scrolled')
}

function resultClicked(resultId: string) {
    resultsStore.setActiveSearchResult(resultId)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)
}

function getLocalizedName(
  names: Array<{ locale: string, firstName: string, lastName: string }>
) {
    const currentLocale = localeStore.activeLocale.code
    const localePrefix = currentLocale.split('-')[0]

    const selectedName
    = names.find(name => name.locale === currentLocale)
      || names.find(name => name.locale.startsWith(localePrefix))
      || names[0]

    return `${selectedName.firstName} ${selectedName.lastName}`
}
</script>
