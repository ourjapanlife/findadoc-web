<template>
  <GoogleMap
    data-testid="map-of-japan"
    ref="mapRef"
    :api-key="runtimeConfig.public.GOOGLE_MAPS_API_KEY"
    map-id="153d718018a2577e"
    style="height: 100%; width: 100%;"
    :center="center"
    :zoom="9"
  >
    <GMarker
      @click="searchResultsStore.setActiveSearchResult(location.professional.id)"
      :options="{position: { lat: location.facilities[0].mapLatitude, lng: location.facilities[0].mapLongitude }, icon: markerIcon}"
      :key="index"
      v-for="(location, index) in searchResultsStore.searchResultsList"
    />
  </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { GoogleMap, Marker as GMarker } from "vue3-google-map";
import { useRuntimeConfig } from "#imports";
import customIcon from "../assets/images/blue-map-pin.svg";
import { useSearchResultsStore } from "../stores/searchResultsStore";

export default defineComponent({
  components: { GoogleMap, GMarker },
  setup() {
    //tokyo is the default location
    const defaultLocation = { lat: 35.6804, lng: 139.769 };

    const center = computed(() => {
      const lng = useSearchResultsStore().activeResult?.facilities[0]
        .mapLongitude;
      const lat = useSearchResultsStore().activeResult?.facilities[0]
        .mapLatitude;
      const locationExists = lng && lat;

      return locationExists ? { lat, lng } : defaultLocation;
    });

    const markerIcon = {
      url: customIcon,
      scaledSize: {
        width: 45,
        height: 73
      }
    };

    const searchResultsStore = useSearchResultsStore();
    const mapRef = ref(null);
    const runtimeConfig = useRuntimeConfig();

    return { center, mapRef, markerIcon, runtimeConfig, searchResultsStore };
  }
});
</script>
