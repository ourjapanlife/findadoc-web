import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Facility } from '~/typedefs/gqlTypes'

const initializeStore = () => {
    const selectedFacilities = ref(new Set<Facility>())

    return { selectedFacilities }
}

export const useFacilitySearchbarStore = defineStore('facilitySearchBar', initializeStore)
