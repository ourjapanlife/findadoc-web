import { describe, expect, it } from 'vitest'
import { Locale, Specialty, type Facility, type HealthcareProfessional } from '~/typedefs/gqlTypes'
import { buildSearchQuery,
    facilityEmail,
    facilityMapsUrl,
    facilityPhone,
    facilityPhoneHref,
    facilityWebsiteLabel,
    facilityWebsiteUrl,
    filterDirectory,
    hasActiveFilters,
    parseSearchQuery } from '~/utils/searchDirectory'

function facility(id: string, professionalIds: string[], address: Partial<Facility['contact']['address']> = {}): Facility {
    return {
        id,
        nameEn: id,
        nameJa: id,
        healthcareProfessionalIds: professionalIds,
        contact: {
            address: { cityEn: 'Shibuya', cityJa: '渋谷', prefectureEn: 'Tokyo', prefectureJa: '東京都', ...address }
        }
    } as unknown as Facility
}

function professional(id: string, specialties: Specialty[], spokenLanguages: Locale[]): HealthcareProfessional {
    return { id, specialties, spokenLanguages, names: [], degrees: [], facilityIds: [] } as unknown as HealthcareProfessional
}

const dentistEn = professional('p1', [Specialty.Dentistry], [Locale.EnUs, Locale.JaJp])
const gpJa = professional('p2', [Specialty.InternalMedicine], [Locale.JaJp])
const derm = professional('p3', [Specialty.Dermatology, Specialty.Dentistry], [Locale.FrFr])

const facilities = [
    facility('tokyo-clinic', ['p1', 'p2']),
    facility('osaka-clinic', ['p3'], { cityEn: 'Kita', cityJa: '北', prefectureEn: 'Osaka', prefectureJa: '大阪府' }),
    facility('empty-clinic', [])
]
const professionals = [dentistEn, gpJa, derm]

describe('filterDirectory', () => {
    it('returns every facility with at least one professional when nothing is selected', () => {
        const results = filterDirectory(facilities, professionals, {})

        expect(results.map(result => result.id)).toEqual(['tokyo-clinic', 'osaka-clinic'])
        expect(results[0]?.healthcareProfessionals.map(hp => hp.id)).toEqual(['p1', 'p2'])
    })

    it('keeps only professionals matching the specialty, and drops facilities left with none', () => {
        const results = filterDirectory(facilities, professionals, { specialties: [Specialty.Dentistry] })

        expect(results.map(result => result.id)).toEqual(['tokyo-clinic', 'osaka-clinic'])
        expect(results[0]?.healthcareProfessionals.map(hp => hp.id)).toEqual(['p1'])
    })

    it('combines specialty and language', () => {
        const results = filterDirectory(facilities, professionals, {
            specialties: [Specialty.Dentistry],
            languages: [Locale.EnUs]
        })

        expect(results.map(result => result.id)).toEqual(['tokyo-clinic'])
    })

    it('filters by prefecture in either language', () => {
        expect(filterDirectory(facilities, professionals, { prefecture: 'Osaka' }).map(r => r.id)).toEqual(['osaka-clinic'])
        expect(filterDirectory(facilities, professionals, { prefecture: '大阪府' }).map(r => r.id)).toEqual(['osaka-clinic'])
    })

    it('filters by city in either language', () => {
        expect(filterDirectory(facilities, professionals, { city: 'Kita' }).map(r => r.id)).toEqual(['osaka-clinic'])
        expect(filterDirectory(facilities, professionals, { city: '渋谷' }).map(r => r.id)).toEqual(['tokyo-clinic'])
    })

    it('ignores professional IDs the directory does not contain', () => {
        const results = filterDirectory([facility('ghost', ['missing'])], professionals, {})

        expect(results).toEqual([])
    })
})

describe('parseSearchQuery / buildSearchQuery', () => {
    it('reads valid values and drops anything that is not a real enum member', () => {
        const state = parseSearchQuery({
            specialty: 'DENTISTRY',
            language: 'NOT_A_LOCALE',
            prefecture: 'Tokyo',
            facility: 'abc'
        })

        expect(state).toEqual({
            city: undefined,
            prefecture: 'Tokyo',
            specialties: [Specialty.Dentistry],
            languages: undefined,
            facilityId: 'abc'
        })
    })

    it('takes the first value of a repeated parameter', () => {
        const state = parseSearchQuery({ specialty: ['DENTISTRY', 'DERMATOLOGY'] })

        expect(state.specialties).toEqual([Specialty.Dentistry])
    })

    it('round-trips through the URL and omits empty keys', () => {
        const state = parseSearchQuery({ specialty: 'DENTISTRY', language: 'en_US', prefecture: 'Tokyo' })

        expect(buildSearchQuery(state)).toEqual({ specialty: 'DENTISTRY', language: 'en_US', prefecture: 'Tokyo' })
        expect(buildSearchQuery({})).toEqual({})
    })
})

describe('hasActiveFilters', () => {
    it('is false for empty selections', () => {
        expect(hasActiveFilters({ specialties: [], languages: [] })).toBe(false)
        expect(hasActiveFilters({ prefecture: 'Tokyo' })).toBe(true)
    })
})

describe('contact normalisation', () => {
    const withContact = (contact: Record<string, unknown>) =>
        ({ nameEn: 'Clinic', nameJa: 'クリニック', mapLatitude: 35.6, mapLongitude: 139.7, contact } as unknown as Facility)

    describe('facilityWebsiteUrl', () => {
        /*
         * 5 of 465 production rows store a bare host. Without a scheme the browser treats the
         * href as a relative path, so the button navigated inside our own site.
         */
        it('adds the missing scheme to a bare host', () => {
            // http, not https: one of the five production domains has no working certificate,
            // and hosts that can do TLS redirect themselves.
            expect(facilityWebsiteUrl(withContact({ website: 'www.megurokhome.com' })))
                .toBe('http://www.megurokhome.com/')
            expect(facilityWebsiteUrl(withContact({ website: 'miharadentalclinic.com' })))
                .toBe('http://miharadentalclinic.com/')
        })

        it('leaves a well-formed URL alone', () => {
            expect(facilityWebsiteUrl(withContact({ website: 'https://example.com/clinic' })))
                .toBe('https://example.com/clinic')
            expect(facilityWebsiteUrl(withContact({ website: 'http://example.com/' })))
                .toBe('http://example.com/')
        })

        it('yields nothing for empty, placeholder or unusable values', () => {
            for (const website of ['', '   ', 'none', 'N/A', '-', 'tbd', 'localhost', 'not a url']) {
                expect(facilityWebsiteUrl(withContact({ website }))).toBe('')
            }
        })

        it('renders a label without the scheme or a trailing slash', () => {
            expect(facilityWebsiteLabel(withContact({ website: 'www.megurokhome.com' })))
                .toBe('www.megurokhome.com')
            expect(facilityWebsiteLabel(withContact({ website: 'https://example.com/clinic/' })))
                .toBe('example.com/clinic')
            expect(facilityWebsiteLabel(withContact({ website: 'none' }))).toBe('')
        })
    })

    describe('facilityPhone and facilityEmail', () => {
        it('keeps dialable numbers and drops placeholders', () => {
            expect(facilityPhone(withContact({ phone: '03-5722-5500' }))).toBe('03-5722-5500')
            expect(facilityPhone(withContact({ phone: '+81 3 5722 5500' }))).toBe('+81 3 5722 5500')
            expect(facilityPhone(withContact({ phone: 'none' }))).toBe('')
            expect(facilityPhone(withContact({ phone: '123' }))).toBe('')
        })

        it('dials a number that keeps the trunk zero after the country code', () => {
            // Stored verbatim in production; "+81045..." never connects.
            expect(facilityPhoneHref(withContact({ phone: '+81 045-641-6961' }))).toBe('+81456416961')
            expect(facilityPhoneHref(withContact({ phone: '03-5722-5500' }))).toBe('0357225500')
            expect(facilityPhoneHref(withContact({ phone: 'none' }))).toBe('')
        })

        it('keeps real addresses and drops placeholders', () => {
            expect(facilityEmail(withContact({ email: 'clinic@example.com' }))).toBe('clinic@example.com')
            for (const email of ['', 'none', 'None', 'email@email.com', 'n/a', 'not-an-email']) {
                expect(facilityEmail(withContact({ email }))).toBe('')
            }
        })
    })

    describe('facilityMapsUrl', () => {
        it('prefers a stored place URL', () => {
            const stored = 'https://www.google.com/maps/place/Clinic/@35.6,139.7,17z'
            expect(facilityMapsUrl(withContact({ googleMapsUrl: stored }))).toBe(stored)
        })

        /* Some rows store a bare maps URL with tracking parameters and no place at all. */
        it('falls back to a name search anchored at the facility coordinates', () => {
            const url = facilityMapsUrl(withContact({ googleMapsUrl: 'https://www.google.com/maps?sca_esv=abc&rlz=1C5' }))
            expect(url).toBe('https://www.google.com/maps/search/Clinic/@35.6,139.7,17z')
        })

        it('trusts a Google short link, which resolves to a place', () => {
            const short = 'https://maps.app.goo.gl/3eKxTkC4WJ3Vezob9'
            expect(facilityMapsUrl(withContact({ googleMapsUrl: short }))).toBe(short)
        })

        it('never emits a stored value that is not a URL', () => {
            // One row stores the literal string "google.maps", which as an href is a relative path.
            expect(facilityMapsUrl(withContact({ googleMapsUrl: 'google.maps' })))
                .toBe('https://www.google.com/maps/search/Clinic/@35.6,139.7,17z')
        })

        it('uses the Japanese name when the reader is Japanese', () => {
            const url = facilityMapsUrl(withContact({ googleMapsUrl: 'https://www.google.com/maps?q=1' }), true)
            expect(url).toContain(encodeURIComponent('クリニック'))
        })
    })
})
