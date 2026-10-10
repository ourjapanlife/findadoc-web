import { describe, expect, it } from 'vitest'
import { Locale } from '~/typedefs/gqlTypes'
import { facilityMatchesSearch, healthcareProfessionalMatchesSearch } from '~/utils/moderationListSearch'

const facility = {
    id: 'facility-1',
    nameEn: 'Tokyo Clinic',
    nameJa: '東京クリニック'
}

const professional = {
    id: 'professional-1',
    names: [
        { firstName: 'Ada', middleName: 'May', lastName: 'Lovelace', locale: Locale.EnUs },
        { firstName: 'エイダ', middleName: null, lastName: 'ラブレス', locale: Locale.JaJp }
    ]
}

describe('moderation list search', () => {
    it('keeps every facility when the query is blank', () => {
        expect(facilityMatchesSearch(facility, '  ')).toBe(true)
    })

    it('matches a facility by English name, Japanese name, or id', () => {
        expect(facilityMatchesSearch(facility, 'tokyo')).toBe(true)
        expect(facilityMatchesSearch(facility, '東京')).toBe(true)
        expect(facilityMatchesSearch(facility, 'FACILITY-1')).toBe(true)
        expect(facilityMatchesSearch(facility, 'Osaka')).toBe(false)
    })

    it('matches a professional by any name part or id', () => {
        expect(healthcareProfessionalMatchesSearch(professional, 'lovelace')).toBe(true)
        expect(healthcareProfessionalMatchesSearch(professional, 'エイダ')).toBe(true)
        expect(healthcareProfessionalMatchesSearch(professional, 'may')).toBe(true)
        expect(healthcareProfessionalMatchesSearch(professional, 'PROFESSIONAL-1')).toBe(true)
        expect(healthcareProfessionalMatchesSearch(professional, 'Curie')).toBe(false)
    })
})
