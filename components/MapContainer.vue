<template>
    <div class="h-full w-full">
        <!-- eslint-disable-next-line -->
        <GoogleMap data-testid="map-of-japan" ref="mapRef" :api-key="runtimeConfig.public.GOOGLE_MAPS_API_KEY as string | undefined"
                   map-id="153d718018a2577e"
                   class="h-full w-full"
                   :center="center"
                   :zoom="9"
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
                @click="searchResultsStore.setActiveSearchResult(location.professional.id)"
            >
                <div style="text-align: center">
                    <SVGSVGBlueMapPin class="w-[45px] h-[73px]" />
                </div>
            </CustomMarker>
        </GoogleMap>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GoogleMap, CustomMarker } from 'vue3-google-map'
import { useSearchResultsStore } from '../stores/searchResultsStore'
import { useRuntimeConfig } from '#imports'
import SVGSVGBlueMapPin from '~/assets/icons/blue-map-pin.svg'

const defaultLocation = { lat: 35.6804, lng: 139.769 }

const center = computed(() => {
    const lng = useSearchResultsStore().activeResult?.facilities[0]?.mapLongitude
    const lat = useSearchResultsStore().activeResult?.facilities[0]?.mapLatitude
    const locationExists = lng && lat

    return locationExists ? { lat, lng } : defaultLocation
})

const searchResultsStore = useSearchResultsStore()
const mapRef = ref(null)
const runtimeConfig = useRuntimeConfig()
</script>
