import { defineStore } from 'pinia'
import { Specialty } from '~/typedefs/gqlTypes.js'

export const useSpecialtiesStore = defineStore('specialtiesStore', () => {
    return { specialtyDisplayOptions }
})

export interface SpecialtyDisplayOption {
    code: Specialty
    displayText: string
}

const specialtyDisplayOptions = [
    { code: '', displayText: '----Any----' },
    { code: 'ALLERGY_AND_IMMUNOLOGY', displayText: "AllergyAndImmunology" },
    { code: 'ANESTHESIOLOGY', displayText: "Anesthesiology" },
    { code: 'DERMATOLOGY', displayText: "Dermatology" },
    { code: 'DIAGNOSTIC_RADIOLOGY', displayText: "DiagnosticRadiology" },
    { code: 'EMERGENCY_MEDICINE', displayText: "EmergencyMedicine" },
    { code: 'FAMILY_MEDICINE', displayText: "FamilyMedicine" },
    { code: 'INTERNAL_MEDICINE', displayText: "InternalMedicine" },
    { code: 'MEDICAL_GENETICS', displayText: "MedicalGenetics" },
    { code: 'NEUROLOGY', displayText: "Neurology" },
    { code: 'NUCLEAR_MEDICINE', displayText: "NuclearMedicine" },
    { code: 'OBSTETRICS_AND_GYNECOLOGY', displayText: "ObstetricsAndGynecology" },
    { code: 'OPHTHALMOLOGY', displayText: "Ophthalmology" },
    { code: 'PATHOLOGY', displayText: "Pathology" },
    { code: 'PEDIATRICS', displayText: "Pediatrics" },
    { code: 'PHYSICAL_MEDICINE_AND_REHABILITATION', displayText: "PhysicalMedicineAndRehabilitation" },
    { code: 'PREVENTIVE_MEDICINE', displayText: "PreventiveMedicine" },
    { code: 'PSYCHIATRY', displayText: "Psychiatry" },
    { code: 'RADIATION_ONCOLOGY', displayText: "RadiationOncology" },
    { code: 'SURGERY', displayText: "Surgery" },
    { code: 'UROLOGY', displayText: "Urology" }] as SpecialtyDisplayOption[]
