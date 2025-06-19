import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Specialty, SpecialtyCategory } from '~/typedefs/gqlTypes.js'

export const useSpecialtiesStore = defineStore('specialtiesStore', () => {
    const { t } = useI18n()

    const specialtyCategories = computed(() => [
        { code: SpecialtyCategory.Dental, displayText: t('specialties.dentistry') },
        { code: SpecialtyCategory.Dermatology, displayText: t('specialties.dermatology') },
        { code: SpecialtyCategory.ChildrensHealth, displayText: t('specialties.pediatrics') },
        { code: SpecialtyCategory.WomensHealth, displayText: t('specialties.obstetricsAndGynecology') },
        { code: SpecialtyCategory.PrimaryCare, displayText: t('specialties.generalPractitioner') },
        { code: SpecialtyCategory.MentalHealth, displayText: t('specialties.psychiatry') },
        { code: SpecialtyCategory.MensHealth, displayText: t('specialties.urology') },
        { code: SpecialtyCategory.PhysicalTherapy, displayText: t('specialties.physiotherapy') },
        { code: SpecialtyCategory.EyeAndVision, displayText: t('specialties.optometry') },
        { code: SpecialtyCategory.Ent, displayText: t('specialties.entSpecialist') },
        { code: SpecialtyCategory.SportsAndRehab, displayText: t('specialties.sportsMedicine') },
        { code: SpecialtyCategory.CosmeticAndPlasticSurgery, displayText: t('specialties.plasticSurgery') }
    ])

    // Map UI categories to GraphQL Specialty enum values
    const categoryToSpecialtyMap = {
        [SpecialtyCategory.Dental]: [Specialty.Dentistry],
        [SpecialtyCategory.Dermatology]: [Specialty.Dermatology],
        [SpecialtyCategory.ChildrensHealth]: [Specialty.Pediatrics],
        [SpecialtyCategory.WomensHealth]: [Specialty.ObstetricsAndGynecology],
        [SpecialtyCategory.PrimaryCare]: [Specialty.InternalMedicine],
        [SpecialtyCategory.MentalHealth]: [Specialty.Psychiatry],
        [SpecialtyCategory.PhysicalTherapy]: [Specialty.Physiotherapy],
        [SpecialtyCategory.EyeAndVision]: [Specialty.Optometry],
        [SpecialtyCategory.Ent]: [Specialty.EntSpecialist],
        [SpecialtyCategory.MensHealth]: [Specialty.Urology],
        [SpecialtyCategory.SportsAndRehab]: [Specialty.SportsMedicine],
        [SpecialtyCategory.CosmeticAndPlasticSurgery]: [Specialty.Surgery]
    }

    const specialtyDisplayOptions = computed(() => [
        { code: '', displayText: '----Any----' },
        { code: Specialty.AllergyAndImmunology, displayText: t('specialties.allergyAndImmunology') },
        { code: Specialty.Anesthesiology, displayText: t('specialties.anesthesiology') },
        { code: Specialty.Cardiology, displayText: t('specialties.cardiology') },
        { code: Specialty.Dentistry, displayText: t('specialties.dentistry') },
        { code: Specialty.Dermatology, displayText: t('specialties.dermatology') },
        { code: Specialty.DiagnosticRadiology, displayText: t('specialties.diagnosticRadiology') },
        { code: Specialty.EmergencyMedicine, displayText: t('specialties.emergencyMedicine') },
        { code: Specialty.EntSpecialist, displayText: t('specialties.entSpecialist') },
        { code: Specialty.InfectiousDiseases, displayText: t('specialties.infectiousDiseases') },
        { code: Specialty.GeneralMedicine, displayText: t('specialties.generalPractitioner') },
        { code: Specialty.MedicalGenetics, displayText: t('specialties.medicalGenetics') },
        { code: Specialty.Neurology, displayText: t('specialties.neurology') },
        { code: Specialty.NuclearMedicine, displayText: t('specialties.nuclearMedicine') },
        { code: Specialty.ObstetricsAndGynecology, displayText: t('specialties.obstetricsAndGynecology') },
        { code: Specialty.Ophthalmology, displayText: t('specialties.ophthalmology') },
        { code: Specialty.Optometry, displayText: t('specialties.optometry') },
        { code: Specialty.OrthopedicSurgery, displayText: t('specialties.orthopedicSurgery') },
        { code: Specialty.Pathology, displayText: t('specialties.pathology') },
        { code: Specialty.Pediatrics, displayText: t('specialties.pediatrics') },
        { code: Specialty.Physiotherapy, displayText: t('specialties.physiotherapy') },
        { code: Specialty.PreventiveMedicine, displayText: t('specialties.preventiveMedicine') },
        { code: Specialty.Psychiatry, displayText: t('specialties.psychiatry') },
        { code: Specialty.PhysicalMedicineAndRehabilitation, displayText: t('specialties.physicalMedicineAndRehabilitation') },
        { code: Specialty.RadiationOncology, displayText: t('specialties.radiationOncology') },
        { code: Specialty.SportsMedicine, displayText: t('specialties.sportsMedicine') },
        { code: Specialty.Traumatology, displayText: t('specialties.traumatology') },
        { code: Specialty.Urology, displayText: t('specialties.urology') },
        { code: Specialty.Surgery, displayText: t('specialties.surgery') },
        { code: Specialty.InternalMedicine, displayText: t('specialties.internalMedicine') },
        { code: Specialty.FamilyMedicine, displayText: t('specialties.familyMedicine') }
    ] as SpecialtyDisplayOption[])

    return {
        specialtyCategories,
        specialtyDisplayOptions,
        categoryToSpecialtyMap
    }
})

export interface SpecialtyDisplayOption {
    code: Specialty
    displayText: string
}
