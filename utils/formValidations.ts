import { hasJapaneseCharacters,
    hasOnlyValidJapaneseAndLatinCharacters,
    isValidEmail,
    isValidPhoneNumber,
    isValidWebsite,
    isFloat,
    isValidPostalCode } from './stringUtils'
import { Locale, type LocalizedNameInput } from '~/typedefs/gqlTypes'

export function validateNameEn(nameEn: string): boolean {
    if (nameEn.length < 1 || nameEn.length > 128) {
        return false
    }

    const containsJapanseCharacters: boolean = hasJapaneseCharacters(nameEn)

    if (containsJapanseCharacters) {
        return false
    }

    return true
}

export function validateNameJa(nameJa: string): boolean {
    // 1) Compatibility‐normalize (NFKC) folds full-width ↔ ASCII
    // 2) Canonical‐normalize (NFC) composes any decomposed sequences
    const normalized = nameJa.normalize('NFKC').normalize('NFC')

    // 3) Length check on the *normalized* text
    if (normalized.length < 1 || normalized.length > 128) {
        return false
    }

    // 4) Character‐set check on that same normalized text
    if (!hasOnlyValidJapaneseAndLatinCharacters(normalized)) {
        return false
    }

    return true
}

export function validatePhoneNumber(phoneNumber: string): boolean {
    if (phoneNumber.length < 1) {
        return false
    }

    const isPhoneNumberValid: boolean = isValidPhoneNumber(phoneNumber)

    if (!isPhoneNumberValid) {
        return false
    }

    return true
}

export function validateEmail(email: string): boolean {
    // This field can be empty
    if (email.length < 1) {
        return true
    }

    if (email.length > 128) {
        return false
    }

    const isEmailValid: boolean = isValidEmail(email)

    if (!isEmailValid) {
        return false
    }

    return true
}

export function validateWebsite(website: string): boolean {
    // This field can be empty
    if (website.length < 1) {
        return true
    }
    const isWebsiteValid: boolean = isValidWebsite(website)

    if (!isWebsiteValid) {
        return false
    }

    return true
}

export function validateAddressLineEn(addressLineEn: string): boolean {
    if (addressLineEn.length < 1 || addressLineEn.length > 128) {
        return false
    }

    const containsJapaneseCharacters: boolean = hasJapaneseCharacters(addressLineEn)

    if (containsJapaneseCharacters) {
        return false
    }

    return true
}

export function validateAddressLineJa(addressLineJa: string): boolean {
    if (addressLineJa.length < 1 || addressLineJa.length > 128) {
        return false
    }

    return true
}

export function validateCityEn(cityEn: string): boolean {
    if (cityEn.length < 1 || cityEn.length > 64) {
        return false
    }

    const containsJapanseCharacters: boolean = hasJapaneseCharacters(cityEn)

    if (containsJapanseCharacters) {
        return false
    }

    return true
}

export function validateCityJa(cityJa: string): boolean {
    if (cityJa.length < 1 || cityJa.length > 64) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(cityJa)

    if (containsLatinCharacters) {
        return false
    }

    return true
}

export function validatePostalCode(postalCode: string): boolean {
    if (postalCode.length > 18) {
        return false
    }

    const isPostalCodeValid = isValidPostalCode(postalCode)

    if (!isPostalCodeValid) {
        return false
    }

    return true
}

export function validateFloat(float: string): boolean {
    if (float.length < 1) {
        return false
    }

    const isFloatValid: boolean = isFloat(float)

    if (!isFloatValid) {
        return false
    }

    return true
}

export function validateUsername(name: string): boolean {
    if (name.length < 1)
        return false

    // Cannot have white space " "
    if (name.indexOf(' ') >= 0)
        return false

    if (name.length > 32)
        return false

    return true
}

export function validatePassword(password: string): boolean {
    if (password.length < 1)
        return false

    // Cannot have white space " "
    if (password.indexOf(' ') >= 0)
        return false

    // Password must be under 128 characters long
    if (password.length > 128)
        return false

    // Password must contain at a minimum of 12 characters, at least one letter, one number and one special character
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/g.test(password))
        return false

    return true
}

export function validateUserSubmittedLastName(name: string): boolean {
    // The last name cannot be an empty space like " "
    name = name.trim()

    if (name.length > 30 || name === '') {
        return false
    }
    return true
}

export function validateUserSubmittedFirstName(name: string): boolean {
    // The first name is optional and may be an empty string.
    name = name.trim()
    if (name.length > 30 || !name.length) {
        return false
    }
    return true
}

export type MapsPlacePreview = {
    name: string | null
    latitude: number | null
    longitude: number | null
    placeId: string | null
    address: string | null
    category: string | null
}

const COORDINATE_PAIR = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/

/** A share link with an id long enough to open. The prefix alone is not one. */
export function isResolvableShortMapsUrl(url: string): boolean {
    try {
        const parsed = new URL(url.trim())
        if (parsed.protocol !== 'https:') return false
        if (parsed.hostname === 'maps.app.goo.gl') {
            return parsed.pathname.replace(/^\//, '').length >= 4
        }
        if (parsed.hostname === 'goo.gl' && parsed.pathname.startsWith('/maps/')) {
            return parsed.pathname.slice('/maps/'.length).length >= 4
        }
        return false
    } catch {
        return false
    }
}

/**
 * Name and pin already written into a Maps URL.
 * A short share link has neither until it is opened.
 */
export function parseMapsPlace(url: string): MapsPlacePreview | null {
    const trimmed = url.trim()
    if (!validateGoogleMapsUrlInput(trimmed)) return null

    try {
        const parsed = new URL(trimmed)
        const placeMatch = parsed.pathname.match(/\/(?:place|search)\/([^/]+)/)
        const queryName = parsed.searchParams.get('q') ?? parsed.searchParams.get('query')
        const pin = mapPin(parsed)
        return {
            name: placeName(placeMatch?.[1]) ?? placeName(queryName, true),
            latitude: pin?.latitude ?? null,
            longitude: pin?.longitude ?? null,
            placeId: googlePlaceIdFromUrl(parsed),
            address: null,
            category: null
        }
    } catch {
        return null
    }
}

/** The place name a Maps URL already carries. Short links have none. */
export function placeLabelFromMapsUrl(url: string): string | null {
    return parseMapsPlace(url)?.name ?? null
}

function placeName(value: string | null | undefined, rejectCoordinates = false): string | null {
    if (!value) return null
    let label: string
    try {
        label = decodeURIComponent(value).replace(/\+/g, ' ').trim()
    } catch {
        return null
    }
    if (!label || label.startsWith('@') || (rejectCoordinates && readCoordinatePair(label))) return null
    return label
}

const PLACE_ID_TOKEN = /^[A-Za-z0-9_-]{8,}$/

/**
 * The 0x:0x pair in a Maps link is the same place as a ChIJ place id.
 * It is a 20-byte id written as two little-endian numbers.
 */
export function featureIdToPlaceId(highHex: string, lowHex: string): string {
    const bytes = [
        0x0a,
        0x12,
        0x09,
        ...hexToLittleEndianBytes(highHex),
        0x11,
        ...hexToLittleEndianBytes(lowHex)
    ]
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

/** A Places id written into the Maps URL, including an iPhone ftid pair. */
function googlePlaceIdFromUrl(parsed: URL): string | null {
    const explicit = placeIdToken(parsed.searchParams.get('query_place_id'))
      ?? placeIdToken(parsed.searchParams.get('place_id'))
    if (explicit) return explicit

    const query = parsed.searchParams.get('q') ?? parsed.searchParams.get('query') ?? ''
    const fromQuery = query.match(/place_id:([A-Za-z0-9_-]{8,})/)
    const queryToken = placeIdToken(fromQuery?.[1])
    if (queryToken) return queryToken

    const haystack = decodedMapsPath(parsed)
    const embedded = haystack.match(/!1s([A-Za-z0-9_-]{8,})/)
    const embeddedToken = placeIdToken(embedded?.[1])
    if (embeddedToken && !embeddedToken.startsWith('0x')) return embeddedToken

    const feature = haystack.match(/(?:!1s|[?&]ftid=)(0x[0-9a-f]{1,16}):(0x[0-9a-f]{1,16})/i)
    if (feature?.[1] && feature[2]) return featureIdToPlaceId(feature[1], feature[2])
    return null
}

function decodedMapsPath(parsed: URL): string {
    const raw = `${parsed.pathname}${parsed.search}`
    try {
        return decodeURIComponent(raw)
    } catch {
        return raw
    }
}

function hexToLittleEndianBytes(hex: string): number[] {
    const normalized = hex.replace(/^0x/i, '').padStart(16, '0')
    const bytes: number[] = []
    for (let index = 14; index >= 0; index -= 2) {
        bytes.push(Number.parseInt(normalized.slice(index, index + 2), 16))
    }
    return bytes
}

function placeIdToken(value: string | null | undefined): string | null {
    if (!value) return null
    const trimmed = value.trim().replace(/^places\//, '')
    return PLACE_ID_TOKEN.test(trimmed) ? trimmed : null
}

function mapPin(parsed: URL): { latitude: number, longitude: number } | null {
    const dataPin = parsed.pathname.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
    const atPin = parsed.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
    const queryPin = parsed.searchParams.get('ll')
      ?? parsed.searchParams.get('q')
      ?? parsed.searchParams.get('query')
    return readCoordinatePair(dataPin ? `${dataPin[1]},${dataPin[2]}` : null)
      ?? readCoordinatePair(atPin ? `${atPin[1]},${atPin[2]}` : null)
      ?? readCoordinatePair(queryPin)
}

function readCoordinatePair(value: string | null | undefined): { latitude: number, longitude: number } | null {
    if (!value) return null
    const match = value.trim().match(COORDINATE_PAIR)
    if (!match?.[1] || !match[2]) return null
    const latitude = Number(match[1])
    const longitude = Number(match[2])
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null
    return { latitude, longitude }
}

export function validateGoogleMapsUrlInput(url: string): boolean {
    const trimmed = url.trim()
    // Short "Share" links produced by the Google Maps app, including iPhone links.
    if (trimmed.startsWith('https://maps.app.goo.gl/') || trimmed.startsWith('https://goo.gl/maps/')) {
        return true
    }

    try {
        const parsed = new URL(trimmed)
        if (parsed.protocol !== 'https:') return false
        const host = parsed.hostname
        if (host === 'maps.google.com' || host === 'maps.google.co.jp') return true
        const googleHost = host === 'www.google.com'
          || host === 'google.com'
          || host === 'www.google.co.jp'
          || host === 'google.co.jp'
        return googleHost && (parsed.pathname === '/maps' || parsed.pathname.startsWith('/maps/'))
    } catch {
        return false
    }
}

export function validateFirstSpokenLanguage(localeCode: string): boolean {
    if (Object.values<string>(Locale).includes(localeCode) && localeCode !== '') {
        return true
    }
    return false
}

/** Japanese is assumed. At least one other real locale is required. */
export function validateSubmittedSpokenLanguages(locales: readonly string[]): boolean {
    const extra = locales.filter(locale => locale !== Locale.JaJp)
    return extra.length > 0 && extra.every(locale => Object.values<string>(Locale).includes(locale))
}

export function validateSecondSpokenLanguage(localeCode: string): boolean {
    // The second spoken language is optional and may be an empty string.
    if (Object.values<string>(Locale).includes(localeCode) || localeCode === '') {
        return true
    }
    return false
}

export function validateNameLocaleMatchesLanguage(
  nameLocale: LocalizedNameInput
): boolean {
    const fullName = nameLocale.lastName
      + (nameLocale.middleName || '')
      + nameLocale.firstName

    switch (nameLocale.locale) {
        case Locale.JaJp:
            return hasJapaneseCharacters(fullName)

        case Locale.EnUs:
            return hasLatinCharacters(fullName)

        default:
            // Defaults to true for locales that have yet to be added
            return true
    }
}
