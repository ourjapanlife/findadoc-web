<template>
    <div
        class="container flex gap-1 w-fit"
        :class="[
            isNearPageBottom ? 'flex-col-reverse' : 'flex-col',
        ]"
    >
        <div
            class="flex items-center px-3 py-3.5 w-96 h-12 bg-secondary-bg
            rounded-lg border border-primary-text-muted text-primary-text
            text-sm font-normal font-sans placeholder-primary-text-muted
            focus-within:outline-currentColor
            focus-within:outline-2
            "
        >
            <input
                ref="searchInputElement"
                v-model="searchInputValue"
                type="text"
                :placeholder="placeHolderText"
                :data-testid="`${dataTestId}`"
                class="grow focus-visible:outline-none bg-secondary-bg text-primary-text placeholder-primary-text-muted"
                @blur="handleSearchInputBlur"
                @keydown.esc="handleSearchInputBlur"
                @keydown.down="handleSearchInputArrowDown"
                @keydown.up="handleSearchInputArrowUp"
                @keydown.enter="triggerSearch"
                @input="handleSearchInputChange"
                @focus="handleSearchInputFocus"
            >
            <span
                v-if="isInputFocused && searchResultCount > 0"
                class="pl-2"
            >
                {{ searchResultCount }}
            </span>
            <button
                type="button"
                @mousedown.prevent="triggerSearch"
            >
                <SVGLookingGlass
                    role="img"
                    title="searching icon"
                    class="h-6 pl-2"
                />
            </button>
        </div>
        <div class="container relative">
            <ul
                v-if="searchTriggered || loading || filteredItems.length > 0"
                id="search-list"
                class="bg-primary-bg shadow-md border-2 border-primary/50 rounded-lg absolute
                w-full flex flex-col divide-y-2 max-h-64 overflow-y-auto overflow-x-hidden
                "
                :class="[
                    isNearPageBottom ? '-translate-y-full' : '',
                ]"
            >
                <li
                    v-for="(item, index) in filteredItems"
                    :id="`search-list-item-${index}`"
                    :key="item.id"
                    class="flex justify-between divide-x cursor-pointer"
                    :class="[
                        selectedItemIndex === index ? 'bg-primary-hover text-primary-inverted' : 'opacity-95',
                    ]"
                    data-testid="mod-search-bar-search-result"
                    @click="handleListItemClick(item)"
                    @mousedown="handleListItemMouseDown"
                    @mouseover="() => { handleListItemMouseOver(index) }"
                >
                    <div class="flex items-center m-3 gap-3 overflow-x-auto">
                        <span>{{ index + 1 }}</span>
                        <div class="flex flex-col overflow-x-auto whitespace-nowrap">
                            <span class="text-xs">{{ item.id }}</span>
                            <div class="divide-x-2 mt-1">
                                <span
                                    v-for="(field, fieldIndex) in fieldsToDisplayCallback(item)"
                                    :key="fieldIndex"
                                    class="px-2 first-of-type:pl-0 last-of-type:pr-0"
                                >
                                    {{ field }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <SVGCheckMark
                            class="h-4 m-3"
                            :class="[
                                'opacity-0',
                            ]"
                        />
                    </div>
                </li>
                <li
                    v-if="loading"
                    data-testid="mod-search-bar-loading"
                    class="m-3 cursor-default text-primary-text-muted"
                >
                    <span>{{ t('modSearchBarFilterName.loading') }}</span>
                </li>

                <li
                    v-if="!loading && searchTriggered && searchInputValue.length > 0 && !filteredItems.length"
                    data-testid="mod-search-bar-search-no-match"
                    class="m-3 cursor-default"
                >
                    <span>{{ t('modSearchBarFilterName.noTextMatch') }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHealthcareProfessionalsStore } from '../../stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '../../stores/facilitiesStore'
import type {
    Facility,
    HealthcareProfessional,
    Locale
} from '../../typedefs/gqlTypes'
import { useI18n } from '#imports'
import SVGCheckMark from '~/assets/icons/check-mark.svg'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'

const { t } = useI18n()

interface SearchResultItem {
    id: string
    nameEn?: string
    nameJa?: string
    names?: Array<{ firstName: string, lastName: string, locale: Locale }>
    healthcareProfessionalName?: string
}

type SearchEntityType = 'facilities' | 'healthcareProfessionals' | 'submissions'

const props = defineProps<{
    placeHolderText: string
    fieldsToDisplayCallback: (item: SearchResultItem) => string[]
    entityType: SearchEntityType
    dataTestId?: string
}>()

const emit = defineEmits<{
    (e: 'itemSelected', item: SearchResultItem | null): void
    (e: 'searchCleared'): void
}>()

const searchInputElement = ref<HTMLInputElement | null>(null)
const searchInputValue = ref('')
const filteredItems = ref<SearchResultItem[]>([])
const selectedItemIndex = ref(0)
const searchResultCount = computed(() => filteredItems.value.length)
const isInputFocused = ref(false)
const loading = ref(false)
const searchTriggered = ref(false)

const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()

const triggerSearch = async () => {
    const inputValue = searchInputValue.value.trim()
    if (inputValue.length > 0) {
        searchTriggered.value = true
        const results = await executeSearchQuery(inputValue)
        filteredItems.value = results
        selectedItemIndex.value = 0
    } else {
        filteredItems.value = []
        searchTriggered.value = false
        emit('searchCleared')
    }
}

const executeSearchQuery = async (term: string): Promise<SearchResultItem[]> => {
    loading.value = true
    try {
        let results: SearchResultItem[] = []

        if (props.entityType === 'facilities') {
            const { nodes } = await facilitiesStore.getFacilitiesByName(term)
            results = nodes.map((facility: Facility) => ({
                id: facility.id,
                nameEn: facility.nameEn,
                nameJa: facility.nameJa
            })) as SearchResultItem[]
        } else if (props.entityType === 'healthcareProfessionals') {
            const { nodes } = await healthcareProfessionalsStore.getHealthcareProfessionalsByName(term)
            results = nodes.map((hp: HealthcareProfessional) => ({
                id: hp.id,
                names: hp.names
            })) as SearchResultItem[]
        } else if (props.entityType === 'submissions') {
            console.warn('Submission search is not implemented yet.')
            results = []
        } else {
            console.error('Unknown entity type for search:', props.entityType)
            return []
        }

        return results
    } catch (error) {
        console.error(`Error during search for ${props.entityType}:`, error)
        return []
    } finally {
        loading.value = false
    }
}

const handleListScroll = () => {
    const selectedElement = document.getElementById(`search-list-item-${selectedItemIndex.value}`)
    if (!selectedElement) return
    selectedElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
    })
}

const handleListItemClick = (item: SearchResultItem) => {
    emit('itemSelected', item)
    filteredItems.value = []
    isInputFocused.value = false
    searchTriggered.value = false
}

const handleListItemMouseOver = (index: number) => {
    selectedItemIndex.value = index
}

const handleListItemMouseDown = (event: MouseEvent) => {
    event.preventDefault()
}

const handleSearchInputBlur = () => {
    isInputFocused.value = false
    searchInputValue.value = ''
    filteredItems.value = []
    searchTriggered.value = false
    emit('searchCleared')
}

const handleSearchInputArrowUp = (event: KeyboardEvent) => {
    event.preventDefault()
    if (selectedItemIndex.value > 0) {
        --selectedItemIndex.value
        handleListScroll()
    }
}

const handleSearchInputArrowDown = (event: KeyboardEvent) => {
    event.preventDefault()
    if (selectedItemIndex.value < filteredItems.value.length - 1) {
        ++selectedItemIndex.value
        handleListScroll()
    }
}

const handleSearchInputChange = () => {
    searchTriggered.value = false
    filteredItems.value = []
}

const handleSearchInputFocus = () => {
    isInputFocused.value = true
}

const isNearPageBottom = computed(() => {
    if (!searchInputElement.value) return false
    return searchInputElement.value.getBoundingClientRect().bottom >= window.innerHeight / 1.5
})
</script>
