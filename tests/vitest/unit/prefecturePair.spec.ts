/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { pairedPrefectureEn, pairedPrefectureJa } from '@/stores/locationsStore'

describe('prefecture language pair', () => {
    it('fills the Japanese prefecture from the English name', () => {
        expect(pairedPrefectureJa('Tokyo')).to.equal('東京都')
        expect(pairedPrefectureJa(' tokyo ')).to.equal('東京都')
    })

    it('fills the English prefecture from the Japanese name', () => {
        expect(pairedPrefectureEn('大阪府')).to.equal('Osaka')
        expect(pairedPrefectureEn('北海道')).to.equal('Hokkaido')
    })

    it('leaves an unknown name unpaired', () => {
        expect(pairedPrefectureJa('Not A Prefecture')).to.equal('')
        expect(pairedPrefectureEn('不明')).to.equal('')
    })
})
