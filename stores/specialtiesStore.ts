import { defineStore } from 'pinia'
import type { Specialty } from '~/typedefs/gqlTypes.js'

export const useSpecialtiesStore = defineStore('specialtiesStore', () => ({ specialtyDisplayOptions }))

export interface SpecialtyDisplayOption {
    code: Specialty
    displayText: string
}

const specialtyDisplayOptions = [
    { code: '', displayText: '----Any----' },
    { code: 'ALLERGY_AND_IMMUNOLOGY', displayText: 'Allergy and Immunology' },
    { code: 'ANESTHESIOLOGY', displayText: 'Anesthesiology' },
    { code: 'DERMATOLOGY', displayText: 'Dermatology' },
    { code: 'DIAGNOSTIC_RADIOLOGY', displayText: 'Diagnostic Radiology' },
    { code: 'EMERGENCY_MEDICINE', displayText: 'Emergency Medicine' },
    { code: 'FAMILY_MEDICINE', displayText: 'Family Medicine' },
    { code: 'INTERNAL_MEDICINE', displayText: 'Internal Medicine' },
    { code: 'INFECTIOUS_DISEASES', displayText: 'Infectious Diseases' },
    { code: 'GENERAL_MEDICINE', displayText: 'General Medicine' },
    { code: 'MEDICAL_GENETICS', displayText: 'Medical Genetics' },
    { code: 'NEUROLOGY', displayText: 'Neurology' },
    { code: 'NUCLEAR_MEDICINE', displayText: 'Nuclear Medicine' },
    { code: 'OBSTETRICS_AND_GYNECOLOGY', displayText: 'Obstetrics and Gynecology' },
    { code: 'OPHTHALMOLOGY', displayText: 'Ophthalmology' },
    { code: 'PATHOLOGY', displayText: 'Pathology' },
    { code: 'PEDIATRICS', displayText: 'Pediatrics' },
    { code: 'PHYSICAL_MEDICINE_AND_REHABILITATION', displayText: 'Physical Medicine and Rehabilitation' },
    { code: 'PREVENTIVE_MEDICINE', displayText: 'Preventive Medicine' },
    { code: 'PSYCHIATRY', displayText: 'Psychiatry' },
    { code: 'RADIATION_ONCOLOGY', displayText: 'Radiation Oncology' },
    { code: 'SURGERY', displayText: 'Surgery' },
    { code: 'UROLOGY', displayText: 'Urology' }] as SpecialtyDisplayOption[]
