import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { useHealthcareProfessionalsStore } from '@/stores/healthcareProfessionalsStore'
import { Insurance, Locale, Degree, Specialty, type HealthcareProfessional } from '~/typedefs/gqlTypes.js'

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
            acceptedInsurance: [Insurance.InsuranceNotAccepted],
            createdDate: '2025-04-14',
            updatedDate: '2025-04-15',
            degrees: [Degree.Md],
            facilityIds: ['facility1'],
            names: [{ firstName: 'John', lastName: 'Doe', middleName: 'Deer', locale: Locale.EnUs }],
            specialties: [Specialty.Neurology],
            spokenLanguages: [Locale.EnUs]
        }

        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalId).to.equal('')

        healthcareProfessionalsStore.healthcareProfessionalsData = [mockHealthcareProfessional]
        healthcareProfessionalsStore.setSelectedHealthcareProfessional('123')

        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalId)
            .to.equal(mockHealthcareProfessional.id)
        expect(healthcareProfessionalsStore.selectedHealthcareProfessionalData?.id)
            .to.equal(mockHealthcareProfessional.id)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.id)
            .to.equal(mockHealthcareProfessional.id)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance)
            .to.deep.equal(mockHealthcareProfessional.acceptedInsurance)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.createdDate)
            .to.equal(mockHealthcareProfessional.createdDate)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.updatedDate)
            .to.equal(mockHealthcareProfessional.updatedDate)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees)
            .to.deep.equal(mockHealthcareProfessional.degrees)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds)
            .to.deep.equal(mockHealthcareProfessional.facilityIds)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.names)
            .to.deep.equal(mockHealthcareProfessional.names)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties)
            .to.deep.equal(mockHealthcareProfessional.specialties)
        expect(healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages)
            .to.deep.equal(mockHealthcareProfessional.spokenLanguages)
    })

    it('should return the correct names based on the locale', () => {
        const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
        const mockHealthcareProfessional: HealthcareProfessional = {
            id: '123',
            acceptedInsurance: [Insurance.InsuranceNotAccepted],
            createdDate: '2025-04-14',
            updatedDate: '2025-04-15',
            degrees: [Degree.Md],
            facilityIds: ['facility1'],
            names: [{ firstName: 'John', lastName: 'Doe', middleName: 'Deer', locale: Locale.EnUs },
                    { firstName: 'ジョン', lastName: 'ドウ', middleName: 'ディア', locale: Locale.JaJp }],
            specialties: [Specialty.Neurology],
            spokenLanguages: [Locale.EnUs, Locale.JaJp]
        }

        const localeStore = useLocaleStore()

        localeStore.locale.code = Locale.EnUs
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .firstName).to.equal('John')
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .middleName).to.equal('Deer')
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .lastName).to.equal('Doe')

        localeStore.locale.code = Locale.JaJp
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .firstName).to.equal('ジョン')
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .middleName).to.equal('ディア')
        expect(healthcareProfessionalsStore.displayChosenLocaleForHealthcareProfessional(mockHealthcareProfessional)
            .lastName).to.equal('ドウ')
    })

    it('should reset the fields in the healthcare professional section', () => {
        const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .acceptedInsurance = [Insurance.InsuranceNotAccepted]
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .degrees = [Degree.Md]
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .facilityIds = ['facility1']
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .names = [{ firstName: 'John', lastName: 'Doe', middleName: 'Deer', locale: Locale.EnUs }]
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .specialties = [Specialty.Neurology]
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
            .spokenLanguages = [Locale.EnUs]

        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.acceptedInsurance)
            .to.deep.equal([Insurance.InsuranceNotAccepted])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.degrees)
            .to.deep.equal([Degree.Md])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.facilityIds)
            .to.deep.equal(['facility1'])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names)
            .to.deep.equal([{ firstName: 'John', lastName: 'Doe', middleName: 'Deer', locale: Locale.EnUs }])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.specialties)
            .to.deep.equal([Specialty.Neurology])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.spokenLanguages)
            .to.deep.equal([Locale.EnUs])

        healthcareProfessionalsStore.resetCreateHealthcareProfessionalFields()

        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.acceptedInsurance).to.deep.equal([])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.degrees).to.deep.equal([])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.facilityIds).to.deep.equal([])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names).to.deep.equal([])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.specialties).to.deep.equal([])
        expect(healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.spokenLanguages).to.deep.equal([])
    })
})
