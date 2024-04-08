import { setActivePinia, createPinia } from "pinia";
import { useLocationsStore } from "@/stores/locationsStore";
import { useLoadingStore } from '@/stores/loadingStore.js'
import { expect } from 'chai';

describe('LocationStore', () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    });
    it('should initialize with default value', () => {
        const locationStore = useLocationsStore();
        expect(locationStore.citiesDisplayOptions).to.be.empty;
    })
    it('the loading visual state should be triggered appropriately', () => {
        const loadingStore = useLoadingStore()
        expect(loadingStore.isLoading).to.be.false;
        const locationStore = useLocationsStore();
        locationStore.fetchLocations()
        expect(loadingStore.isLoading).to.be.true;
    })
    it('checking the display options', () => {
        const locationStore = useLocationsStore();
        locationStore.fetchLocations();
        expect(locationStore.citiesDisplayOptions).to.not.be.empty;
    })
})
