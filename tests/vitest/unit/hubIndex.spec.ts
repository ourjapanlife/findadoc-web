/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { buildHubIndex, hubPathsFromFacilities, hubSitemapUrls } from '@/utils/hubIndex'
import type { FacilitySearchResult } from '@/utils/searchDirectory'

function facility(
    id: string,
    prefectureEn: string,
    cityEn: string,
    updatedDate = '2026-08-01T00:00:00.000Z'
): FacilitySearchResult {
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
        healthcareProfessionals: [],
        updatedDate
    } as FacilitySearchResult
}

describe('buildHubIndex', () => {
    it('groups facilities by the same slugs clinic URLs use', () => {
        const { prefectures, byPrefecture } = buildHubIndex([
            facility('f2', 'Tokyo', 'Shibuya'),
            facility('f1', 'Tokyo', 'Nakano'),
            facility('f3', 'Osaka', 'Namba')
        ])

        expect(prefectures.map(hub => hub.path)).to.deep.equal(['/osaka', '/tokyo'])
        expect(byPrefecture.tokyo?.cities.map(city => city.path)).to.deep.equal([
            '/tokyo/nakano',
            '/tokyo/shibuya'
        ])
        expect(byPrefecture.tokyo?.facilities.map(row => row.id)).to.deep.equal(['f1', 'f2'])
    })

    it('keeps Chuo Ward and Chuo City as separate hubs until server normalisation lands', () => {
        const { byPrefecture } = buildHubIndex([
            facility('w1', 'Tokyo', 'Chuo Ward'),
            facility('c1', 'Tokyo', 'Chuo City')
        ])

        expect(byPrefecture.tokyo?.cities.map(city => city.citySlug).sort()).to.deep.equal([
            'chuo-city',
            'chuo-ward'
        ])
    })

    it('omits reserved first segments so /search cannot become a hub', () => {
        const { prefectures } = buildHubIndex([facility('s1', 'Search', 'Somewhere')])
        expect(prefectures).to.deep.equal([])
    })
})

describe('hub sitemap and prerender paths', () => {
    it('prerenders every hub, but sitemaps omit single-facility city pages', () => {
        const facilities = [
            facility('f1', 'Tokyo', 'Shibuya', '2026-08-02T00:00:00.000Z'),
            facility('f2', 'Tokyo', 'Shibuya', '2026-08-01T00:00:00.000Z'),
            facility('f3', 'Tokyo', 'Nakano', '2026-08-03T00:00:00.000Z')
        ]

        expect(hubPathsFromFacilities(facilities)).to.deep.equal([
            '/tokyo',
            '/tokyo/nakano',
            '/tokyo/shibuya'
        ])
        expect(hubSitemapUrls(facilities)).to.deep.equal([
            { loc: '/tokyo', lastmod: '2026-08-03T00:00:00.000Z' },
            { loc: '/tokyo/shibuya', lastmod: '2026-08-02T00:00:00.000Z' }
        ])
    })
})
