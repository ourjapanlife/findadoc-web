import { defineStore } from 'pinia'
import { useModalStore } from './modalStore'

export const useLocationStore = defineStore({
    id: 'location-store',
    state: () => ({
        healthcareProfessionalName: null,
        specialty: null,
        facilityName: null,
        spokenLanguages: null,
        address: null,
        hours: null,
        website: null,
        phone: null,
        position: { lat: 35.699615, lng: 139.545596 }
    }),
    actions: {
        setLocationDetails(location: { healthcareProfessionalName: string;
            specialty: string;
            facilityName: string;
            spokenLanguages: Array<string>;
            address: string;
            hours: string;
            website: string;
            phone: string;
            position: Map<any, any>;
            }) {
            for (const key in location)
                this[key] = location[key]
        },
        showLocationDetails(location: any) {
            this.setLocationDetails(location)
            useModalStore().showModal()
        }
    }
})
