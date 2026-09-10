/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    cityHubCrumbs,
    facilityCrumbs,
    facetCrumbs,
    prefectureHubCrumbs,
    professionalCrumbs,
    professionalFacetLinks,
    RELATED_LINK_LIMIT,
    relatedFacetLinks,
    type FacetIndexByPrefecture
} from '@/utils/directoryLinks'
import { buildFacetIndex } from '@/utils/facetIndex'
import { Locale, Specialty } from '~/typedefs/gqlTypes'

function professional(
    id: string,
    specialties: Specialty[],
    languages: Locale[]
) {
    return {
        id,
        specialties,
        spokenLanguages: languages,
        updatedDate: '2026-08-01T00:00:00.000Z'
    }
}

function facility(
    id: string,
    prefectureEn: string,
    cityEn: string,
    professionals: ReturnType<typeof professional>[]
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
        updatedDate: '2026-08-01T00:00:00.000Z'
    }
}

function threeOf(
    prefix: string,
    specialties: Specialty[],
    languages: Locale[]
) {
    return [
        professional(`${prefix}-1`, specialties, languages),
        professional(`${prefix}-2`, specialties, languages),
        professional(`${prefix}-3`, specialties, languages)
    ]
}

describe('directory breadcrumb trails', () => {
    it('builds Home → prefecture → city → facility and omits missing hubs', () => {
        expect(facilityCrumbs({
            homeLabel: 'Home',
            prefectureLabel: 'Tokyo',
            prefecturePath: '/tokyo',
            cityLabel: 'Shibuya',
            cityPath: '/tokyo/shibuya',
            facilityLabel: 'Clinic'
        })).to.deep.equal([
            { label: 'Home', to: '/' },
            { label: 'Tokyo', to: '/tokyo' },
            { label: 'Shibuya', to: '/tokyo/shibuya' },
            { label: 'Clinic' }
        ])

        expect(facilityCrumbs({
            homeLabel: 'Home',
            prefectureLabel: '',
            cityLabel: '',
            facilityLabel: 'Clinic'
        })).to.deep.equal([
            { label: 'Home', to: '/' },
            { label: 'Clinic' }
        ])
    })

    it('marks hub and facet current pages as the last crumb without a link', () => {
        expect(prefectureHubCrumbs({ homeLabel: 'Home', prefectureLabel: 'Tokyo' }))
            .to.deep.equal([
                { label: 'Home', to: '/' },
                { label: 'Tokyo' }
            ])
        expect(cityHubCrumbs({
            homeLabel: 'Home',
            prefectureLabel: 'Tokyo',
            prefecturePath: '/tokyo',
            cityLabel: 'Shibuya'
        })).to.deep.equal([
            { label: 'Home', to: '/' },
            { label: 'Tokyo', to: '/tokyo' },
            { label: 'Shibuya' }
        ])
        expect(facetCrumbs({
            homeLabel: 'Home',
            prefectureLabel: 'Tokyo',
            prefecturePath: '/tokyo',
            facetLabel: 'Dentistry'
        })).to.deep.equal([
            { label: 'Home', to: '/' },
            { label: 'Tokyo', to: '/tokyo' },
            { label: 'Dentistry' }
        ])
        expect(professionalCrumbs({
            homeLabel: 'Home',
            prefectureLabel: 'Tokyo',
            prefecturePath: '/tokyo',
            professionalLabel: 'Dr A'
        })).to.deep.equal([
            { label: 'Home', to: '/' },
            { label: 'Tokyo', to: '/tokyo' },
            { label: 'Dr A' }
        ])
    })
})

describe('relatedFacetLinks', () => {
    const facilities = [
        facility('tokyo-dent', 'Tokyo', 'Shibuya', threeOf('td', [Specialty.Dentistry], [Locale.EnUs])),
        facility('tokyo-psych', 'Tokyo', 'Nakano', threeOf('tp', [Specialty.Psychiatry], [Locale.JaJp])),
        facility('osaka-dent', 'Osaka', 'Namba', threeOf('od', [Specialty.Dentistry], [Locale.EnUs])),
        facility('fukuoka-dent', 'Fukuoka', 'Hakata', [
            ...threeOf('fd', [Specialty.Dentistry], [Locale.EnUs]),
            professional('fd-4', [Specialty.Dentistry], [Locale.EnUs])
        ])
    ]
    const { byPrefecture } = buildFacetIndex(facilities)
    const tokyo = byPrefecture.tokyo!
    const tokyoDentistry = tokyo.specialties.find(facet => facet.specialty === Specialty.Dentistry)!

    it('lists other specialties in the same prefecture and the same specialty elsewhere', () => {
        const related = relatedFacetLinks(tokyoDentistry, byPrefecture)

        expect(related.samePlace.map(link => link.path)).to.deep.equal(['/tokyo/psychiatry'])
        expect(related.nearbySame.map(link => link.path)).to.deep.equal([
            '/fukuoka/dentistry',
            '/osaka/dentistry'
        ])
        expect(related.nearbySame[0]?.label).to.equal('Fukuoka')
        expect(related.nearbySame[0]?.labelJa).to.equal('Fukuoka-ja')
    })

    it('lists other languages in the same prefecture for a language facet', () => {
        const tokyoEnglish = tokyo.languages.find(facet => facet.locale === Locale.EnUs)!
        const related = relatedFacetLinks(tokyoEnglish, byPrefecture)

        expect(related.samePlace.map(link => link.path).sort()).to.deep.equal(
            tokyo.languages
                .filter(facet => facet.path !== tokyoEnglish.path)
                .map(facet => facet.path)
                .sort()
        )
        expect(related.nearbySame.map(link => link.path)).to.include('/osaka/english-speaking')
    })

    it('caps each group at RELATED_LINK_LIMIT', () => {
        const extras: FacetIndexByPrefecture = {
            tokyo: {
                specialties: [
                    tokyoDentistry,
                    ...Array.from({ length: RELATED_LINK_LIMIT + 1 }, (_, index) => ({
                        ...tokyoDentistry,
                        path: `/tokyo/extra-${index}`,
                        slug: `extra-${index}`,
                        specialty: Specialty.InternalMedicine,
                        label: `Extra ${String(index).padStart(2, '0')}`
                    }))
                ],
                languages: []
            }
        }

        const related = relatedFacetLinks(tokyoDentistry, extras)
        expect(related.samePlace).to.have.length(RELATED_LINK_LIMIT)
    })
})

describe('professionalFacetLinks', () => {
    const tokyoFacility = facility(
        'tokyo-dent',
        'Tokyo',
        'Shibuya',
        threeOf('td', [Specialty.Dentistry], [Locale.EnUs])
    )
    const osakaFacility = facility('osaka-thin', 'Osaka', 'Namba', [
        professional('o1', [Specialty.Dentistry], [Locale.EnUs]),
        professional('o2', [Specialty.Dentistry], [Locale.EnUs])
    ])
    const { byPrefecture } = buildFacetIndex([tokyoFacility, osakaFacility])

    it('links only combinations that cleared the facet threshold', () => {
        const links = professionalFacetLinks(
            { specialties: [Specialty.Dentistry], spokenLanguages: [Locale.EnUs] },
            [tokyoFacility, osakaFacility],
            byPrefecture
        )

        expect(links.map(link => link.path)).to.deep.equal([
            '/tokyo/dentistry',
            '/tokyo/english-speaking'
        ])
        expect(links.every(link => link.kind === 'specialty' || link.kind === 'language')).to.equal(true)
    })

    it('returns nothing when the professional has no matching facet pages', () => {
        const links = professionalFacetLinks(
            { specialties: [Specialty.Psychiatry], spokenLanguages: [Locale.JaJp] },
            [tokyoFacility],
            byPrefecture
        )
        expect(links).to.deep.equal([])
    })
})
