/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { ALL_PREFECTURES, areaPrefectureLink } from '@/utils/homeDirectory'

const tokyo = ALL_PREFECTURES[0]
const osaka = ALL_PREFECTURES[2]

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
