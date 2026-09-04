import type { LocationQuery, LocationQueryRaw } from 'vue-router'
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
}

function matchesLocation(facility: Facility, filters: SearchFilters): boolean {
    const address = facility.contact?.address

    const cityMatches = !filters.city
      || address?.cityEn === filters.city
      || address?.cityJa === filters.city

    const prefectureMatches = !filters.prefecture
      || address?.prefectureEn === filters.prefecture
      || address?.prefectureJa === filters.prefecture

    return cityMatches && prefectureMatches
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

const SPECIALTIES = new Set<string>(Object.values(Specialty))
const LOCALES = new Set<string>(Object.values(Locale))

function firstString(value: LocationQuery[string]): string | undefined {
    const single = Array.isArray(value) ? value[0] : value
    return typeof single === 'string' && single.length ? single : undefined
}

/**
 * Reads the search state out of the URL, dropping anything that is not a real enum value so a
 * mistyped or stale link degrades to a broader search rather than an empty one.
 */
export function parseSearchQuery(query: LocationQuery): SearchQueryState {
    const specialty = firstString(query.specialty)
    const language = firstString(query.language)

    return {
        city: firstString(query.city),
        prefecture: firstString(query.prefecture),
        specialties: specialty && SPECIALTIES.has(specialty) ? [specialty as Specialty] : undefined,
        languages: language && LOCALES.has(language) ? [language as Locale] : undefined,
        facilityId: firstString(query.facility)
    }
}

/** The inverse of parseSearchQuery: only set keys are emitted, so clean URLs stay clean. */
export function buildSearchQuery(state: SearchQueryState): LocationQueryRaw {
    const query: Record<string, string> = {}

    if (state.specialties?.[0]) query.specialty = state.specialties[0]
    if (state.languages?.[0]) query.language = state.languages[0]
    if (state.prefecture) query.prefecture = state.prefecture
    if (state.city) query.city = state.city
    if (state.facilityId) query.facility = state.facilityId

    return query
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
