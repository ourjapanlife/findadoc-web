<template>
    <div class="h-full w-full">
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
                            alt=""
                            class="h-16 w-18 block gmp-clickable"
                        >
                    </template>
                </AdvancedMarker>
            </MarkerCluster>
        </GoogleMap>
    </div>
</template>

<script setup lang="ts">
/// <reference types="google.maps" />
import { ref, watch, nextTick, onMounted } from 'vue'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'
import type { Renderer } from '@googlemaps/markerclusterer'
import { useUmami } from '~/composables/useUmamiTracking'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useRuntimeConfig } from '#imports'
import { useThemeColors } from '~/composables/useThemeColors'
import pinTemplate from '~/assets/icons/map-pin-template.svg?raw'

/*
 * The map is a view over the store's results and nothing more: pins mirror
 * `searchResultsList`, the active pin mirrors `activeFacility`, and interaction is reported
 * upward as events. The page decides what a pin click means (it opens the details panel via
 * the URL), so this component knows nothing about panels or sheets.
 */
const emit = defineEmits<{
    (e: 'select', facilityId: string): void
    (e: 'deselect'): void
}>()

const defaultLocation = { lat: 35.6804, lng: 139.769 } as Location
const currentLocation = ref(defaultLocation)
const currentZoom = ref(9)

const searchResultsStore = useSearchResultsStore()
const mapRef = ref<{ map: google.maps.Map } | null>(null)
const markerClusterRef = ref<typeof MarkerCluster | null>(null)
const runtimeConfig = useRuntimeConfig()

const markerIcons = ref<Record<string, string>>({})

const isMapReady = ref(false)
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

const { track } = useUmami()

// Base function to create pin icon with swappable center content
const createPinIcon = (color: string, width: number, height: number, centerContent: string): string => {
    // Use imported SVG template and replace placeholders
    const svg = pinTemplate
        .replace('{{PIN_COLOR}}', color)
        .replace('{{CENTER_CONTENT}}', centerContent)
        .replace('preserveAspectRatio="xMidYMid meet"', `width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"`)

    return `data:image/svg+xml;base64,${import.meta.client ? window.btoa(svg) : ''}`
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
            class="block h-18 w-20"
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

        const AdvancedMarkerElement = import.meta.client
            ? window.google?.maps?.marker?.AdvancedMarkerElement
            : undefined
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

const handlePinClick = (resultId: string) => {
    emit('select', resultId)
    track('Map Pin Clicked', { facilityId: resultId })
}

const handleMapClick = () => {
    if (searchResultsStore.activeFacilityId) {
        emit('deselect')
    }
}

onMounted(() => {
    // This Google Maps Library Component will try to render before the component and throw a JS error.
    // This is a trick to prevent it from rendering until the component is mounted.
    setTimeout(() => { isMapReady.value = true }, 10)
})

const handleZoomChanged = () => {
    const zoom = mapRef.value?.map?.getZoom()
    if (typeof zoom === 'number') {
        currentZoom.value = zoom
    }
}

const adjustMapToActiveResult = () => {
    const active = searchResultsStore.activeFacility
    if (!active) {
        return
    }

    // When the user selects a location, zoom in a bit to make it easier to see
    if (currentZoom.value < 8) {
        currentZoom.value = 10
    }

    setLocation(active.mapLatitude ?? defaultLocation.lat, active.mapLongitude ?? defaultLocation.lng)
}

const setLocation = (lat: number, lng: number) => {
    const locationExists = lng && lat

    currentLocation.value = locationExists ? { lat, lng } : defaultLocation
}

const recenterMap = () => {
    const allCoordinates = getAllCurrentCoordinates()
    if (!allCoordinates || !allCoordinates.length)
        return

    currentZoom.value = calculateZoomLevel(allCoordinates)

    const center = calculateAvgCenter(allCoordinates)
    setLocation(center.lat, center.lng)
}

const getAllCurrentCoordinates = () => {
    const currentLocations = searchResultsStore.searchResultsList
    if (!currentLocations || !currentLocations.length)
        return

    return currentLocations
        .filter(facility => facility.mapLatitude && facility.mapLongitude)
        .map(facility => ({
            lat: facility.mapLatitude!,
            lng: facility.mapLongitude!
        }))
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

/*
 * Watchers live at the end, after every function they call.
 *
 * `immediate: true` runs the callback synchronously during setup, so when this sat above the
 * `const` arrow functions it referenced, it threw "Cannot access 'recenterMap' before
 * initialization" and the map never mounted at all. Function declarations would hoist; these
 * do not.
 */
watch(() => searchResultsStore.activeFacility, adjustMapToActiveResult)

// Fit the map to the results whenever they change, including the set already loaded on mount.
watch(() => searchResultsStore.searchResultsList, recenterMap, { immediate: true })
</script>
