/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    buildHubIndex,
    hubPathsFromFacilities,
    hubSitemapUrls,
    prefectureHubPaths,
    type HubLocationSource
} from '@/utils/hubIndex'

function facility(
    id: string,
    prefectureEn: string,
    cityEn: string,
    updatedDate = '2026-08-01T00:00:00.000Z'
): HubLocationSource {
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
        updatedDate
    }
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

    it('keeps a stored Chuo City spelling off Tokyo Chuo when the Japanese name does not match', () => {
        const { byPrefecture } = buildHubIndex([
            facility('w1', 'Tokyo', 'Chuo Ward'),
            facility('c1', 'Tokyo', 'Chuo City')
        ], [{
            id: 'city-chuo',
            prefectureEn: 'Tokyo',
            slug: 'chuo',
            nameEn: 'Chuo',
            nameJa: '中央区'
        }])

        expect(byPrefecture.tokyo?.cities.map(city => city.citySlug).sort()).to.deep.equal([
            'chuo-city',
            'chuo-ward'
        ])
    })

    it('uses the official English name when the Japanese name matches the city table', () => {
        const source = facility('f1', 'Tokyo', 'Minato City')
        const { byPrefecture } = buildHubIndex([source], [{
            id: 'city-minato',
            prefectureEn: 'Tokyo',
            slug: 'minato',
            nameEn: 'Minato',
            nameJa: 'Minato City-ja'
        }])

        expect(byPrefecture.tokyo?.cities.map(city => ({
            slug: city.citySlug,
            name: city.cityEn,
            path: city.path
        }))).to.deep.equal([{ slug: 'minato-city', name: 'Minato', path: '/tokyo/minato-city' }])
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
        expect(prefectureHubPaths(hubPathsFromFacilities(facilities))).to.deep.equal(['/tokyo'])
    })
})
