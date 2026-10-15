import { Specialty } from '~/typedefs/gqlTypes'
import { DEFAULT_LOCALE_CODE, localizedPath } from './localePath'
import { canonicalUrl } from './seo'
import {
    CONTACT_EMAIL,
    NPO_FOUNDING_DATE,
    NPO_LEGAL_NAME,
    NPO_REGISTRATION_NUMBER,
    ORGANIZATION_PROFILE_URLS,
    SITE_ORIGIN,
    SITE_TITLE
} from './site'

/**
 * JSON-LD for facility, professional, and directory pages (#1795).
 *
 * Every value is something the page already shows, or a schema.org identifier for
 * that value. Empty contact fields stay off the graph: a placeholder phone the
 * clinic page hides must not reappear here.
 */

export type JsonLdNode = Record<string, unknown>

export type BilingualAddress = {
    addressLine1En?: string | null
    addressLine2En?: string | null
    addressLine1Ja?: string | null
    addressLine2Ja?: string | null
    cityEn?: string | null
    cityJa?: string | null
    prefectureEn?: string | null
    prefectureJa?: string | null
    postalCode?: string | null
}

export type MedicalClinicInput = {
    name: string
    alternateName?: string
    pagePath: string
    telephone?: string
    email?: string
    websiteUrl?: string
    mapsUrl?: string
    address?: BilingualAddress | null
    japanese?: boolean
    latitude?: number | null
    longitude?: number | null
    /** BCP 47 codes for languages the clinic page lists. */
    availableLanguage?: readonly string[]
}

export type PhysicianSpecialtyInput = {
    code: Specialty
    /** The specialty label rendered on the page. Unmapped codes use this text. */
    label: string
}

export type WorksForInput = {
    name: string
    pagePath: string
    city?: string
    prefecture?: string
}

export type PhysicianInput = {
    name: string
    alternateName?: string
    pagePath: string
    specialties?: readonly PhysicianSpecialtyInput[]
    /** BCP 47 codes for languages the professional page lists. */
    knowsLanguage?: readonly string[]
    worksFor?: readonly WorksForInput[]
}

export type BreadcrumbInput = {
    label: string
    /** Omitted on the current page. The list still points `item` at `currentPath`. */
    to?: string
}

/**
 * schema.org MedicalSpecialty, where our enum corresponds.
 * Anything else stays the label the page shows.
 *
 * @see https://schema.org/MedicalSpecialty
 */
const SCHEMA_MEDICAL_SPECIALTY: Partial<Record<Specialty, readonly string[]>> = {
    [Specialty.Anesthesiology]: ['https://schema.org/Anesthesia'],
    [Specialty.Cardiology]: ['https://schema.org/Cardiovascular'],
    [Specialty.CosmeticSurgery]: ['https://schema.org/PlasticSurgery'],
    [Specialty.Dentistry]: ['https://schema.org/Dentistry'],
    [Specialty.Dermatology]: ['https://schema.org/Dermatology'],
    [Specialty.EmergencyMedicine]: ['https://schema.org/Emergency'],
    [Specialty.EntSpecialist]: ['https://schema.org/Otolaryngologic'],
    [Specialty.FamilyMedicine]: ['https://schema.org/PrimaryCare'],
    [Specialty.GeneralMedicine]: ['https://schema.org/PrimaryCare'],
    [Specialty.InfectiousDiseases]: ['https://schema.org/Infectious'],
    [Specialty.MedicalGenetics]: ['https://schema.org/Genetic'],
    [Specialty.Neurology]: ['https://schema.org/Neurologic'],
    [Specialty.ObstetricsAndGynecology]: [
        'https://schema.org/Gynecologic',
        'https://schema.org/Obstetric'
    ],
    [Specialty.Ophthalmology]: ['https://schema.org/Ophthalmology'],
    [Specialty.Optometry]: ['https://schema.org/Optometric'],
    [Specialty.OrthopedicSurgery]: ['https://schema.org/Musculoskeletal'],
    [Specialty.Otolaryngology]: ['https://schema.org/Otolaryngologic'],
    [Specialty.Pathology]: ['https://schema.org/Pathology'],
    [Specialty.Pediatrics]: ['https://schema.org/Pediatric'],
    [Specialty.Pharmacy]: ['https://schema.org/PharmacySpecialty'],
    [Specialty.Physiotherapy]: ['https://schema.org/Physiotherapy'],
    [Specialty.PlasticSurgery]: ['https://schema.org/PlasticSurgery'],
    [Specialty.Psychiatry]: ['https://schema.org/Psychiatric'],
    [Specialty.RadiationOncology]: ['https://schema.org/Oncologic'],
    [Specialty.Surgery]: ['https://schema.org/Surgical'],
    [Specialty.Urology]: ['https://schema.org/Urologic']
}

function omitEmpty(node: JsonLdNode): JsonLdNode {
    const result: JsonLdNode = {}
    for (const [key, value] of Object.entries(node)) {
        if (value === undefined || value === null || value === '') {
            continue
        }
        if (Array.isArray(value) && value.length === 0) {
            continue
        }
        result[key] = value
    }
    return result
}

function distinctText(value: string | undefined, primary: string): string | undefined {
    const text = value?.trim() ?? ''
    if (!text || text === primary.trim()) {
        return undefined
    }
    return text
}

function firstText(...values: (string | null | undefined)[]): string {
    for (const value of values) {
        const text = value?.trim() ?? ''
        if (text) {
            return text
        }
    }
    return ''
}

function joinAddress(parts: readonly (string | null | undefined)[]): string {
    return parts
        .map(part => part?.trim() ?? '')
        .filter(part => part.length > 0)
        .join(' ')
}

function postalAddress(input: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
}): JsonLdNode | undefined {
    const streetAddress = input.streetAddress?.trim() ?? ''
    const addressLocality = input.addressLocality?.trim() ?? ''
    const addressRegion = input.addressRegion?.trim() ?? ''
    const postalCode = input.postalCode?.trim() ?? ''

    if (!streetAddress && !addressLocality && !addressRegion && !postalCode) {
        return undefined
    }

    return omitEmpty({
        '@type': 'PostalAddress',
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry: 'JP'
    })
}

function addressFromBilingual(
    address: BilingualAddress | null | undefined,
    japanese: boolean
): JsonLdNode | undefined {
    if (!address) {
        return undefined
    }

    return postalAddress({
        streetAddress: japanese
            ? joinAddress([address.addressLine1Ja, address.addressLine2Ja])
            : joinAddress([address.addressLine1En, address.addressLine2En]),
        addressLocality: japanese
            ? firstText(address.cityJa, address.cityEn)
            : firstText(address.cityEn, address.cityJa),
        addressRegion: japanese
            ? firstText(address.prefectureJa, address.prefectureEn)
            : firstText(address.prefectureEn, address.prefectureJa),
        postalCode: address.postalCode ?? ''
    })
}

/**
 * The map link is hidden when a coordinate is missing or zero. Geo follows that.
 */
function geoCoordinates(
    latitude: number | null | undefined,
    longitude: number | null | undefined
): JsonLdNode | undefined {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return undefined
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return undefined
    }
    if (latitude === 0 || longitude === 0) {
        return undefined
    }

    return {
        '@type': 'GeoCoordinates',
        latitude,
        longitude
    }
}

export function medicalSpecialtyValues(items: readonly PhysicianSpecialtyInput[]): string[] {
    const seen = new Set<string>()
    const values: string[] = []

    for (const item of items) {
        const label = item.label.trim()
        if (!label) {
            continue
        }

        for (const value of SCHEMA_MEDICAL_SPECIALTY[item.code] ?? [label]) {
            if (seen.has(value)) {
                continue
            }
            seen.add(value)
            values.push(value)
        }
    }

    return values
}

/**
 * Languages the page can name, as IETF BCP 47 (`en_US` → `en-US`).
 * Codes outside `knownCodes` are not rendered as chips, so they are left out.
 */
export function displayedLanguageCodes(
    codes: readonly (string | null | undefined)[],
    knownCodes: readonly string[]
): string[] {
    const known = new Set(knownCodes)
    const seen = new Set<string>()
    const result: string[] = []

    for (const code of codes) {
        const value = code?.trim() ?? ''
        if (!value || !known.has(value) || seen.has(value)) {
            continue
        }
        seen.add(value)
        result.push(value.replaceAll('_', '-'))
    }

    return result
}

export function medicalClinicJsonLd(input: MedicalClinicInput): JsonLdNode {
    const pageUrl = canonicalUrl(input.pagePath)
    const languages = input.availableLanguage ?? []

    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalClinic',
        '@id': pageUrl,
        name: input.name.trim(),
        url: pageUrl,
        ...omitEmpty({
            alternateName: distinctText(input.alternateName, input.name),
            telephone: input.telephone?.trim(),
            email: input.email?.trim(),
            sameAs: input.websiteUrl?.trim(),
            hasMap: input.mapsUrl?.trim(),
            address: addressFromBilingual(input.address, input.japanese === true),
            geo: geoCoordinates(input.latitude, input.longitude),
            availableLanguage: languages.length > 0 ? [...languages] : undefined
        })
    }
}

function worksForClinic(entry: WorksForInput): JsonLdNode {
    const pageUrl = canonicalUrl(entry.pagePath)

    return omitEmpty({
        '@type': 'MedicalClinic',
        '@id': pageUrl,
        name: entry.name.trim(),
        url: pageUrl,
        address: postalAddress({
            addressLocality: entry.city,
            addressRegion: entry.prefecture
        })
    })
}

export function physicianJsonLd(input: PhysicianInput): JsonLdNode {
    const pageUrl = canonicalUrl(input.pagePath)
    const specialties = medicalSpecialtyValues(input.specialties ?? [])
    const languages = input.knowsLanguage ?? []
    const worksFor = (input.worksFor ?? [])
        .filter(entry => entry.name.trim().length > 0)
        .map(worksForClinic)

    return {
        '@context': 'https://schema.org',
        // Physician is an organization in schema.org. Person adds worksFor / knowsLanguage,
        // which are how an individual doctor's clinic and languages are expressed.
        '@type': ['Physician', 'Person'],
        '@id': pageUrl,
        name: input.name.trim(),
        url: pageUrl,
        ...omitEmpty({
            alternateName: distinctText(input.alternateName, input.name),
            medicalSpecialty: specialties.length > 0 ? specialties : undefined,
            knowsLanguage: languages.length > 0 ? [...languages] : undefined,
            worksFor: worksFor.length > 0 ? worksFor : undefined
        })
    }
}

export function breadcrumbListJsonLd(
    items: readonly BreadcrumbInput[],
    currentPath: string,
    localeCode: string = DEFAULT_LOCALE_CODE
): JsonLdNode {
    const crumbs = items.filter(item => item.label.trim().length > 0)
    const pathOf = (path: string) => localizedPath(path, localeCode)

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label.trim(),
            item: canonicalUrl(pathOf(item.to ?? currentPath))
        }))
    }
}

export function organizationJsonLd(): JsonLdNode {
    return {
        '@context': 'https://schema.org',
        '@type': 'NGO',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: SITE_TITLE,
        legalName: NPO_LEGAL_NAME,
        url: `${SITE_ORIGIN}/`,
        email: CONTACT_EMAIL,
        foundingDate: NPO_FOUNDING_DATE,
        identifier: {
            '@type': 'PropertyValue',
            name: 'NPO registration number',
            value: NPO_REGISTRATION_NUMBER
        },
        areaServed: {
            '@type': 'Country',
            name: 'Japan'
        },
        sameAs: [...ORGANIZATION_PROFILE_URLS]
    }
}

/** `<` is escaped so a name cannot close the surrounding script tag. */
export function serializeJsonLd(data: JsonLdNode): string {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function jsonLdScript(key: string, data: JsonLdNode) {
    return {
        key,
        type: 'application/ld+json' as const,
        innerHTML: serializeJsonLd(data)
    }
}
