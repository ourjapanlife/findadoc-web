import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Specialty, SpecialtyCategory } from '~/typedefs/gqlTypes.js'

export const useSpecialtiesStore = defineStore('specialtiesStore', () => {
    const { t } = useI18n()

    const specialtyCategories = computed(() => [
        { code: SpecialtyCategory.Dental, displayText: t('specialtyCategories.dental') },
        { code: SpecialtyCategory.Dermatology, displayText: t('specialtyCategories.dermatology') },
        { code: SpecialtyCategory.ChildrensHealth, displayText: t('specialtyCategories.childrensHealth') },
        { code: SpecialtyCategory.WomensHealth, displayText: t('specialtyCategories.womensHealth') },
        { code: SpecialtyCategory.PrimaryCare, displayText: t('specialtyCategories.primaryCare') },
        { code: SpecialtyCategory.MentalHealth, displayText: t('specialtyCategories.mentalHealth') },
        { code: SpecialtyCategory.MensHealth, displayText: t('specialtyCategories.mensHealth') },
        { code: SpecialtyCategory.PhysicalTherapy, displayText: t('specialtyCategories.physicalTherapy') },
        { code: SpecialtyCategory.EyeAndVision, displayText: t('specialtyCategories.eyeAndVision') },
        { code: SpecialtyCategory.Ent, displayText: t('specialtyCategories.ent') },
        { code: SpecialtyCategory.SportsAndRehab, displayText: t('specialtyCategories.sportsAndRehab') },
        { code: SpecialtyCategory.CosmeticAndPlasticSurgery, displayText: t('specialtyCategories.cosmeticAndPlasticSurgery') }
    ])

    const specialtyDisplayOptions = computed(() => [
        { code: Specialty.AllergyAndImmunology, displayText: t('specialties.allergyAndImmunology') },
        { code: Specialty.Anesthesiology, displayText: t('specialties.anesthesiology') },
        { code: Specialty.Cardiology, displayText: t('specialties.cardiology') },
        { code: Specialty.Dentistry, displayText: t('specialties.dentistry') },
        { code: Specialty.Dermatology, displayText: t('specialties.dermatology') },
        { code: Specialty.DiagnosticRadiology, displayText: t('specialties.diagnosticRadiology') },
        { code: Specialty.EmergencyMedicine, displayText: t('specialties.emergencyMedicine') },
        { code: Specialty.EntSpecialist, displayText: t('specialties.entSpecialist') },
        { code: Specialty.InfectiousDiseases, displayText: t('specialties.infectiousDiseases') },
        { code: Specialty.GeneralMedicine, displayText: t('specialties.generalMedicine') },
        { code: Specialty.MedicalGenetics, displayText: t('specialties.medicalGenetics') },
        { code: Specialty.Neurology, displayText: t('specialties.neurology') },
        { code: Specialty.NuclearMedicine, displayText: t('specialties.nuclearMedicine') },
        { code: Specialty.ObstetricsAndGynecology, displayText: t('specialties.obstetricsAndGynecology') },
        { code: Specialty.Ophthalmology, displayText: t('specialties.ophthalmology') },
        { code: Specialty.Optometry, displayText: t('specialties.optometry') },
        { code: Specialty.OrthopedicSurgery, displayText: t('specialties.orthopedicSurgery') },
        { code: Specialty.Otolaryngology, displayText: t('specialties.otolaryngology') },
        { code: Specialty.Pathology, displayText: t('specialties.pathology') },
        { code: Specialty.Pediatrics, displayText: t('specialties.pediatrics') },
        { code: Specialty.Physiotherapy, displayText: t('specialties.physiotherapy') },
        { code: Specialty.PreventiveMedicine, displayText: t('specialties.preventiveMedicine') },
        { code: Specialty.Proctology, displayText: t('specialties.proctology') },
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

    // This helps us map what specialties belong under a category.
    // This is used in the onboarding flow and helpful for search results
    const categoryToSpecialtyMap = computed(() => ({
        [SpecialtyCategory.Dental]: [Specialty.Dentistry],
        [SpecialtyCategory.Dermatology]: [Specialty.Dermatology],
        [SpecialtyCategory.ChildrensHealth]: [Specialty.Pediatrics],
        [SpecialtyCategory.WomensHealth]: [Specialty.ObstetricsAndGynecology],
        [SpecialtyCategory.PrimaryCare]: [
            Specialty.InternalMedicine,
            Specialty.AllergyAndImmunology,
            Specialty.Cardiology,
            Specialty.DiagnosticRadiology,
            Specialty.EmergencyMedicine,
            Specialty.InfectiousDiseases,
            Specialty.GeneralMedicine,
            Specialty.MedicalGenetics,
            Specialty.Neurology,
            Specialty.NuclearMedicine,
            Specialty.Pathology,
            Specialty.PreventiveMedicine,
            Specialty.Otolaryngology,
            Specialty.RadiationOncology
        ],
        [SpecialtyCategory.MentalHealth]: [Specialty.Psychiatry],
        [SpecialtyCategory.PhysicalTherapy]: [Specialty.Physiotherapy],
        [SpecialtyCategory.EyeAndVision]: [Specialty.Optometry, Specialty.Ophthalmology],
        [SpecialtyCategory.Ent]: [Specialty.EntSpecialist],
        [SpecialtyCategory.MensHealth]: [Specialty.Urology],
        [SpecialtyCategory.SportsAndRehab]: [Specialty.SportsMedicine,
                                             Specialty.OrthopedicSurgery,
                                             Specialty.PhysicalMedicineAndRehabilitation],
        [SpecialtyCategory.CosmeticAndPlasticSurgery]: [Specialty.Surgery, Specialty.Anesthesiology]
    }))

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
