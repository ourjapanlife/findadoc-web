import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { useHealthcareProfessionalsStore } from '@/stores/healthcareProfessionalsStore'
import { Locale, type HealthcareProfessional } from '~/typedefs/gqlTypes.js'

describe('HealthCareProfessionalStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with default values', () => {
        const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

        expect(healthcareProfessionalsStore.healthcareProfessionalsData).to.deep.equal([])
        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalId).to.equal('')
        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalData).to.equal(undefined)
        expect(healthcareProfessionalsStore.removedHealthcareProfessionalNames).to.deep.equal([])
        expect(healthcareProfessionalsStore.selectedFacilities).to.deep.equal([])
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.names).to.deep.equal([])
    })

    it('should set selected healthcare professional and update the section fields', () => {
        const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
        const mockHealthcareProfessional: HealthcareProfessional = {
            id: '123',
            acceptedInsurance: [],
            createdDate: '2025-04-14',
            updatedDate: '2025-04-15',
            degrees: [],
            facilityIds: ['facility1'],
            names: [{ firstName: 'John', lastName: 'Doe', middleName: 'Deer', locale: Locale.EnUs }],
            specialties: [],
            spokenLanguages: [Locale.EnUs]
        }

        healthcareProfessionalsStore.healthcareProfessionalsData = [mockHealthcareProfessional]
        healthcareProfessionalsStore.setSelectedHealthcareProfessional('123')

        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalId).to.equal('123')
        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalData?.id).to.equal('123')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.id).to.equal('123')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance).to.deep.equal([])
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.createdDate).to.equal('2025-04-14')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.updatedDate).to.equal('2025-04-15')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees).to.deep.equal([])
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds[0]).to.equal('facility1')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0].firstName).to.equal('John')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0].middleName).to.equal('Deer')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0].lastName).to.equal('Doe')
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties).to.deep.equal([])
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages[0]).to.equal(Locale.EnUs)
    })
})
