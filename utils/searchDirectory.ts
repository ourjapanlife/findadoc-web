import { Locale, Specialty, type Facility, type HealthcareProfessional } from '~/typedefs/gqlTypes'

/**
 * Client-side search over the whole directory.
 *
 * The API cannot filter facilities by location and exposes professionals only as ID lists, so
 * every search used to re-download the entire database and join it in memory. Loading it once
 * and filtering here makes every subsequent filter change instant and request-free. When the
 * server grows a location filter (findadoc-server: `cityEn`/`prefectureEn` on
 * `FacilitySearchFilters`), the store can swap this for a server query without touching the UI.
 */

export type FacilitySearchResult = Facility & {
    healthcareProfessionals: HealthcareProfessional[]
}

export interface SearchFilters {
    city?: string
    prefecture?: string
    specialties?: Specialty[]
    languages?: Locale[]
}

export interface SearchQueryState extends SearchFilters {
    facilityId?: string
    /** 1-based load-more page. Omitted from the URL when it is 1. */
    page?: number
}

/** Route query bag. Kept structural so this module does not import vue-router. */
export type SearchLocationQuery = Record<string, unknown>

function firstString(value: unknown): string | undefined {
    const single = Array.isArray(value) ? value[0] : value
    return typeof single === 'string' && single.length ? single : undefined
}

function slugify(value: string | null | undefined): string {
    return (value ?? '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/--+/g, '-')
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Location filters in the URL are slugs (`setagaya`, `tokyo`). The directory still stores
 * display names, so a selected value matches the English name, the Japanese name, or either
 * side's slug.
 */
function placeMatches(selected: string | undefined, en: string | undefined, ja: string | undefined): boolean {
    if (!selected) return true
    if (en === selected || ja === selected) return true

    const selectedSlug = slugify(selected)
    if (!selectedSlug) return false

    return slugify(en) === selectedSlug || slugify(ja) === selectedSlug
}

function matchesLocation(facility: Facility, filters: SearchFilters): boolean {
    const address = facility.contact?.address

    return placeMatches(filters.city, address?.cityEn, address?.cityJa)
      && placeMatches(filters.prefecture, address?.prefectureEn, address?.prefectureJa)
}

function intersects<T>(selected: T[] | undefined, actual: T[] | undefined): boolean {
    if (!selected?.length) return true
    return (actual ?? []).some(value => selected.includes(value))
}

function matchesProfessional(professional: HealthcareProfessional, filters: SearchFilters): boolean {
    return intersects(filters.specialties, professional.specialties)
      && intersects(filters.languages, professional.spokenLanguages)
}

/**
 * Facilities matching the location filters, each carrying the professionals who match the
 * specialty and language filters. A facility with no matching professional is not a result:
 * the listing is about who you can see, not which buildings exist.
 */
export function filterDirectory(
    facilities: readonly Facility[],
    professionals: readonly HealthcareProfessional[],
    filters: SearchFilters
): FacilitySearchResult[] {
    const matchingProfessionals = new Map<string, HealthcareProfessional>()
    for (const professional of professionals) {
        if (matchesProfessional(professional, filters)) {
            matchingProfessionals.set(professional.id, professional)
        }
    }

    const results: FacilitySearchResult[] = []
    for (const facility of facilities) {
        if (!matchesLocation(facility, filters)) continue

        const healthcareProfessionals = (facility.healthcareProfessionalIds ?? [])
            .map(id => matchingProfessionals.get(id))
            .filter((professional): professional is HealthcareProfessional => !!professional)

        if (healthcareProfessionals.length) {
            results.push({ ...facility, healthcareProfessionals })
        }
    }

    return results
}

const SPECIALTY_VALUES = Object.values(Specialty) as Specialty[]
const SPECIALTY_SET = new Set<string>(SPECIALTY_VALUES)
const LOCALE_VALUES = Object.values(Locale) as Locale[]
const LOCALE_SET = new Set<string>(LOCALE_VALUES)

const specialtyToParam = new Map<Specialty, string>()
const paramToSpecialty = new Map<string, Specialty>()
for (const specialty of SPECIALTY_VALUES) {
    const param = slugify(specialty.replaceAll('_', ' '))
    if (!param) continue
    specialtyToParam.set(specialty, param)
    paramToSpecialty.set(param, specialty)
}

const localeToLanguageParam = new Map<Locale, string>()
const languageParamToLocale = new Map<string, Locale>()
const localesByLanguage = new Map<string, Locale[]>()
for (const locale of LOCALE_VALUES) {
    const language = (locale.split('_')[0] ?? locale).toLowerCase()
    const group = localesByLanguage.get(language) ?? []
    group.push(locale)
    localesByLanguage.set(language, group)
}
for (const locale of LOCALE_VALUES) {
    const [languageTag, region] = locale.split('_')
    const language = (languageTag ?? locale).toLowerCase()
    const group = localesByLanguage.get(language) ?? []
    const param = group.length > 1 && region
        ? `${language}-${region.toLowerCase()}`
        : language
    localeToLanguageParam.set(locale, param)
    languageParamToLocale.set(param, locale)
    languageParamToLocale.set(locale, locale)
    languageParamToLocale.set(locale.toLowerCase(), locale)
}

export function specialtySearchParam(specialty: Specialty): string {
    return specialtyToParam.get(specialty) ?? specialty
}

export function languageSearchParam(locale: string): string {
    return localeToLanguageParam.get(locale as Locale) ?? locale
}

export function prefectureSearchParam(name: string): string {
    return slugify(name) || name
}

function parseSpecialty(raw: string | undefined): Specialty | undefined {
    if (!raw) return undefined
    if (SPECIALTY_SET.has(raw)) return raw as Specialty
    return paramToSpecialty.get(raw.toLowerCase())
}

function parseLanguage(raw: string | undefined): Locale | undefined {
    if (!raw) return undefined
    if (LOCALE_SET.has(raw)) return raw as Locale
    return languageParamToLocale.get(raw.toLowerCase())
}

function parsePlace(raw: string | undefined): string | undefined {
    if (!raw) return undefined
    return slugify(raw) || raw
}

function parsePage(raw: string | undefined): number | undefined {
    if (!raw) return undefined
    const page = Number.parseInt(raw, 10)
    return Number.isInteger(page) && page > 1 ? page : undefined
}

/**
 * Reads the search state out of the URL, dropping anything that is not a real specialty or
 * language so a mistyped or stale link degrades to a broader search rather than an empty one.
 *
 * Human-readable params (`specialty=pediatrics&language=en&city=setagaya`) are the stored
 * form. GraphQL enum values (`DENTISTRY`, `en_US`) are still accepted so older links keep
 * working.
 */
export function parseSearchQuery(query: SearchLocationQuery): SearchQueryState {
    const specialty = parseSpecialty(firstString(query.specialty))
    const language = parseLanguage(firstString(query.language))

    return {
        city: parsePlace(firstString(query.city)),
        prefecture: parsePlace(firstString(query.prefecture)),
        specialties: specialty ? [specialty] : undefined,
        languages: language ? [language] : undefined,
        facilityId: firstString(query.facility),
        page: parsePage(firstString(query.page))
    }
}

/** The inverse of parseSearchQuery: only set keys are emitted, so clean URLs stay clean. */
export function buildSearchQuery(state: SearchQueryState): Record<string, string> {
    const query: Record<string, string> = {}

    if (state.specialties?.[0]) query.specialty = specialtySearchParam(state.specialties[0])
    if (state.languages?.[0]) query.language = languageSearchParam(state.languages[0])
    if (state.prefecture) query.prefecture = prefectureSearchParam(state.prefecture)
    if (state.city) query.city = parsePlace(state.city) ?? state.city
    if ((state.page ?? 1) > 1) query.page = String(state.page)
    if (state.facilityId) query.facility = state.facilityId

    return query
}

export function sameSearchQueryState(left: SearchLocationQuery, right: SearchLocationQuery): boolean {
    const a = parseSearchQuery(left)
    const b = parseSearchQuery(right)

    return a.city === b.city
      && a.prefecture === b.prefecture
      && (a.specialties?.[0] ?? '') === (b.specialties?.[0] ?? '')
      && (a.languages?.[0] ?? '') === (b.languages?.[0] ?? '')
      && a.facilityId === b.facilityId
      && (a.page ?? 1) === (b.page ?? 1)
}

export function hasActiveFilters(filters: SearchFilters): boolean {
    return !!(filters.city || filters.prefecture || filters.specialties?.length || filters.languages?.length)
}

/**
 * A Google Maps link that actually lands on the facility.
 *
 * Most rows carry a proper `/place/` URL and that is the best link there is — it opens the
 * business card. But some are a bare `google.com/maps?sca_esv=…` with tracking parameters and
 * no place at all (4 of 100 sampled against production), so the button opened Maps showing
 * nothing. Every facility does have exact coordinates, so those fall back to a name search
 * anchored at the clinic's own position: Google resolves the business, and the map is centred
 * on the right spot even when the name is ambiguous.
 */
export function facilityMapsUrl(facility: Facility, preferJapanese = false): string {
    const stored = (facility.contact?.googleMapsUrl ?? '').trim()

    // A place page is the best link there is, and a Google short link resolves to one.
    if (stored.includes('/place/') || /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//.test(stored)) {
        return stored
    }

    const name = (preferJapanese ? facility.nameJa : facility.nameEn) || facility.nameEn || facility.nameJa
    const { mapLatitude: lat, mapLongitude: lng } = facility

    /*
     * Never fall back to the stored value here. What is left at this point is a tracking-param
     * search URL or, in one row, the literal string "google.maps" — which as an href is a
     * relative path into our own site, the same trap the website field had.
     */
    if (!lat || !lng) {
        return ''
    }

    return name
        ? `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},17z`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

/*
 * Contact values are volunteer-entered free text, so they arrive in shapes an <a href> cannot
 * use. These helpers decide both whether to show a control at all and what to link it to.
 */

/** Values that mean "we don't have one", entered instead of leaving the field blank. */
const PLACEHOLDER_CONTACT_VALUES = new Set(['none', 'n/a', 'na', '-', '--', 'tbd', 'unknown', 'email@email.com'])

function isPlaceholder(value: string): boolean {
    return !value || PLACEHOLDER_CONTACT_VALUES.has(value.trim().toLowerCase())
}

/**
 * A usable website URL, or an empty string when there is nothing worth linking.
 *
 * Many rows store a bare host such as `www.megurokhome.com`. Without a scheme the browser reads
 * that as a *relative* path, so the button navigated to `/search/www.megurokhome.com` instead of
 * leaving the site — which is the "website button sometimes does nothing" report.
 */
export function facilityWebsiteUrl(facility: Facility): string {
    const raw = (facility.contact?.website ?? '').trim()

    if (isPlaceholder(raw)) {
        return ''
    }

    /*
     * `http://` rather than `https://` for a bare host. Of the five scheme-less domains in
     * production, four serve both and redirect themselves to https, but www.suwa-pediatrics.com
     * has no working certificate — prefixing https there produced a browser security
     * interstitial instead of the clinic. http reaches 5 of 5, and modern browsers attempt the
     * upgrade themselves, so nothing that can be secure is left insecure.
     */
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`

    try {
        const url = new URL(withScheme)
        // A host with no dot is not a public site; it is someone's note to themselves.
        return url.hostname.includes('.') ? url.toString() : ''
    } catch {
        return ''
    }
}

/** The website as a human reads it: no scheme, no trailing slash. */
export function facilityWebsiteLabel(facility: Facility): string {
    const url = facilityWebsiteUrl(facility)
    if (!url) return ''

    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

/** The phone number as it should be shown, or an empty string. */
export function facilityPhone(facility: Facility): string {
    const raw = (facility.contact?.phone ?? '').trim()
    // Needs enough digits to be a real number; Japanese numbers are 10 or 11.
    return !isPlaceholder(raw) && (raw.match(/\d/g) ?? []).length >= 9 ? raw : ''
}

/**
 * The same number in a form `tel:` can actually dial.
 *
 * Display and dial have to differ: one row is stored as "+81 045-641-6961", which keeps the
 * domestic trunk `0` after the country code. That is never valid internationally, so the raw
 * value produced a link that failed to connect.
 */
export function facilityPhoneHref(facility: Facility): string {
    const display = facilityPhone(facility)
    if (!display) return ''

    const compact = display.replace(/[^\d+]/g, '')

    // +81 followed by a trunk 0: drop the 0, which is only used when dialling domestically.
    return compact.startsWith('+810') ? `+81${compact.slice(4)}` : compact
}

/** A contactable email address, or an empty string. */
export function facilityEmail(facility: Facility): string {
    const raw = (facility.contact?.email ?? '').trim()
    return !isPlaceholder(raw) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw) ? raw : ''
}
