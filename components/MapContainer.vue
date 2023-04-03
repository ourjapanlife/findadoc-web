<template>
    <GoogleMap ref="mapRef" :api-key="runtimeConfig.public.googleMapsApiKey"
        map-id="153d718018a2577e"
        style="height: 100%; width: 100%;"
        :center="center"
        :zoom="9">
        <Marker @click="$emit('isOpen: true')" :options="{position: location.position, icon: markerIcon}"
            :key="index" v-for="(location, index) in searchResults">
            <!-- <InfoWindow :options="{ position: location.position, minWidth: '400', minHeight: '300'}">
                <SearchResultDetails :facility-name="location.facilityName"
                    :facility-type="location.facilityType"
                    :spoken-languages="location.spokenLanguages"
                    :name="location.healthcareProfessionalName"
                    :specialty="location.specialty"
                    :address="location.address"
                    :hours="location.hours"
                    :website="location.website"
                    :phone="location.phone" />
            </InfoWindow> -->
        </Marker>
    </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import { useRuntimeConfig } from '#imports'
import customIcon from '~/assets/images/blue-map-pin.svg'
import mockData from '~/test/mockData/facilityMockData.json'


export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker, InfoWindow },
    emits: ['isOpen: true'],
    setup() {
        // let showModal = true


        // function toggleModal(showModal: boolean) {
        //     showModal = !showModal

        //     console.log('showModal =', showModal)

        //     return showModal
        // }

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

        return { center,
            currentMarkerIndex,
            mapRef,
            markerIcon,
            markerOptions,
            searchResults,
            runtimeConfig }
    }
})

// todo:
// set the position of the SRD to fixed
// create open/close function SearchResultDetails (SRD)
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

