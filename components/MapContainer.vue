<template>
    <div class="">
        <GoogleMap
            v-if="isMapReady"
            ref="mapRef"
            data-testid="map-of-japan"
            :api-key="runtimeConfig.public.GOOGLE_MAPS_API_KEY as string ?? undefined"
            map-id="153d718018a2577e"
            :disable-default-ui="true"
            :options="{
                gestureHandling: 'cooperative',
            }"
            class="h-full w-full"
            :center="currentLocation"
            :zoom="currentZoom"
            :gesture-handling="'greedy'"
            @click="handleMapClick"
            @drag="handleMapMovement"
            @zoom_changed="handleZoomChanged"
        >
            <MarkerCluster
                :options="{
                    renderer: clusterRenderer,
                }"
            >
                <AdvancedMarker
                    v-for="location in searchResultsStore.searchResultsList"
                    :key="location.id"
                    :options="{
                        position: {
                            lat: location.mapLatitude ?? defaultLocation.lat,
                            lng: location.mapLongitude ?? defaultLocation.lng,
                        },
                    }"
                    @click="(event: MouseEvent) => handlePinClick(location.id, event)"
                >
                    <div style="text-align: center">
                        <SVGMapPin
                            :class="[
                                'w-[45px] h-[73px]',
                                searchResultsStore.activeFacility?.id === location.id
                                    ? 'text-secondary fill-secondary'
                                    : 'text-primary fill-primary',
                            ]"
                        />
                    </div>
                </AdvancedMarker>
            </MarkerCluster>
        </GoogleMap>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useRuntimeConfig } from '#imports'
import SVGMapPin from '~/assets/icons/map-pin.svg'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'
import { useScreenOrientation } from '~/composables/useScreenOrientation'

const defaultLocation = { lat: 35.6804, lng: 139.769 }
const currentLocation = ref(defaultLocation)
const currentZoom = ref(9)

const searchResultsStore = useSearchResultsStore()
const mapRef = ref<{ map: google.maps.Map } | null>(null)
const runtimeConfig = useRuntimeConfig()
const bottomSheetStore = useBottomSheetStore()

const isMapReady = ref(false)
const { isLandscape } = useScreenOrientation()

// Get the primary color from CSS variable (supports theming)
const getPrimaryColor = (): string => {
    if (typeof window === 'undefined') return '#0EB0C0' // fallback for SSR

    const root = document.documentElement
    const rgbValue = getComputedStyle(root).getPropertyValue('--color-primary').trim()

    if (!rgbValue) return '#0EB0C0' // fallback to default teal

    // Convert "14 176 192" to "#0EB0C0"
    const [r, g, b] = rgbValue.split(' ').map(Number)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const clusterRenderer = {
    render: ({ count, position }: { count: number, position: google.maps.LatLng | google.maps.LatLngLiteral }) => {
        // Match SVGMapPin dimensions
        const width = 45
        const height = 73

        return new window.google.maps.Marker({
            position,
            icon: {
                url: createClusterIcon(count, width, height),
                scaledSize: new window.google.maps.Size(width, height),
                anchor: new window.google.maps.Point(width / 2, height / 2)
            },
            zIndex: Number(window.google.maps.Marker.MAX_ZINDEX) + count
        })
    }
}

// Creates a dynamic cluster icon for Google Maps markers
// Note: Inline SVG generation is required because Google Maps markers need data URIs
// with dynamic values (count, fontSize, primaryColor) that can't be set with CSS classes
const createClusterIcon = (count: number, width: number, height: number) => {
    const digits = String(count).length
    const fontSize = Math.max(14, Math.round(height * (digits <= 2 ? 0.35 : digits === 3 ? 0.28 : 0.23)))
    const primaryColor = getPrimaryColor()

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99 144" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet">
        <g filter="url(#filter0_d_335_7363)">
          <path d="M88 44.9073C88 65.0221 66.2265 101.883 52.2449 126.204C51.0586 128.268 48.0455 128.212 46.9163 126.116C33.705 101.6 11 65.0108 11 44.9073C11 23.4194 28.237 6 49.5 6C70.763 6 88 23.4194 88 44.9073Z" fill="${primaryColor}"/>
          <ellipse cx="49.5001" cy="46.5626" rx="25.3936" ry="25.6623" fill="white"/>
          <text x="49.5" y="46.5626" text-anchor="middle" dominant-baseline="middle"
                font-family="Inter, Arial, sans-serif" font-weight="700"
                font-size="${fontSize}" fill="${primaryColor}">${count}</text>
        </g>
        <defs>
          <filter id="filter0_d_335_7363" x="0" y="0" width="99" height="147" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_dropShadow_335_7363"/>
            <feOffset dy="5"/>
            <feGaussianBlur stdDeviation="6"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_335_7363"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_335_7363" result="shape"/>
          </filter>
        </defs>
      </svg>`

    return `data:image/svg+xml;base64,${window.btoa(svg)}`
}

// UX hack: When the map is moved from search results, we don't want to minimize the bottom sheet
// This is because the map movement is triggered by the search results list changing,
// which is also triggered by the bottom sheet opening
const isMapMovingFromSearchResults = ref(false)

// Emit events for map movement
const emit = defineEmits(['map-moved'])

const handlePinClick = (resultId: string, event?: MouseEvent) => {
    event?.stopPropagation() // Prevent the map click event

    //Let's show the result details
    searchResultsStore.setActiveFacility(resultId)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)
    bottomSheetStore.isMinimized = false

    //Even though the watch() will update the location, we need to set it here to ensure the map is centered on the new result
    nextTick(() => {
        setLocation(currentLocation.value.lat, currentLocation.value.lng)
    })
}

const handleMapClick = (_event: google.maps.MapMouseEvent) => {
    // Close the panel if a facility is active
    if (searchResultsStore.activeFacilityId) {
        bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultsList)
        searchResultsStore.clearActiveSearchResult()
    }
}

onMounted(() => {
    // This Google Maps Library Component will try to render before the component and throw a JS error.
    // This is a trick to prevent it from rendering until the component is mounted.
    setTimeout(() => { isMapReady.value = true }, 10)
})

watch(() => searchResultsStore.activeFacility, () => {
    adjustMapToActiveResult()
})

// Center map when search results list changes
watch(() => searchResultsStore.searchResultsList, () => {
    adjustMapToSearchResults()
}, { deep: true })

const handleMapMovement = () => {
    if (isMapMovingFromSearchResults.value) {
        return
    }
    emit('map-moved')
}

const handleZoomChanged = () => {
    const zoom = mapRef.value?.map?.getZoom()
    if (typeof zoom === 'number') {
        currentZoom.value = zoom
    }

    if (isMapMovingFromSearchResults.value) {
        return
    }
    emit('map-moved')
}

const adjustMapToActiveResult = () => {
    if (!searchResultsStore.activeFacility) {
        return
    }

    isMapMovingFromSearchResults.value = true

    // We want to prevent the emit of the map-moved event when the user selects a location
    // because this wasn't a real movement of the map by the user
    nextTick(() => {
        setTimeout(() => {
            isMapMovingFromSearchResults.value = false
        }, 100)
    })

    // When the user selects a location, let's zoom in a bit to make it easier to see the location
    if (currentZoom.value < 8) {
        currentZoom.value = 10
    }

    const lng = searchResultsStore.activeFacility.mapLongitude ?? defaultLocation.lng
    // Offset the center slightly south to account for bottom sheet overlay
    const latOffset = calculateOffset(currentZoom.value)
    const lat = searchResultsStore.activeFacility.mapLatitude
        ? searchResultsStore.activeFacility.mapLatitude - latOffset
        : defaultLocation.lat

    setLocation(lat, lng)
}

const adjustMapToSearchResults = () => {
    isMapMovingFromSearchResults.value = true

    // We want to prevent the emit of the map-moved event when the user selects a location
    // because this wasn't a real movement of the map by the user
    nextTick(() => {
        setTimeout(() => {
            isMapMovingFromSearchResults.value = false
        }, 100)
    })

    recenterMap()
}

const setLocation = (lat: number, lng: number) => {
    const locationExists = lng && lat

    currentLocation.value = locationExists ? { lat, lng } : defaultLocation
}

const recenterMap = () => {
    const allCoordinates = getAllCurrentCoordinates()
    if (!allCoordinates || !allCoordinates.length)
        return

    // Calculate and set appropriate zoom level
    currentZoom.value = calculateZoomLevel(allCoordinates)

    const center = calculateAvgCenter(allCoordinates)
    // Offset the center slightly south to account for bottom sheet overlay
    const latOffset = calculateOffset(currentZoom.value)
    setLocation(center.lat - latOffset, center.lng)
}

const getAllCurrentCoordinates = () => {
    const currentLocations = searchResultsStore.searchResultsList
    if (!currentLocations || !currentLocations.length)
        return

    const allCoordinates = currentLocations
        .filter(facility => facility.mapLatitude && facility.mapLongitude)
        .map(facility => ({
            lat: facility.mapLatitude!,
            lng: facility.mapLongitude!
        }))

    return allCoordinates
}

const calculateOffset = (zoomLevel: number) => {
    // We don't need to offset landscape mode
    if (isLandscape.value) {
        return 0
    }

    // Calculate proper latitude offset based on zoom level
    // Use a gentler scaling factor that provides more consistent visual positioning
    const baseLatOffset = 0.05 // Base offset at zoom 12 to position at 40% from top
    const zoomDiff = 12 - zoomLevel
    const scalingFactor = Math.pow(2, zoomDiff) // Even gentler scaling for better consistency
    const latOffset = baseLatOffset * scalingFactor
    return latOffset
}

const calculateAvgCenter = (coordinates: { lat: number, lng: number }[]) => {
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
        case maxDiff > 5: return 5
        case maxDiff > 2: return 7
        case maxDiff > 1: return 8
        case maxDiff > 0.5: return 9
        case maxDiff > 0.1: return 10
        case maxDiff > 0.05: return 11
        default: return 12
    }
}
</script>
