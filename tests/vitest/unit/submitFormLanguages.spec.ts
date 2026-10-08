/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { Locale } from '~/typedefs/gqlTypes'
import { parseMapsPlace, placeLabelFromMapsUrl, validateSubmittedSpokenLanguages } from '@/utils/formValidations'
import { resolveMapsPlace } from '@/utils/mapsLinkPreview'

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

    it('reads the clinic name and the precise map pin from a Maps URL', () => {
        const place = parseMapsPlace(
            'https://www.google.com/maps/place/Tachikawa+Central+Hospital/@35.728,139.408,17z/data=!3d35.72812!4d139.40845'
        )

        expect(place?.name).to.equal('Tachikawa Central Hospital')
        expect(place?.latitude).to.equal(35.72812)
        expect(place?.longitude).to.equal(139.40845)
    })

    it('reads a search name and a query pin', () => {
        expect(parseMapsPlace('https://www.google.com/maps/search/Shibuya+Clinic/@35.66,139.70,15z')?.name)
            .to.equal('Shibuya Clinic')
        expect(parseMapsPlace('https://maps.google.com/?q=35.6595,139.7004')).to.deep.equal({
            name: null,
            latitude: 35.6595,
            longitude: 139.7004,
            placeId: null
        })
    })

    it('reads a Google place id and ignores a hex feature id', () => {
        const withPlaceId = 'https://www.google.com/maps/place/Clinic/@35.66,139.70,17z/data=!1sChIJshibuyaClinic!8m2'
        expect(parseMapsPlace(withPlaceId)?.placeId).to.equal('ChIJshibuyaClinic')
        expect(parseMapsPlace('https://www.google.com/maps?query_place_id=ChIJfromQuery12')?.placeId)
            .to.equal('ChIJfromQuery12')
        expect(parseMapsPlace(
            'https://www.google.com/maps/place/Clinic/@35.66,139.70,17z/data=!1s0x60188b563f2b1c19'
        )?.placeId).to.equal(null)
    })

    it('opens a share link and reads the clinic from the page it reaches', async () => {
        const destination = 'https://www.google.com/maps/place/%E6%B8%8B%E8%B0%B7%E3%82%AF%E3%83%AA%E3%83%8B%E3%83%83%E3%82%AF/@35.66,139.70,17z/data=!3d35.66111!4d139.70222'
        const fetchImpl = (async () => new Response(null, {
            status: 302,
            headers: { location: destination }
        })) as typeof fetch

        const place = await resolveMapsPlace('https://maps.app.goo.gl/abc123XYZ', fetchImpl)

        expect(place?.name).to.equal('渋谷クリニック')
        expect(place?.latitude).to.equal(35.66111)
        expect(place?.longitude).to.equal(139.70222)
    })
})
