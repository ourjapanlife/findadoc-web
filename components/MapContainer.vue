<template>
    <div class="">
        <GoogleMap
            v-if="isMapReady"
            ref="mapRef"
            data-testid="map-of-japan"
            :api-key="runtimeConfig.public.GOOGLE_MAPS_API_KEY as string ?? undefined"
            :libraries="['marker']"
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
                ref="markerClusterRef"
                :options="{
                    //vue3-google-map's Renderer type expects legacy Marker,
                    // but we use AdvancedMarkerElement which works at runtime because their types aren't updated,
                    // but it's valid according to the underlying google maps API type
                    renderer: clusterRenderer as unknown as Renderer,
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
                        title: location.nameEn || location.nameJa || 'Facility',
                    }"
                    @click="() => handlePinClick(location.id)"
                >
                    <template #content>
                        <img
                            :src="renderMarkerIcon(location.id)"
                            class="w-[45px] h-[73px] block gmp-clickable"
                        >
                    </template>
                </AdvancedMarker>
            </MarkerCluster>
        </GoogleMap>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'
import type { Renderer } from '@googlemaps/markerclusterer'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useRuntimeConfig } from '#imports'
import { BottomSheetType, useBottomSheetStore } from '~/stores/bottomSheetStore'
import { useScreenOrientation } from '~/composables/useScreenOrientation'
import { useThemeColors } from '~/composables/useThemeColors'
import pinTemplate from '~/assets/icons/map-pin-template.svg?raw'

const defaultLocation = { lat: 35.6804, lng: 139.769 } as Location
const currentLocation = ref(defaultLocation)
const currentZoom = ref(9)

const searchResultsStore = useSearchResultsStore()
const mapRef = ref<{ map: google.maps.Map } | null>(null)
const markerClusterRef = ref<typeof MarkerCluster | null>(null)
const runtimeConfig = useRuntimeConfig()
const bottomSheetStore = useBottomSheetStore()

const markerIcons = ref<Record<string, string>>({})

// Emit events for map movement
const emit = defineEmits(['map-moved'])

const isMapReady = ref(false)
const { isLandscape } = useScreenOrientation()
const { getPrimaryColor, getSecondaryColor, themeChanged } = useThemeColors()

type Location = {
    lat: number
    lng: number
}

interface ClusterData {
    markers: unknown[]
    marker?: google.maps.marker.AdvancedMarkerElement
}

interface MarkerClustererInstance {
    clusters: ClusterData[]
}

// Base function to create pin icon with swappable center content
const createPinIcon = (color: string, width: number, height: number, centerContent: string): string => {
    // Use imported SVG template and replace placeholders
    const svg = pinTemplate
        .replace('{{PIN_COLOR}}', color)
        .replace('{{CENTER_CONTENT}}', centerContent)
        .replace('preserveAspectRatio="xMidYMid meet"', `width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"`)

    return `data:image/svg+xml;base64,${window.btoa(svg)}`
}

const createMarkerIcon = (isActive: boolean): string => {
    const width = 45
    const height = 73
    const color = isActive ? getSecondaryColor() : getPrimaryColor()

    const heartIcon = `
    <g transform="translate(50, 40)">
        <path d="M0,5 C-2,-10 -19,-10 -19,2 C-19,14 0,29 0,29 C0,29 19,14 19,2 C19,-10 2,-10 0,5 Z" fill="${color}"/>
        <rect x="10" y="-3" width="4" height="12" fill="white"/>
        <rect x="5" y="2" width="12" height="4" fill="white"/>
    </g>`

    return createPinIcon(color, width, height, heartIcon)
}

const renderMarkerIcon = (locationId: string): string => markerIcons.value[locationId] ?? createMarkerIcon(false)

const renderMarkerIcons = () => {
    const activeId = searchResultsStore.activeFacility?.id
    const icons: Record<string, string> = {}

    for (const location of searchResultsStore.searchResultsList) {
        icons[location.id] = createMarkerIcon(location.id === activeId)
    }
    markerIcons.value = icons
}

// Build cluster marker content element
const createClusterMarkerContent = (count: number): HTMLDivElement => {
    const width = 45
    const height = 73
    const content = document.createElement('div')
    content.innerHTML = `
        <img
            src="${createClusterIcon(count, width, height)}"
            style="width: ${width}px; height: ${height}px; display: block;"
        />
    `
    return content
}

// Update existing cluster markers with new themed icons
const renderClusterMarkerIcons = () => {
    const markerClusterInstance = (markerClusterRef.value as { markerCluster?: MarkerClustererInstance })?.markerCluster
    if (!markerClusterInstance?.clusters) return

    for (const cluster of markerClusterInstance.clusters) {
        // Only update actual clusters (2+ markers), not single markers
        if (cluster.marker && cluster.markers.length > 1) {
            cluster.marker.content = createClusterMarkerContent(cluster.markers.length)
        }
    }
}

// Note: Inline SVG generation is required because Google Maps markers need data URIs
// with dynamic values (count, fontSize, primaryColor) that can't be set with CSS classes
const createClusterIcon = (count: number, width: number, height: number) => {
    // match font size based on the zoom size of the map and number of digits
    const digits = String(count).length
    const fontSize = Math.max(14, Math.round(height * (digits <= 2 ? 0.42 : digits === 3 ? 0.28 : 0.23)))
    const primaryColor = getPrimaryColor()

    // Number text centered in the white circle
    const numberContent = `<text x="49.5" y="49.5" text-anchor="middle" dominant-baseline="middle"
                font-family="Inter, Arial, sans-serif" font-weight="700"
                font-size="${fontSize}" fill="${primaryColor}">${count}</text>`

    return createPinIcon(primaryColor, width, height, numberContent)
}

const clusterRenderer = {
    render: (
        cluster: { count: number, position: google.maps.LatLng },
        _stats: unknown,
        _map: google.maps.Map
    ): google.maps.marker.AdvancedMarkerElement => {
        const { count, position } = cluster

        const AdvancedMarkerElement = window.google?.maps?.marker?.AdvancedMarkerElement
        if (!AdvancedMarkerElement) {
            throw new Error('AdvancedMarkerElement not available')
        }

        return new AdvancedMarkerElement({
            position,
            content: createClusterMarkerContent(count),
            zIndex: 1000000 + count,
            title: `Cluster of ${count}`
        })
    }
}

// Re-render icons when theme changes or active facility changes
watch(themeChanged, () => {
    renderMarkerIcons()
    nextTick(renderClusterMarkerIcons)
})
watch(() => searchResultsStore.activeFacility, renderMarkerIcons)

// UX hack: When the map is moved from search results, we don't want to minimize the bottom sheet
// This is because the map movement is triggered by the search results list changing,
// which is also triggered by the bottom sheet opening
const isMapMovingFromSearchResults = ref(false)

const handlePinClick = (resultId: string) => {
    //Let's show the result details
    searchResultsStore.setActiveFacility(resultId)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)
    bottomSheetStore.isMinimized = false

    //Even though the watch() will update the location, we need to set it here to ensure the map is centered on the new result
    nextTick(() => {
        setLocation(currentLocation.value.lat, currentLocation.value.lng)
    })
}

const handleMapClick = () => {
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

const calculateAvgCenter = (coordinates: { lat: number, lng: number }[]): Location => {
    if (coordinates.length === 0) return defaultLocation
    if (coordinates.length === 1) return coordinates[0] as Location

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
