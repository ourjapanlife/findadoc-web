<template>
    <div
        class="flex flex-col gap-1 w-fit"
    >
        <div
            class="flex items-center px-3 py-3.5 w-96 h-12 bg-secondary-bg
            rounded-lg border border-primary-text-muted text-primary-text
            text-sm font-normal font-sans placeholder-primary-text-muted
            outline outline-0 -outline-offset-2 gap-2 divide-x-2
            focus-within:outline-currentColor
            focus-within:outline-2
            "
        >
            <!-- TODO: Change i18n key for the placeholder if necessary -->
            <input
                ref="searchInputElement"
                v-model="searchInput"
                type="text"
                :placeholder="$t('modFacilitySearchbar.placeholderTextFacilitySearchbar')"
                class="grow focus-visible:outline-none"
                @blur="handleSearchInputBlur"
                @keydown.esc="handleSearchInputEsc"
                @keydown.down="handleSearchInputArrowDown"
                @keydown.up="handleSearchInputArrowUp"
                @keydown.enter="handleSearchInputEnter"
            >
            <button
                type="button"
                @click="searchInputElement?.focus()"
            >
                <SVGLookingGlass
                    role="img"
                    title="searching icon"
                    class="h-6 pl-2"
                />
            </button>
        </div>
        <div class="relative">
            <ul
                v-if="searchInput.trim() !== ''"
                class="bg-white shadow-md border border-primary-gray-by rounded-lg absolute
                w-full flex flex-col divide-y-2 overflow-hidden
                "
            >
                <!-- Search limited to 10 items -->
                <li
                    v-for="(facility, index) in filteredFacilities.slice(0, 10)"
                    :key="facility.id"
                    class="flex justify-between divide-x cursor-pointer"
                    :class="[
                        selectedFacilities.has(facility) && 'bg-primary-text-muted',
                        selectedFacilityIndex === index ? 'bg-primary-hover text-primary-inverted' : 'opacity-95',
                    ]"
                    @click="(event) => { event.preventDefault(); handleListItemClick(facility) }"
                    @mousedown="(event) => {
                        // Prevent search input from being blurred
                        event.preventDefault()
                    }"
                    @mousemove="selectedFacilityIndex = index"
                >
                    <div class="flex flex-col overflow-x-auto whitespace-nowrap m-3">
                        <span class="text-xs">{{ facility.id }}</span>
                        <span class="">{{ `${facility.nameEn} / ${facility.nameJa} ` }}</span>
                    </div>
                    <div class="flex items-center">
                        <SVGCheckMark
                            class="h-4 m-3"
                            :class="[
                                selectedFacilities.has(facility) ? 'opacity-100' : 'opacity-10',
                            ]"
                        />
                    </div>
                </li>
                <li
                    v-if="!filteredFacilities.length"
                    class="m-3 cursor-default"
                >
                    <!-- TODO: Change i18n key if necessary -->
                    <span>{{ $t('modFacilitySearchbar.noFacilitiesWereFound') }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import SVGCheckMark from '~/assets/icons/check-mark.svg'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'
import { useFacilitiesStore } from '#build/imports'
import { useFacilitySearchbarStore } from '~/stores/facilitySearchbarStore'
import type { Facility } from '~/typedefs/gqlTypes'

//The limit for fetching facilities is 400 at the current date (30/11/2024)
const facilitiesStore = useFacilitiesStore()
const facilitySearchbarStore = useFacilitySearchbarStore()

const searchInput = ref('')
const searchInputElement = ref<HTMLInputElement | null>(null)
const filteredFacilities = ref<Facility[]>([])
const selectedFacilities = ref(facilitySearchbarStore.selectedFacilities)
const selectedFacilityIndex = ref(0)

const handleListItemClick = (facility: Facility) => {
    searchInputElement.value?.focus()

    if (selectedFacilities.value.has(facility)) {
        selectedFacilities.value.delete(facility)
        return
    }

    selectedFacilities.value.add(facility)
}

const handleSearchInputBlur = () => {
    searchInput.value = ''
}

const handleSearchInputEsc = () => {
    handleSearchInputBlur()
}

const handleSearchInputArrowUp = (event: KeyboardEvent) => {
    // Prevent the cursor to be moving inside the search input
    event.preventDefault()
    if (selectedFacilityIndex.value > -1) selectedFacilityIndex.value -= 1
}

const handleSearchInputArrowDown = (event: KeyboardEvent) => {
    event.preventDefault()
    if (selectedFacilityIndex.value < filteredFacilities.value.length - 1) selectedFacilityIndex.value += 1
}

const handleSearchInputEnter = () => {
    handleListItemClick(filteredFacilities.value[selectedFacilityIndex.value])
}

const handleSearchInputChange = () => {
    const currentFacilities = facilitiesStore.facilityData
    const facilityIdOrName = searchInput.value.toLowerCase()

    selectedFacilityIndex.value = 0

    if (facilityIdOrName.trim() === '') {
        filteredFacilities.value = []
        return
    }

    filteredFacilities.value = currentFacilities.filter(({ nameEn, nameJa, id }) => {
        const isMatch
        = nameEn.toLowerCase().includes(facilityIdOrName)
        || nameJa.toLowerCase().includes(facilityIdOrName)
        // TODO: Is the id case sensitive?
        || id.toLowerCase() === facilityIdOrName
        return isMatch
    })
}

// TODO: Clear the store to prevent bugs. This might change in the future.

onMounted(() => {
    selectedFacilities.value = new Set()
})

onUnmounted(() => {
    selectedFacilities.value = new Set()
})

watch(searchInput, handleSearchInputChange)
</script>

<!-- TODO: This could be moved to a better place to make it the project standard scrollbar  -->

<style scoped>
/* width */
::-webkit-scrollbar {
    height: 7px;
    transition: all ease-in-out 0.25s;
    margin: 2px;
}

/* Track */
::-webkit-scrollbar-track {
    background-color: #5454544d;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #545454d9;
}
</style>
