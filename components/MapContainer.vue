<template>
    <div class="">
        <GoogleMap
            v-if="isMapReady"
            ref="mapRef"
            data-testid="map-of-japan"
            :api-key="runtimeConfig.public.GOOGLE_MAPS_API_KEY as string ?? undefined"
            map-id="153d718018a2577e"
            :disable-default-ui="true"
            class="h-full w-full"
            :center="currentLocation"
            :zoom="9"
            @drag="handleMapMovement"
            @zoom_changed="handleMapMovement"
        >
            <CustomMarker
                v-for="(location, index) in searchResultsStore.searchResultsList"
                :key="index"
                :options="{
                    position: {
                        lat: location.facilities[0]?.mapLatitude ?? defaultLocation.lat,
                        lng: location.facilities[0]?.mapLongitude ?? defaultLocation.lng,
                    },
                }"
                @click="handlePinClick(location.professional.id)"
            >
                <div style="text-align: center">
                    <SVGSVGBlueMapPin class="w-[45px] h-[73px]" />
                </div>
            </CustomMarker>
        </GoogleMap>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GoogleMap, CustomMarker } from 'vue3-google-map'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useRuntimeConfig } from '#imports'
import SVGSVGBlueMapPin from '~/assets/icons/blue-map-pin.svg'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'

const defaultLocation = { lat: 35.6804, lng: 139.769 }
const currentLocation = ref(defaultLocation)

const searchResultsStore = useSearchResultsStore()
const mapRef = ref(null)
const runtimeConfig = useRuntimeConfig()
const bottomSheetStore = useBottomSheetStore()

const isMapReady = ref(false)

// Emit events for map movement
const emit = defineEmits(['map-moved'])

const handlePinClick = (resultId: string) => {
    //Let's show the result details
    searchResultsStore.setActiveSearchResult(resultId)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)
    bottomSheetStore.isMinimized = false

    //Even though the watch() will update the location, we need to set it here to ensure the map is centered on the new result
    nextTick(() => {
        setLocation(currentLocation.value.lat, currentLocation.value.lng)
    })
}

onMounted(() => {
    // This Google Maps Library Component will try to render before the component and throw a JS error.
    // This is a trick to prevent it from rendering until the component is mounted.
    setTimeout(() => { isMapReady.value = true }, 10)
})

watch(() => searchResultsStore.activeResult, newActiveResult => {
    if (newActiveResult) {
        const activeResultLocation = newActiveResult.facilities[0]
        const lng = activeResultLocation?.mapLongitude ?? defaultLocation.lng
        // Since the map is slightly offset vertically, we need to offset the location by 0.30 to center it
        const lat = activeResultLocation?.mapLatitude ? activeResultLocation.mapLatitude - 0.30 : defaultLocation.lat

        setLocation(lat, lng)
    }
})

// Handle map movement events
const handleMapMovement = () => {
    emit('map-moved')
}

const setLocation = (lat: number, lng: number) => {
    const locationExists = lng && lat

    currentLocation.value = locationExists ? { lat, lng } : defaultLocation
}
</script>
