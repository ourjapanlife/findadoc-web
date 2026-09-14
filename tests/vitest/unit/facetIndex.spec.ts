/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    attachProfessionalsToFacilities,
    buildFacetIndex,
    facetPathsFromFacilities,
    facetSitemapUrls
} from '@/utils/facetIndex'
import { Locale, Specialty } from '~/typedefs/gqlTypes'

function professional(
    id: string,
    specialties: Specialty[],
    languages: Locale[],
    updatedDate = '2026-08-01T00:00:00.000Z'
) {
    return {
        id,
        specialties,
        spokenLanguages: languages,
        updatedDate
    }
}

function facility(
    id: string,
    prefectureEn: string,
    cityEn: string,
    professionals: ReturnType<typeof professional>[],
    updatedDate = '2026-08-01T00:00:00.000Z'
) {
    return {
        id,
        nameEn: id,
        nameJa: id,
        contact: {
            address: {
                prefectureEn,
                cityEn,
                prefectureJa: `${prefectureEn}-ja`,
                cityJa: `${cityEn}-ja`
            }
        },
        healthcareProfessionals: professionals,
        updatedDate
    }
}

describe('buildFacetIndex', () => {
    it('indexes prefecture × specialty and prefecture × language only at 3 professionals', () => {
        const facilities = [
            facility('f1', 'Tokyo', 'Shibuya', [
                professional('p1', [Specialty.Dentistry], [Locale.EnUs]),
                professional('p2', [Specialty.Dentistry], [Locale.EnUs])
            ]),
            facility('f2', 'Tokyo', 'Shibuya', [
                professional('p3', [Specialty.Dentistry], [Locale.JaJp])
            ]),
            facility('f3', 'Tokyo', 'Nakano', [
                professional('p4', [Specialty.Psychiatry], [Locale.EnUs])
            ])
        ]

        const { facets, byPrefecture } = buildFacetIndex(facilities)

        expect(facets.map(facet => facet.path).sort()).to.deep.equal([
            '/tokyo/dentistry',
            '/tokyo/english-speaking'
        ])
        expect(byPrefecture.tokyo?.specialties.map(facet => facet.professionalCount)).to.deep.equal([3])
        expect(byPrefecture.tokyo?.languages.map(facet => facet.path)).to.deep.equal([
            '/tokyo/english-speaking'
        ])
        expect(facetPathsFromFacilities(facilities)).to.include('/tokyo/dentistry')
        expect(facetSitemapUrls(facilities).map(url => url.loc).sort()).to.deep.equal([
            '/tokyo/dentistry',
            '/tokyo/english-speaking'
        ])
    })

    it('does not emit a page for two matching professionals', () => {
        const { facets } = buildFacetIndex([
            facility('f1', 'Osaka', 'Namba', [
                professional('p1', [Specialty.Dentistry], [Locale.EnUs]),
                professional('p2', [Specialty.Dentistry], [Locale.EnUs])
            ])
        ])
        expect(facets).to.deep.equal([])
    })

    it('counts a professional once even when they appear on two facilities', () => {
        const dentist = professional('p-same', [Specialty.Psychiatry], [Locale.EnUs])
        const { facets } = buildFacetIndex([
            facility('f1', 'Tokyo', 'Shibuya', [dentist, professional('p2', [Specialty.Psychiatry], [])]),
            facility('f2', 'Tokyo', 'Nakano', [dentist, professional('p3', [Specialty.Psychiatry], [])])
        ])

        expect(facets.find(facet => facet.path === '/tokyo/psychiatry')?.professionalCount).to.equal(3)
    })

    it('joins professionals onto sitemap facility rows by facilityIds', () => {
        const attached = attachProfessionalsToFacilities(
            [{
                id: 'f1',
                contact: { address: { prefectureEn: 'Tokyo', cityEn: 'Shibuya' } }
            }],
            [
                { id: 'p1', facilityIds: ['f1'], specialties: [Specialty.Dentistry], spokenLanguages: [Locale.EnUs] },
                { id: 'p2', facilityIds: ['f1'], specialties: [Specialty.Dentistry], spokenLanguages: [Locale.EnUs] },
                { id: 'p3', facilityIds: ['f1'], specialties: [Specialty.Dentistry], spokenLanguages: [Locale.EnUs] }
            ]
        )

        expect(buildFacetIndex(attached).facets.map(facet => facet.path)).to.deep.equal([
            '/tokyo/dentistry',
            '/tokyo/english-speaking'
        ])
    })
})
