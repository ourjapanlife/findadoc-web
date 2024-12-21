<template>
    <div
        class="container flex gap-1 w-fit"
        :class="[
            isNearPageBottom ? 'flex-col-reverse' : 'flex-col',
        ]"
    >
        <ModSearchBar
            v-model="searchInputElement"
            :items-count="filteredItems.length"
            :place-holder-text="$t('modFacilitySearchBar.placeholderTextFacilitySearchBar')"
            @search-input-arrow-up="handleSearchInputArrowUp"
            @search-input-arrow-down="handleSearchInputArrowDown"
            @search-input-change="handleSearchInputChange"
            @search-input-enter="handleSearchInputEnter"
            @search-input-blur="handleSearchInputBlur"
        />
        <div class="container relative">
            <ul
                v-if="searchInputValue.trim() !== ''"
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
                        selectedItems.has(item) ? 'bg-primary/90' : '',
                        selectedItemIndex === index ? 'bg-primary-hover text-primary-inverted' : 'opacity-95',
                    ]"
                    @click="handleListItemClick"
                    @mousedown="handleListItemMouseDown"
                    @mouseover="() => { handleListItemMouseOver(index) }"
                >
                    <div class="flex items-center m-3 gap-3 overflow-x-auto">
                        <span>{{ index + 1 }}</span>
                        <div class="flex flex-col overflow-x-auto whitespace-nowrap">
                            <span class="text-xs">{{ item.id }}</span>
                            <span>{{ `${item.nameEn} / ${item.nameJa} ` }}</span>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <SVGCheckMark
                            class="h-4 m-3"
                            :class="[
                                selectedItems.has(item) ? 'opacity-100' : 'opacity-10',
                            ]"
                        />
                    </div>
                </li>
                <!-- Fallback for empty search results -->
                <li
                    v-if="!filteredItems.length"
                    class="m-3 cursor-default"
                >
                    <span>{{ $t('modFacilitySearchBar.noFacilitiesWereFound') }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import ModSearchBar from './ModSearchBar.vue'
import SVGCheckMark from '~/assets/icons/check-mark.svg'
import { useFacilitiesStore } from '#build/imports'
import type { Facility } from '~/typedefs/gqlTypes'

const selectedItems = defineModel<Set<Facility>>({ required: true })

//The limit for fetching facilities is 400 at the current date (30/11/2024)
const facilitiesStore = useFacilitiesStore()
const searchInputElement = ref<HTMLInputElement>()
const searchInputValue = ref('')
const filteredItems = ref<Facility[]>([])
const selectedItemIndex = ref(0)

const handleListScroll = () => {
    const selectedElement = document.getElementById(`search-list-item-${selectedItemIndex.value}`)

    if (!selectedElement) return

    selectedElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
    })
}

const handleListItem = () => {
    const item = filteredItems.value[selectedItemIndex.value]

    if (selectedItems.value.has(item)) {
        selectedItems.value.delete(item)
        return
    }

    selectedItems.value.add(item)
}

const handleListItemClick = (event: MouseEvent) => {
    event.preventDefault()
    handleListItem()
}

const handleListItemMouseOver = (index: number) => {
    selectedItemIndex.value = index
}

const handleListItemMouseDown = (event: MouseEvent) => {
    // Prevent search input from being blurred
    event.preventDefault()
}

const handleSearchInputBlur = () => {
    if (!searchInputElement.value) return
    searchInputElement.value.value = ''
    handleSearchInputChange()
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

const handleSearchInputEnter = (event: KeyboardEvent) => {
    event.preventDefault()
    handleListItem()
}

const handleSearchInputChange = () => {
    if (!searchInputElement.value) return

    searchInputValue.value = searchInputElement.value.value

    const currentFacilities = facilitiesStore.facilityData
    const itemIdOrName = searchInputElement.value.value.toLowerCase()

    selectedItemIndex.value = 0

    if (itemIdOrName.trim() === '') {
        filteredItems.value = []
        return
    }

    filteredItems.value = currentFacilities.filter(({ nameEn, nameJa, id }) => {
        const isMatch
            = nameEn.toLowerCase().includes(itemIdOrName)
            || nameJa.toLowerCase().includes(itemIdOrName)
            || id.toLowerCase() === itemIdOrName
        return isMatch
    })
}

// Displays the dropdown above the searchInputElement if its position is greater than window.innerHeight / 1.5
const isNearPageBottom = computed(() => {
    if (!searchInputElement.value) return
    return searchInputElement.value.getBoundingClientRect().bottom >= window.innerHeight / 1.5
})
</script>
