/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    cityHubPath,
    hubCityDocumentTitle,
    hubPrefectureDocumentTitle,
    INDEXABLE_CITY_HUB_MIN_FACILITIES,
    isGeographyHubRoute,
    isIndexableCityHub,
    isReservedHubSegment,
    prefectureHubPath
} from '@/utils/hubPath'
import { formatPageTitle } from '@/utils/site'

describe('hub paths', () => {
    it('uses the same slugs as facility URLs', () => {
        expect(prefectureHubPath('Tokyo')).to.equal('/tokyo')
        expect(cityHubPath('Tokyo', 'Chuo Ward')).to.equal('/tokyo/chuo-ward')
        expect(cityHubPath('Tokyo', 'Chuo City')).to.equal('/tokyo/chuo-city')
    })

    it('does not steal existing first-segment routes', () => {
        expect(isReservedHubSegment('search')).to.equal(true)
        expect(isReservedHubSegment('doctor')).to.equal(true)
        expect(prefectureHubPath('Search')).to.equal(undefined)
        expect(cityHubPath('Doctor', 'Shibuya')).to.equal(undefined)
    })
})

describe('isGeographyHubRoute', () => {
    it('treats one- and two-segment locations as hubs, including page-file placeholders', () => {
        expect(isGeographyHubRoute('/tokyo')).to.equal(true)
        expect(isGeographyHubRoute('/tokyo/shibuya')).to.equal(true)
        expect(isGeographyHubRoute('/tokyo/shibuya/')).to.equal(true)
        expect(isGeographyHubRoute('/[prefecture]')).to.equal(true)
        expect(isGeographyHubRoute('/[prefecture]/[city]')).to.equal(true)
    })

    it('leaves titled, entity, and untitled trees alone', () => {
        expect(isGeographyHubRoute('/')).to.equal(false)
        expect(isGeographyHubRoute('/about')).to.equal(false)
        expect(isGeographyHubRoute('/search')).to.equal(false)
        expect(isGeographyHubRoute('/clinic/tokyo/nakano/a-one--f1')).to.equal(false)
        expect(isGeographyHubRoute('/doctor/aiko-tanaka--p1')).to.equal(false)
        expect(isGeographyHubRoute('/my-page')).to.equal(false)
    })
})

describe('thin city hubs', () => {
    it('indexes a city only when it has at least two facilities', () => {
        expect(INDEXABLE_CITY_HUB_MIN_FACILITIES).to.equal(2)
        expect(isIndexableCityHub(1)).to.equal(false)
        expect(isIndexableCityHub(2)).to.equal(true)
    })
})

describe('hub document titles', () => {
    it('stay under 60 characters once branded', () => {
        expect(formatPageTitle(hubPrefectureDocumentTitle('Tokyo')).length).to.be.at.most(60)
        expect(formatPageTitle(hubCityDocumentTitle('Shibuya', 'Tokyo')))
            .to.equal(formatPageTitle('Healthcare in Shibuya, Tokyo'))
    })
})
