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
            :zoom="currentZoom"
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
const currentZoom = ref(9)

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

// Center map when search results list changes
watch(() => searchResultsStore.searchResultsList, () => {
    recenterMap()
}, { deep: true })

const handleMapMovement = () => {
    emit('map-moved')
}

const setLocation = (lat: number, lng: number) => {
    const locationExists = lng && lat

    currentLocation.value = locationExists ? { lat, lng } : defaultLocation
}

const recenterMap = () => {
    const allCoordinates = getAllCurrentCoordinates()
    if (!allCoordinates || !allCoordinates.length)
        return

    const center = calculateCenter(allCoordinates)
    setLocation(center.lat, center.lng)

    // Calculate and set appropriate zoom level
    currentZoom.value = calculateZoomLevel(allCoordinates)
}

const getAllCurrentCoordinates = () => {
    const currentLocations = searchResultsStore.searchResultsList
    if (!currentLocations || !currentLocations.length)
        return

    const allCoordinates = currentLocations
        .map(result => result.facilities[0])
        .filter(facility => facility?.mapLatitude && facility?.mapLongitude)
        .map(facility => ({
            lat: facility.mapLatitude!,
            lng: facility.mapLongitude!
        }))

    return allCoordinates
}

const calculateCenter = (coordinates: { lat: number, lng: number }[]) => {
    if (coordinates.length === 0) return defaultLocation
    if (coordinates.length === 1) return coordinates[0]

    const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length
    const avgLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length

    return { lat: avgLat, lng: avgLng }
}

const calculateZoomLevel = (coordinates: { lat: number, lng: number }[]) => {
    if (coordinates.length <= 1) return 12

    const allLats = coordinates.map(coord => coord.lat)
    const allLngs = coordinates.map(coord => coord.lng)

    const latDiff = Math.max(...allLats) - Math.min(...allLats)
    const lngDiff = Math.max(...allLngs) - Math.min(...allLngs)

    const maxDiff = Math.max(latDiff, lngDiff)

    // Zoom levels based on coordinate span
    switch (true) {
        case maxDiff > 5: return 6
        case maxDiff > 2: return 7
        case maxDiff > 1: return 8
        case maxDiff > 0.5: return 9
        case maxDiff > 0.1: return 10
        case maxDiff > 0.05: return 11
        default: return 12
    }
}
</script>
