<template>
    <div
        id="search-container"
        data-testid="search-page"
        class="flex flex-col h-svh overflow-hidden"
    >
        <TopNav class="absolute top-0 left-0 right-0 z-10 mx-2" />
        <!-- Landscape / Desktop -->
        <div
            v-if="isLandscape"
            id="search-landscape"
            class="flex flex-col flex-1 overflow-hidden"
        >
            <Loader />
            <div class="flex flex-1 overflow-hidden">
                <LeftNavbar
                    class="bg-primary-bg w-96 z-20
                    fixed top-24 left-0 h-[calc(95vh-96px)] rounded-r-md"
                />
                <div class="flex-1 relative">
                    <ClientOnly>
                        <MapContainer class="h-full" />
                    </ClientOnly>
                    <SlidingRightPanel />
                </div>
            </div>
        </div>
        <!-- Portrait / Mobile -->
        <div
            v-else
            id="search-portrait"
            class="h-svh"
        >
            <Loader />
            <BottomSheetContainer />
            <ClientOnly>
                <MapContainer
                    class="h-[calc(100vh)]"
                    @map-moved="handleMapMoved"
                />
            </ClientOnly>
        </div>
        <!--
            Hidden in portrait: the bottom sheet owns the lower edge of the screen on
            mobile search, and an overlaid footer would sit on top of it. Every other
            page shows the footer at all sizes.
        -->
        <Footer class="portrait:hidden z-20 absolute bottom-0 left-0 right-0 mx-2" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import SlidingRightPanel from '~/components/SlidingRightPanel.vue'
import { useScreenOrientation } from '~/composables/useScreenOrientation'
import { useBottomSheetStore } from '~/stores/bottomSheetStore'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { definePageMeta } from '#imports'
import { Locale, Specialty } from '~/typedefs/gqlTypes'

definePageMeta({
    layout: 'search'
})

const route = useRoute()
const bottomSheetStore = useBottomSheetStore()
const searchResultsStore = useSearchResultsStore()
const { isLandscape } = useScreenOrientation()

/**
 * Seed the store from the URL before SearchResultsList mounts and fires its search,
 * so arriving from the homepage runs one filtered search rather than an unfiltered
 * one followed by a corrective second pass.
 */
const readParam = (key: string): string | undefined => {
    const raw = route.query[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    return typeof value === 'string' && value.length ? value : undefined
}

const specialties = Object.values(Specialty) as string[]
const locales = Object.values(Locale) as string[]

const specialtyParam = readParam('specialty')
const languageParam = readParam('language')

searchResultsStore.selectedCity = readParam('city')
searchResultsStore.selectedPrefecture = readParam('prefecture')
searchResultsStore.selectedSpecialties = specialtyParam && specialties.includes(specialtyParam)
    ? [specialtyParam as Specialty]
    : []
searchResultsStore.selectedLanguages = languageParam && locales.includes(languageParam)
    ? [languageParam as Locale]
    : []

const handleMapMoved = () => {
    if (bottomSheetStore.isMinimized === false) {
        bottomSheetStore.isMinimized = true
    }
}
</script>
