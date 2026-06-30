import { expect } from 'chai'
import { validatePostalCode, validatePhoneNumber } from '@/utils/formValidations'

describe('validatePostalCode', () => {
    it('accepts a half-width postal code', () => {
        expect(validatePostalCode('123-4567')).to.be.true
    })

    it('accepts a full-width postal code typed with a Japanese IME', () => {
        // Full-width digits and full-width hyphen, as produced by a kana IME.
        expect(validatePostalCode('１２３－４５６７')).to.be.true
    })

    it('accepts full-width digits combined with an ASCII hyphen', () => {
        expect(validatePostalCode('１２３-４５６７')).to.be.true
    })

    it('rejects a postal code with no hyphen', () => {
        expect(validatePostalCode('1234567')).to.be.false
        expect(validatePostalCode('１２３４５６７')).to.be.false
    })

    it('rejects a postal code with the wrong digit count', () => {
        expect(validatePostalCode('12-3456')).to.be.false
    })
})

describe('validatePhoneNumber', () => {
    it('accepts a half-width phone number', () => {
        expect(validatePhoneNumber('090-1234-5678')).to.be.true
    })

    it('accepts a full-width phone number typed with a Japanese IME', () => {
        expect(validatePhoneNumber('０９０-１２３４-５６７８')).to.be.true
    })

    it('rejects an empty phone number', () => {
        expect(validatePhoneNumber('')).to.be.false
    })

    it('rejects a non-numeric phone number', () => {
        expect(validatePhoneNumber('abc')).to.be.false
    })
})
