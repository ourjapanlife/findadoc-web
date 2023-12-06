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
      @click="store.setActiveSearchResult(location.id)"
      :options="{position: location.position, icon: markerIcon}"
      :key="index"
      v-for="(location, index) in store.searchResultsList"
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
    const defaultLocation = { lat: 35.6804, lng: 139.769 };
    const center = computed(
      () =>
        useSearchResultsStore().$state.activeResult?.position || defaultLocation
    );

    const markerIcon = {
      url: customIcon,
      scaledSize: {
        width: 45,
        height: 73
      }
    };

    const store = useSearchResultsStore();

    const mapRef = ref(null);

    const runtimeConfig = useRuntimeConfig();

    return { center, mapRef, markerIcon, runtimeConfig, store };
  }
});
</script>
