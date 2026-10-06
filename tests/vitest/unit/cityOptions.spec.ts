/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { matchOfficialCity, type CityOption } from '@/utils/cityOptions'

const tokyoChuo: CityOption = {
    id: 'tokyo-chuo',
    prefectureEn: 'Tokyo',
    slug: 'chuo',
    nameEn: 'Chuo',
    nameJa: '中央区'
}

const yamanashiChuo: CityOption = {
    id: 'yamanashi-chuo',
    prefectureEn: 'Yamanashi',
    slug: 'chuo',
    nameEn: 'Chuo',
    nameJa: '中央市'
}

const minato: CityOption = {
    id: 'minato',
    prefectureEn: 'Tokyo',
    slug: 'minato',
    nameEn: 'Minato',
    nameJa: '港区'
}

const cities = [tokyoChuo, yamanashiChuo, minato]

describe('matchOfficialCity', () => {
    it('matches the Japanese name inside the selected prefecture', () => {
        expect(matchOfficialCity(cities, 'Tokyo', 'Minato City', '港区')).to.deep.equal(minato)
        expect(matchOfficialCity(cities, 'Yamanashi', 'Chuo', '中央市')).to.deep.equal(yamanashiChuo)
    })

    it('matches an English slug that is already official', () => {
        expect(matchOfficialCity(cities, 'Tokyo', 'Minato', '港区の別表記')).to.deep.equal(minato)
    })

    it('does not treat a City suffix as the official slug', () => {
        expect(matchOfficialCity(cities, 'Tokyo', 'Chuo City', 'Chuo City')).to.equal(undefined)
        expect(matchOfficialCity(cities, 'Tokyo', 'Minato City', 'Minato City')).to.equal(undefined)
    })
})
