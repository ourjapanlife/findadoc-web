import { expect } from 'chai'
import { validateGoogleMapsUrlInput } from '@/utils/formValidations'

describe('validateGoogleMapsUrlInput', () => {
    it('accepts full google.com/maps place URLs', () => {
        expect(validateGoogleMapsUrlInput('https://www.google.com/maps/place/Some+Clinic')).to.be.true
    })

    it('accepts google.co.jp/maps URLs', () => {
        expect(validateGoogleMapsUrlInput('https://www.google.co.jp/maps/place/Some+Clinic')).to.be.true
    })

    it('accepts maps.google.com URLs', () => {
        expect(validateGoogleMapsUrlInput('https://maps.google.com/?q=Some+Clinic')).to.be.true
    })

    // The "Share" button in the Google Maps app/website hands users these short
    // links — the format the doctor could not submit before this fix.
    it('accepts maps.app.goo.gl share links', () => {
        expect(validateGoogleMapsUrlInput('https://maps.app.goo.gl/abc123XYZ')).to.be.true
    })

    it('accepts legacy goo.gl/maps share links', () => {
        expect(validateGoogleMapsUrlInput('https://goo.gl/maps/abc123XYZ')).to.be.true
    })

    it('trims surrounding whitespace before validating', () => {
        expect(validateGoogleMapsUrlInput('  https://maps.app.goo.gl/abc123XYZ  ')).to.be.true
    })

    it('rejects a non-google https URL', () => {
        expect(validateGoogleMapsUrlInput('https://example.com')).to.be.false
    })

    it('rejects a non-https URL', () => {
        expect(validateGoogleMapsUrlInput('http://example.com')).to.be.false
    })

    it('rejects an empty string', () => {
        expect(validateGoogleMapsUrlInput('')).to.be.false
    })
})
