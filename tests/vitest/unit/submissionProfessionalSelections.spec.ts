import { describe, expect, it } from 'vitest'
import { Degree, Insurance, Locale, Specialty } from '~/typedefs/gqlTypes'
import { hasRequiredHealthcareProfessionalSelections } from '~/utils/moderationFormValidationUtils'

const completeSelections = {
    acceptedInsurance: [Insurance.JapaneseHealthInsurance],
    degrees: [Degree.Dds],
    specialties: [Specialty.Cardiology],
    spokenLanguages: [Locale.EnUs]
}

describe('submission professional selections', () => {
    it('is complete when approval has degrees, specialties, insurance, and languages', () => {
        expect(hasRequiredHealthcareProfessionalSelections(completeSelections)).toBe(true)
    })

    it.each([
        'acceptedInsurance',
        'degrees',
        'specialties',
        'spokenLanguages'
    ] as const)('blocks approval when %s is empty', field => {
        expect(hasRequiredHealthcareProfessionalSelections({
            ...completeSelections,
            [field]: []
        })).toBe(false)
    })
})
