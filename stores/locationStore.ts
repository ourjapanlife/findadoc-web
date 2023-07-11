import { defineStore } from 'pinia'
import { List } from 'postcss/lib/list'

export const useLocationStore = defineStore({
    id: 'location-store',
    state: () => ({
        healthcareProfessionalName: 'some name',
        specialty: 'some specialty',
        facilityName: 'some facility',
        spokenLanguages: ['japanese', 'english'],
        address: '1-2-3 ShinTokyo',
        hours: '10am - 5pm',
        website: 'findadoc.jp',
        phone: '080-1234-4455'
    }),
    actions: {
        showModal(location: { healthcareProfessionalName: string;
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
