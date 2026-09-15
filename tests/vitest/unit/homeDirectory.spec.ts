/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { Locale } from '~/typedefs/gqlTypes'
import {
    ALL_PREFECTURES,
    areaPrefectureLink,
    categorySpecialtyLink,
    SEARCHABLE_LANGUAGES,
    type PrefectureEntry
} from '@/utils/homeDirectory'
import { Specialty } from '~/typedefs/gqlTypes'

function prefecture(name: string): PrefectureEntry {
    const entry = ALL_PREFECTURES.find(item => item.name === name)
    if (!entry) {
        throw new Error(`missing prefecture ${name}`)
    }
    return entry
}

const tokyo = prefecture('Tokyo')
const osaka = prefecture('Osaka')

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

describe('categorySpecialtyLink', () => {
    it('prefers the Tokyo specialty facet outside generate', () => {
        expect(categorySpecialtyLink(Specialty.Dentistry, null)).to.equal('/tokyo/dentistry')
        expect(categorySpecialtyLink(Specialty.Dentistry, undefined)).to.equal('/tokyo/dentistry')
    })

    it('uses a Tokyo facet from this generate, or another prefecture, else search', () => {
        expect(categorySpecialtyLink(Specialty.Dentistry, ['/tokyo/dentistry', '/osaka/dentistry']))
            .to.equal('/tokyo/dentistry')
        expect(categorySpecialtyLink(Specialty.Dentistry, ['/osaka/dentistry']))
            .to.equal('/osaka/dentistry')
        expect(categorySpecialtyLink(Specialty.Dentistry, [])).to.deep.equal({
            path: '/search',
            query: { specialty: 'dentistry' }
        })
    })
})

describe('SEARCHABLE_LANGUAGES', () => {
    it('lists English, then Japanese, then languages by foreign-resident population', () => {
        expect(SEARCHABLE_LANGUAGES[0]).to.equal(Locale.EnUs)
        expect(SEARCHABLE_LANGUAGES[1]).to.equal(Locale.JaJp)
        expect(SEARCHABLE_LANGUAGES.indexOf(Locale.ZhCn)).to.be.lessThan(
            SEARCHABLE_LANGUAGES.indexOf(Locale.KoKr)
        )
        expect(SEARCHABLE_LANGUAGES.indexOf(Locale.KoKr)).to.be.lessThan(
            SEARCHABLE_LANGUAGES.indexOf(Locale.TlPh)
        )
    })
})
