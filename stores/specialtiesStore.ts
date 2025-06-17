import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { Specialty } from '~/typedefs/gqlTypes.js'

export const useSpecialtiesStore = defineStore('specialtiesStore', () => {
    const { t } = useI18n()

    const topSpecialties = [
        { code: 'DENTISTRY', displayText: t('specialties.dentistry') },
        { code: 'DERMATOLOGY', displayText: t('specialties.dermatology') },
        { code: 'PEDIATRICS', displayText: t('specialties.pediatrics') },
        { code: 'OBSTETRICS_AND_GYNECOLOGY', displayText: t('specialties.obstetricsAndGynecology') },
        { code: 'GENERAL_PRACTITIONER', displayText: t('specialties.generalPractitioner') },
        { code: 'PSYCHIATRY', displayText: t('specialties.psychiatry') },
        { code: 'PHYSIOTHERAPY', displayText: t('specialties.physiotherapy') },
        { code: 'OPTOMETRY', displayText: t('specialties.optometry') },
        { code: 'ENT_SPECIALIST', displayText: t('specialties.entSpecialist') },
        { code: 'EMERGENCY_MEDICINE', displayText: t('specialties.emergencyMedicine') }
    ]

    const specialtyDisplayOptions = [
        { code: '', displayText: '----Any----' },
        { code: 'ALLERGY_AND_IMMUNOLOGY', displayText: t('specialties.allergyAndImmunology') },
        { code: 'ANESTHESIOLOGY', displayText: t('specialties.anesthesiology') },
        { code: 'CARDIOLOGY', displayText: t('specialties.cardiology') },
        { code: 'DENTISTRY', displayText: t('specialties.dentistry') },
        { code: 'DERMATOLOGY', displayText: t('specialties.dermatology') },
        { code: 'DIAGNOSTIC_RADIOLOGY', displayText: t('specialties.diagnosticRadiology') },
        { code: 'EMERGENCY_MEDICINE', displayText: t('specialties.emergencyMedicine') },
        { code: 'ENT_SPECIALIST', displayText: t('specialties.entSpecialist') },
        { code: 'INFECTIOUS_DISEASES', displayText: t('specialties.infectiousDiseases') },
        { code: 'GENERAL_PRACTITIONER', displayText: t('specialties.generalPractitioner') },
        { code: 'MEDICAL_GENETICS', displayText: t('specialties.medicalGenetics') },
        { code: 'NEUROLOGY', displayText: t('specialties.neurology') },
        { code: 'NUCLEAR_MEDICINE', displayText: t('specialties.nuclearMedicine') },
        { code: 'OBSTETRICS_AND_GYNECOLOGY', displayText: t('specialties.obstetricsAndGynecology') },
        { code: 'OPHTHALMOLOGY', displayText: t('specialties.ophthalmology') },
        { code: 'OPTOMETRY', displayText: t('specialties.optometry') },
        { code: 'ORTHOPEDIC_SURGERY', displayText: t('specialties.orthopedicSurgery') },
        { code: 'PATHOLOGY', displayText: t('specialties.pathology') },
        { code: 'PEDIATRICS', displayText: t('specialties.pediatrics') },
        { code: 'PHYSIOTHERAPY', displayText: t('specialties.physiotherapy') },
        { code: 'PREVENTIVE_MEDICINE', displayText: t('specialties.preventiveMedicine') },
        { code: 'PSYCHIATRY', displayText: t('specialties.psychiatry') },
        { code: 'PHYSICAL_MEDICINE_AND_REHABILITATION', displayText: t('specialties.physicalMedicineAndRehabilitation') },
        { code: 'RADIATION_ONCOLOGY', displayText: t('specialties.radiationOncology') },
        { code: 'SPORTS_MEDICINE', displayText: t('specialties.sportsMedicine') },
        { code: 'TRAUMATOLOGY', displayText: t('specialties.traumatology') },
        { code: 'UROLOGY', displayText: t('specialties.urology') }
        // Intentionally excluded specialties
        // { code: 'SURGERY', displayText: t('specialties.surgery') },
        // Combined into General Practitioner / Pediatrition since most people don't know the nuanced difference
        // { code: 'INTERNAL_MEDICINE', displayText: t('specialties.internalMedicine') },
        // { code: 'FAMILY_MEDICINE', displayText: t('specialties.familyMedicine') },
    ] as SpecialtyDisplayOption[]

    return {
        topSpecialties,
        specialtyDisplayOptions
    }
})

export interface SpecialtyDisplayOption {
    code: Specialty
    displayText: string
}
