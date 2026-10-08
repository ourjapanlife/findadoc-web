/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { Locale } from '~/typedefs/gqlTypes'
import { placeLabelFromMapsUrl, validateSubmittedSpokenLanguages } from '@/utils/formValidations'

describe('submit form languages and maps preview', () => {
    it('requires a language besides Japanese', () => {
        expect(validateSubmittedSpokenLanguages([])).to.equal(false)
        expect(validateSubmittedSpokenLanguages([Locale.JaJp])).to.equal(false)
        expect(validateSubmittedSpokenLanguages([Locale.EnUs])).to.equal(true)
        expect(validateSubmittedSpokenLanguages([Locale.JaJp, Locale.EnUs, Locale.KoKr])).to.equal(true)
    })

    it('reads a place name from a maps place URL and ignores other links', () => {
        expect(placeLabelFromMapsUrl('https://www.google.com/maps/place/Shibuya+Clinic/@35,139,17z'))
            .to.equal('Shibuya Clinic')
        expect(placeLabelFromMapsUrl('https://maps.app.goo.gl/abc123XYZ')).to.equal(null)
        expect(placeLabelFromMapsUrl('https://example.com/place/Clinic')).to.equal(null)
    })
})
