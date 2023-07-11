import { defineStore } from 'pinia'
import { List } from 'postcss/lib/list'

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
        phone: null
    }),
    actions: {
        setLocationDetails(location: { healthcareProfessionalName: string;
            specialty: string;
            facilityName: string;
            spokenLanguages: List;
            address: string;
            hours: string;
            website: string;
            phone: string }) {
            this.healthcareProfessionalName = location.healthcareProfessionalName
            this.specialty = location.specialty
            this.facilityName = location.facilityName
            this.spokenLanguages = location.spokenLanguages
            this.address = location.address
            this.hours = location.hours
            this.website = location.website
            this.phone = location.phone
        }
    }
})
