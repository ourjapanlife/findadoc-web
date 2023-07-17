<template>
    <GoogleMap ref="mapRef" :api-key="runtimeConfig.public.googleMapsApiKey"
        map-id="153d718018a2577e"
        style="height: 100%; width: 100%;"
        :center="center"
        :zoom="9">
        <Marker @click="useLocationStore().showLocationDetails(location)" :options="{position: location.position, icon: markerIcon}"
            :key="index" v-for="(location, index) in searchResults" />
    </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { useRuntimeConfig } from '#imports'
import customIcon from '../assets/images/blue-map-pin.svg'
import mockData from '../test/mockData/facilityMockData.json'
import { useModalStore } from '../stores/modalStore'
import { useLocationStore } from '../stores/locationStore'


export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    setup() {
        const center = computed(() => useLocationStore().$state.position)

        const markerIcon = {
            url: customIcon,
            scaledSize: {
                width: 45,
                height: 73
            }
        }

        const mapRef = ref(null)

        const searchResults = mockData.locations

        const runtimeConfig = useRuntimeConfig()

        return { center,
            mapRef,
            markerIcon,
            searchResults,
            runtimeConfig,
            useModalStore,
            useLocationStore }
    }
})

// todo:
// Philip: when you click on a map pin, also select the item on the list. use Pinia to store the state
// show minimal info on hover like Google Maps
</script>
