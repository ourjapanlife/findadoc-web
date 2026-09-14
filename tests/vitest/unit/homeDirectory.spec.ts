/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    ALL_PREFECTURES,
    areaPrefectureLink,
    parseGeneratedPrefectureHubs,
    type PrefectureEntry
} from '@/utils/homeDirectory'

function prefecture(name: string): PrefectureEntry {
    const entry = ALL_PREFECTURES.find(item => item.name === name)
    if (!entry) {
        throw new Error(`missing prefecture ${name}`)
    }
    return entry
}

const tokyo = prefecture('Tokyo')
const osaka = prefecture('Osaka')

describe('parseGeneratedPrefectureHubs', () => {
    it('treats an empty runtimeConfig value as unfiltered', () => {
        expect(parseGeneratedPrefectureHubs(undefined)).to.equal(null)
        expect(parseGeneratedPrefectureHubs('')).to.equal(null)
    })

    it('reads the JSON array stored during generate', () => {
        expect(parseGeneratedPrefectureHubs('["/tokyo","/hokkaido"]')).to.deep.equal([
            '/tokyo',
            '/hokkaido'
        ])
        expect(parseGeneratedPrefectureHubs('[]')).to.deep.equal([])
    })

    it('ignores values that are not a JSON string array', () => {
        expect(parseGeneratedPrefectureHubs('not-json')).to.equal(null)
        expect(parseGeneratedPrefectureHubs('["/tokyo",1]')).to.equal(null)
    })
})

describe('areaPrefectureLink', () => {
    it('points at the prefecture hub when generate has not filtered the list', () => {
        expect(areaPrefectureLink(tokyo, null)).to.equal('/tokyo')
        expect(areaPrefectureLink(osaka, undefined)).to.equal('/osaka')
    })

    it('keeps hubs that exist in this generate and sends the rest to search', () => {
        const generated = ['/tokyo', '/hokkaido']

        expect(areaPrefectureLink(tokyo, generated)).to.equal('/tokyo')
        expect(areaPrefectureLink(osaka, generated)).to.deep.equal({
            path: '/search',
            query: { prefecture: 'osaka' }
        })
    })

    it('sends every chip to search when generate found no prefecture hubs', () => {
        expect(areaPrefectureLink(tokyo, [])).to.deep.equal({
            path: '/search',
            query: { prefecture: 'tokyo' }
        })
    })
})
