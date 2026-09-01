import { expect } from 'chai'
import { Locale, Specialty } from '@/typedefs/gqlTypes.js'
import {
    buildSearchFilterQuery,
    readSearchFiltersFromQuery,
    specialtyToUrlValue
} from '@/utils/searchFiltersUrl.js'

const specialtyCodes = [Specialty.Pediatrics, Specialty.AllergyAndImmunology]
const languageCodes = [Locale.EnUs, Locale.ZhCn, Locale.ZhTw]
const options = { specialtyCodes, languageCodes }

describe('search filters URL helpers', () => {
    it('reads human-readable query values and preserves the exact city value', () => {
        const filters = readSearchFiltersFromQuery({
            city: 'Setagaya',
            specialty: 'pediatrics',
            language: 'en'
        }, options)

        expect(filters.city).to.equal('Setagaya')
        expect(filters.specialty).to.equal(Specialty.Pediatrics)
        expect(filters.language).to.equal(Locale.EnUs)
    })

    it('rejects an ambiguous language shorthand', () => {
        const filters = readSearchFiltersFromQuery({
            language: 'zh'
        }, options)

        expect(filters.language).to.be.undefined
    })

    it('adds canonical filter params while preserving unrelated query params', () => {
        const unrelatedKey = 'utm_source'
        const query = buildSearchFilterQuery(
            { [unrelatedKey]: 'newsletter' },
            { city: 'Setagaya', specialty: Specialty.Pediatrics, language: Locale.EnUs }
        )

        expect(query[unrelatedKey]).to.equal('newsletter')
        expect(query.city).to.equal('Setagaya')
        expect(query.specialty).to.equal(specialtyToUrlValue(Specialty.Pediatrics))
        expect(query.language).to.equal('en-us')
    })

    it('removes filter params without touching unrelated query params', () => {
        const unrelatedKey = 'utm_source'
        const query = buildSearchFilterQuery(
            { city: 'Setagaya', specialty: 'pediatrics', language: 'en-us', [unrelatedKey]: 'newsletter' },
            {}
        )

        expect(query.city).to.be.undefined
        expect(query.specialty).to.be.undefined
        expect(query.language).to.be.undefined
        expect(query[unrelatedKey]).to.equal('newsletter')
    })
})
