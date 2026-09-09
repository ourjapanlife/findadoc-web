import {expect} from 'chai'
import { convertNumbers } from '~/utils/facilitiesUtils'

describe('convertNumbers', () => {
    it('accepts a half-width code', () => {
        expect(convertNumbers('123456')).to.be.true
    })

    it('accepts a full-width code', () => {
        expect(convertNumbers('１２３４５６')).to.be.true
    })

    it('converts all types of dashes', () => {
        expect(convertNumbers('−–—')).to.be.true
    })

    it('does not convert alphabetical or Japanese characters to half width', () => {
        expect(convertNumbers('ａあア亜')).to.be.true
    })
})
