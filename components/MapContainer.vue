<template>
    <GoogleMap ref="mapRef" :api-key="runtimeConfig.public.googleMapsApiKey"
        map-id="153d718018a2577e"
        style="height: 100%; width: 100%;"
        :center="center"
        :zoom="9">
        <Marker @click="showLocationDetails(location)" :options="{position: location.position, icon: markerIcon}"
            :key="index" v-for="(location, index) in searchResults" />
    </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { useRuntimeConfig } from '#imports'
import customIcon from '~/assets/images/blue-map-pin.svg'
import mockData from '~/test/mockData/facilityMockData.json'
import { useModalStore } from '~/stores/modalStore'
import { useLocationStore } from '../stores/locationStore'


export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    setup() {
        const center = { lat: 35.699615, lng: 139.545596 }

        const markerIcon = {
            url: customIcon,
            scaledSize: {
                width: 45,
                height: 73
            }
        }

        const mapRef = ref(null)
        let currentMarkerIndex

        const searchResults = mockData.locations

        const markerOptions = { position: center, icon: markerIcon }

        const runtimeConfig = useRuntimeConfig()

        const showLocationDetails = async location => {
            console.log(location)
            await useLocationStore().setLocationDetails(location)
            await useModalStore().showModal()
        }

        return { center,
            currentMarkerIndex,
            mapRef,
            markerIcon,
            markerOptions,
            searchResults,
            showLocationDetails,
            runtimeConfig,
            useModalStore }
    }
})

// todo:
// clicking on a list item should center on the corresponding pin
// tie the results to the SearchResultsStore. when a map pin is selected, set the active item state in the store.
// Philip: when you click on a map pin, also select the item on the list. use Pinia to store the state
// shift to the SRD that is selected
// show minimal info on hover like Google Maps
// fix border around SRD
// center the map on the first location in the mockData
// change map color to grayscale - SOMEWHAT DONE WHEN ZOOMED OUT
// hide other icons - SOMEWHAT DONE
</script>

