import { expect } from 'chai'
import { Specialty, type Facility } from '@/typedefs/gqlTypes'
import { facilityPhone, facilityWebsiteUrl } from '@/utils/searchDirectory'
import {
    CONTACT_EMAIL,
    NPO_LEGAL_NAME,
    NPO_REGISTRATION_NUMBER,
    SITE_ORIGIN,
    SITE_TITLE
} from '@/utils/site'
import {
    breadcrumbListJsonLd,
    displayedLanguageCodes,
    medicalClinicJsonLd,
    medicalSpecialtyValues,
    organizationJsonLd,
    physicianJsonLd,
    serializeJsonLd
} from '@/utils/structuredData'

const knownLanguages = ['en_US', 'ja_JP', 'fr_FR']

describe('displayedLanguageCodes', () => {
    it('keeps languages the page can name, as BCP 47, once each', () => {
        expect(displayedLanguageCodes(
            ['en_US', 'xx_YY', 'ja_JP', 'en_US', ''],
            knownLanguages
        )).to.deep.equal(['en-US', 'ja-JP'])
    })
})

describe('medicalSpecialtyValues', () => {
    it('uses a schema.org MedicalSpecialty when one corresponds', () => {
        expect(medicalSpecialtyValues([
            { code: Specialty.Dentistry, label: 'Dentist' }
        ])).to.deep.equal(['https://schema.org/Dentistry'])
    })

    it('maps obstetrics and gynecology to both schema.org specialties', () => {
        expect(medicalSpecialtyValues([
            { code: Specialty.ObstetricsAndGynecology, label: 'Gynecologist (Ob-Gyn)' }
        ])).to.deep.equal([
            'https://schema.org/Gynecologic',
            'https://schema.org/Obstetric'
        ])
    })

    it('falls back to the label shown on the page', () => {
        expect(medicalSpecialtyValues([
            { code: Specialty.AllergyAndImmunology, label: 'Allergist' }
        ])).to.deep.equal(['Allergist'])
    })

    it('skips a specialty the page does not render', () => {
        expect(medicalSpecialtyValues([
            { code: Specialty.Dentistry, label: '  ' }
        ])).to.deep.equal([])
    })
})

describe('medicalClinicJsonLd', () => {
    const address = {
        addressLine1En: '1-2-3 Example',
        addressLine2En: '4F',
        addressLine1Ja: '例1-2-3',
        addressLine2Ja: '4階',
        cityEn: 'Shibuya',
        cityJa: '渋谷区',
        prefectureEn: 'Tokyo',
        prefectureJa: '東京都',
        postalCode: '150-0002'
    }

    it('publishes the clinic page, contact, geo, and languages', () => {
        const node = medicalClinicJsonLd({
            name: 'Example Dental',
            alternateName: '例デンタル',
            pagePath: '/clinic/tokyo/shibuya/example-dental--abc',
            telephone: '03-1234-5678',
            email: 'desk@example.com',
            websiteUrl: 'http://example.com/',
            mapsUrl: 'https://www.google.com/maps/place/example',
            address,
            latitude: 35.66,
            longitude: 139.7,
            availableLanguage: ['en-US', 'ja-JP']
        })

        expect(node).to.deep.equal({
            '@context': 'https://schema.org',
            '@type': 'MedicalClinic',
            '@id': `${SITE_ORIGIN}/clinic/tokyo/shibuya/example-dental--abc`,
            name: 'Example Dental',
            url: `${SITE_ORIGIN}/clinic/tokyo/shibuya/example-dental--abc`,
            alternateName: '例デンタル',
            telephone: '03-1234-5678',
            email: 'desk@example.com',
            sameAs: 'http://example.com/',
            hasMap: 'https://www.google.com/maps/place/example',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '1-2-3 Example 4F',
                addressLocality: 'Shibuya',
                addressRegion: 'Tokyo',
                postalCode: '150-0002',
                addressCountry: 'JP'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: 35.66,
                longitude: 139.7
            },
            availableLanguage: ['en-US', 'ja-JP']
        })
    })

    it('uses the Japanese address fields when the page is Japanese', () => {
        const node = medicalClinicJsonLd({
            name: '例デンタル',
            pagePath: '/clinic/tokyo/shibuya/example--abc',
            address,
            japanese: true
        })
        const postal = node.address as { streetAddress: string, addressLocality: string, addressRegion: string }

        expect(postal.streetAddress).to.equal('例1-2-3 4階')
        expect(postal.addressLocality).to.equal('渋谷区')
        expect(postal.addressRegion).to.equal('東京都')
    })

    it('omits contact, geo, and languages the page does not show', () => {
        const hiddenPhone = facilityPhone({ contact: { phone: 'none' } } as Facility)
        const hiddenSite = facilityWebsiteUrl({ contact: { website: 'n/a' } } as Facility)
        const node = medicalClinicJsonLd({
            name: 'Example Dental',
            alternateName: 'Example Dental',
            pagePath: '/clinic/tokyo/shibuya/example--abc',
            telephone: hiddenPhone,
            websiteUrl: hiddenSite,
            latitude: 0,
            longitude: 139.7,
            availableLanguage: []
        })

        expect(node).to.not.have.property('telephone')
        expect(node).to.not.have.property('sameAs')
        expect(node).to.not.have.property('geo')
        expect(node).to.not.have.property('address')
        expect(node).to.not.have.property('availableLanguage')
        expect(node).to.not.have.property('alternateName')
        expect(node.url).to.equal(`${SITE_ORIGIN}/clinic/tokyo/shibuya/example--abc`)
    })
})

describe('physicianJsonLd', () => {
    it('names the doctor, their specialty, languages, and clinics', () => {
        const node = physicianJsonLd({
            name: 'Ada Lovelace',
            alternateName: 'ラブレス',
            pagePath: '/doctor/ada-lovelace--hp1',
            specialties: [
                { code: Specialty.Psychiatry, label: 'Psychiatrist' },
                { code: Specialty.InternalMedicine, label: 'Internal Medicine' }
            ],
            knowsLanguage: ['en-US'],
            worksFor: [{
                name: 'Example Dental',
                pagePath: '/clinic/tokyo/shibuya/example--abc',
                city: 'Shibuya',
                prefecture: 'Tokyo'
            }]
        })

        expect(node['@type']).to.deep.equal(['Physician', 'Person'])
        expect(node.name).to.equal('Ada Lovelace')
        expect(node.url).to.equal(`${SITE_ORIGIN}/doctor/ada-lovelace--hp1`)
        expect(node.medicalSpecialty).to.deep.equal([
            'https://schema.org/Psychiatric',
            'Internal Medicine'
        ])
        expect(node.knowsLanguage).to.deep.equal(['en-US'])
        expect(node.worksFor).to.deep.equal([{
            '@type': 'MedicalClinic',
            '@id': `${SITE_ORIGIN}/clinic/tokyo/shibuya/example--abc`,
            name: 'Example Dental',
            url: `${SITE_ORIGIN}/clinic/tokyo/shibuya/example--abc`,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Shibuya',
                addressRegion: 'Tokyo',
                addressCountry: 'JP'
            }
        }])
    })

    it('omits worksFor when the clinic name is blank', () => {
        const node = physicianJsonLd({
            name: 'Ada Lovelace',
            pagePath: '/doctor/ada-lovelace--hp1',
            worksFor: [{ name: '  ', pagePath: '/clinic/tokyo/shibuya/example--abc' }]
        })

        expect(node).to.not.have.property('worksFor')
        expect(node).to.not.have.property('medicalSpecialty')
        expect(node).to.not.have.property('knowsLanguage')
    })
})

describe('breadcrumbListJsonLd', () => {
    it('numbers the visible trail and points the current page at its own URL', () => {
        const node = breadcrumbListJsonLd([
            { label: 'Home', to: '/' },
            { label: '  ' },
            { label: 'Tokyo', to: '/tokyo' },
            { label: 'Dentistry' }
        ], '/tokyo/dentistry')

        expect(node).to.deep.equal({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: `${SITE_ORIGIN}/`
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Tokyo',
                    item: `${SITE_ORIGIN}/tokyo`
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Dentistry',
                    item: `${SITE_ORIGIN}/tokyo/dentistry`
                }
            ]
        })
    })
})

describe('organizationJsonLd', () => {
    it('identifies the NPO with the details published on the site', () => {
        const node = organizationJsonLd()

        expect(node['@type']).to.equal('NGO')
        expect(node['@id']).to.equal(`${SITE_ORIGIN}/#organization`)
        expect(node.name).to.equal(SITE_TITLE)
        expect(node.legalName).to.equal(NPO_LEGAL_NAME)
        expect(node.email).to.equal(CONTACT_EMAIL)
        expect(node.foundingDate).to.equal('2023-08-28')
        expect(node.identifier).to.deep.equal({
            '@type': 'PropertyValue',
            name: 'NPO registration number',
            value: NPO_REGISTRATION_NUMBER
        })
        expect(node.sameAs).to.deep.equal([
            'https://github.com/ourjapanlife',
            'https://www.linkedin.com/company/find-a-doc-japan/'
        ])
    })
})

describe('serializeJsonLd', () => {
    it('escapes < so a name cannot break out of the script tag', () => {
        const serialized = serializeJsonLd({ name: '</script><script>alert(1)' })

        expect(serialized).to.not.include('<')
        expect(JSON.parse(serialized)).to.deep.equal({ name: '</script><script>alert(1)' })
    })
})
