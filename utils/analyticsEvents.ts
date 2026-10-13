/* eslint-disable camelcase -- These keys are the Umami dashboard names. Renaming one splits history. */

import {
    facilityEmail,
    facilityMapsUrl,
    facilityPhone,
    facilityWebsiteUrl,
    type FacilitySearchResult
} from '~/utils/searchDirectory'

/**
 * Every product event and the only properties it may carry.
 *
 * Umami stores this against a visitor. Values are closed lists or listing counts.
 * A name, phone, email, address, url, free-text query, or record id is not a value
 * this module can send: the allowlist drops the whole event first.
 */

const YES_NO = ['yes', 'no'] as const
const BROWSE_KIND = ['specialty', 'prefecture', 'all'] as const
const CLINIC_FROM = ['results', 'hub', 'doctor'] as const
const DOCTOR_FROM = ['results', 'hub', 'search_details', 'clinic'] as const
const CONTACT_SURFACE = ['search_details', 'clinic'] as const
const FILTER_FROM = ['filter_bar', 'empty_results'] as const
const RESULT_OUTCOME = ['empty', 'some'] as const
const MAP_STATE = ['shown', 'hidden'] as const
const BACK_FROM = ['clinic', 'doctor'] as const
const RELATED_KIND = ['specialty', 'language'] as const
const RELATED_FROM = ['clinic', 'doctor'] as const
const CRUMB_LEVEL = ['home', 'prefecture', 'city'] as const
const SITE_LANGUAGES = ['en', 'ja', 'zh', 'vi', 'ko', 'tl', 'pt', 'fr', 'ru', 'de', 'it'] as const
const NOT_FOUND_AREA = ['clinic', 'doctor', 'area', 'other'] as const
const NOT_FOUND_TO = ['home', 'search'] as const
const SUBMIT_REASON = ['validation', 'server'] as const

/** Listing counts only. Anything larger is an id or a bug, and is clamped before send. */
export const LISTING_COUNT_CAP = 10_000

type SiteLanguage = typeof SITE_LANGUAGES[number]
type RuntimeField = readonly string[] | 'count'

export const eventCatalog = {
    'Search submitted': {
        has_specialty: YES_NO,
        has_language: YES_NO,
        has_prefecture: YES_NO
    },
    'Browse clicked': {
        kind: BROWSE_KIND
    },
    'Filters opened': null,
    'Filters changed': {
        has_specialty: YES_NO,
        has_language: YES_NO,
        has_prefecture: YES_NO,
        has_city: YES_NO
    },
    'Filter unavailable': {
        control: ['city'] as const
    },
    'Filters cleared': {
        from: FILTER_FROM
    },
    'Results shown': {
        outcome: RESULT_OUTCOME,
        has_filters: YES_NO
    },
    'Load more results': {
        shown: 'count' as const,
        total: 'count' as const
    },
    'Search failed': null,
    'Search retried': null,
    'Clinic opened': {
        from: CLINIC_FROM
    },
    'Doctor opened': {
        from: DOCTOR_FROM
    },
    'Clinic viewed': {
        has_phone: YES_NO,
        has_website: YES_NO,
        has_email: YES_NO,
        has_maps: YES_NO,
        has_professionals: YES_NO
    },
    'Doctor viewed': {
        has_facility: YES_NO,
        has_specialty: YES_NO,
        has_language: YES_NO
    },
    'Map toggled': {
        state: MAP_STATE
    },
    'Map failed': null,
    'Map pin clicked': null,
    'Call clicked': {
        surface: CONTACT_SURFACE
    },
    'Website clicked': {
        surface: CONTACT_SURFACE
    },
    'Email clicked': {
        surface: CONTACT_SURFACE
    },
    'Maps clicked': {
        surface: CONTACT_SURFACE
    },
    'Details closed': {
        acted: YES_NO
    },
    'Back to search': {
        from: BACK_FROM
    },
    'Related clicked': {
        kind: RELATED_KIND,
        from: RELATED_FROM
    },
    'Breadcrumb clicked': {
        level: CRUMB_LEVEL
    },
    'Language switched': {
        to: SITE_LANGUAGES
    },
    'Not found': {
        area: NOT_FOUND_AREA
    },
    'Not found escaped': {
        to: NOT_FOUND_TO
    },
    'Submit completed': null,
    'Submit rejected': {
        reason: SUBMIT_REASON
    }
} as const

type Catalog = typeof eventCatalog

type FieldValue<F> = F extends 'count'
    ? number
    : F extends readonly (infer Value)[]
        ? Value
        : never

export type EventProps = {
    [Name in keyof Catalog]: Catalog[Name] extends null
        ? Record<string, never>
        : { [Key in keyof Catalog[Name]]: FieldValue<Catalog[Name][Key]> }
}

export function yesNo(value: boolean): 'yes' | 'no' {
    return value ? 'yes' : 'no'
}

export function searchSubmittedProps(input: {
    specialty: boolean
    language: boolean
    prefecture: boolean
}): EventProps['Search submitted'] {
    return {
        has_specialty: yesNo(input.specialty),
        has_language: yesNo(input.language),
        has_prefecture: yesNo(input.prefecture)
    }
}

export function resultsShownProps(
    outcome: EventProps['Results shown']['outcome'],
    hasFilters: boolean
): EventProps['Results shown'] {
    return {
        outcome,
        has_filters: yesNo(hasFilters)
    }
}

export function searchFilterFlags(filters: {
    specialties?: readonly unknown[]
    languages?: readonly unknown[]
    prefecture?: string
    city?: string
}): EventProps['Filters changed'] {
    return {
        has_specialty: yesNo(Boolean(filters.specialties?.length)),
        has_language: yesNo(Boolean(filters.languages?.length)),
        has_prefecture: yesNo(Boolean(filters.prefecture)),
        has_city: yesNo(Boolean(filters.city))
    }
}

/**
 * Yes/no only, using the same normalisers as the buttons. A placeholder phone
 * ("none") is a no, because the page does not offer a way to call.
 */
export function clinicViewedProps(facility: FacilitySearchResult): EventProps['Clinic viewed'] {
    return {
        has_phone: yesNo(Boolean(facilityPhone(facility))),
        has_website: yesNo(Boolean(facilityWebsiteUrl(facility))),
        has_email: yesNo(Boolean(facilityEmail(facility))),
        has_maps: yesNo(Boolean(facilityMapsUrl(facility))),
        has_professionals: yesNo(facility.healthcareProfessionals.length > 0)
    }
}

export function doctorViewedProps(professional: {
    facilities?: readonly unknown[] | null
    specialties?: readonly unknown[] | null
    spokenLanguages?: readonly unknown[] | null
}): EventProps['Doctor viewed'] {
    return {
        has_facility: yesNo(Boolean(professional.facilities?.length)),
        has_specialty: yesNo(Boolean(professional.specialties?.length)),
        has_language: yesNo(Boolean(professional.spokenLanguages?.length))
    }
}

const LOCALE_TO_SITE_LANGUAGE = {
    en_US: 'en',
    ja_JP: 'ja',
    zh_CN: 'zh',
    vi_VN: 'vi',
    ko_KR: 'ko',
    tl_PH: 'tl',
    pt_BR: 'pt',
    fr_FR: 'fr',
    ru_RU: 'ru',
    de_DE: 'de',
    it_IT: 'it'
} as const satisfies Record<string, SiteLanguage>

/** Site UI locale only. Spoken-language filters are not a value here. */
export function siteLanguage(code: string): SiteLanguage | null {
    return LOCALE_TO_SITE_LANGUAGE[code as keyof typeof LOCALE_TO_SITE_LANGUAGE] ?? null
}

const RESERVED_ROOTS = new Set([
    'search',
    'about',
    'submit',
    'login',
    'terms',
    'npo',
    'privacypolicy',
    'my-page',
    'u',
    'doctor',
    'clinic',
    '404'
])

function pathSegments(path: string): string[] {
    const pathname = path.split(/[?#]/)[0] ?? ''
    return pathname.split('/').filter(Boolean)
}

/**
 * Which kind of url missed. The path itself stays here: people type names into
 * the address bar, and that string must not be an event property.
 */
export function notFoundArea(path: string): EventProps['Not found']['area'] {
    const segments = pathSegments(path)
    const root = segments[0] ?? ''
    if (root === 'clinic') return 'clinic'
    if (root === 'doctor') return 'doctor'
    if (root && !RESERVED_ROOTS.has(root) && segments.length <= 3) return 'area'
    return 'other'
}

/** Home, prefecture, and city crumbs only. The current-page label is the listing name and is not a link. */
export function breadcrumbLevel(to: string): EventProps['Breadcrumb clicked']['level'] | null {
    const segments = pathSegments(to)
    if (segments.length === 0) return 'home'
    const root = segments[0]
    if (!root || RESERVED_ROOTS.has(root)) return null
    if (segments.length === 1) return 'prefecture'
    if (segments.length === 2) return 'city'
    return null
}

let searchDetailsContacted = false

export function noteSearchDetailsContact(): void {
    searchDetailsContacted = true
}

export function resetSearchDetailsContact(): void {
    searchDetailsContacted = false
}

export function takeSearchDetailsActed(): 'yes' | 'no' {
    const acted = yesNo(searchDetailsContacted)
    searchDetailsContacted = false
    return acted
}

export function track<Name extends keyof Catalog>(
    ...args: Catalog[Name] extends null
        ? [name: Name]
        : [name: Name, props: EventProps[Name]]
): void {
    const name = args[0]
    const props = (args as [Name, Record<string, unknown>?])[1]
    const payload = acceptedPayload(name, props)
    if (!payload) return
    deliver(name, payload)
}

function acceptedPayload(
    name: string,
    props: Record<string, unknown> | undefined
): Record<string, string | number> | null {
    if (!Object.hasOwn(eventCatalog, name)) return null

    const spec = eventCatalog[name as keyof Catalog]
    if (spec === null) {
        return props && Object.keys(props).length > 0 ? null : {}
    }

    const fields = spec as unknown as Record<string, RuntimeField>
    const allowed = Object.keys(fields)
    const received = props ?? {}
    const receivedKeys = Object.keys(received)
    const keysMatch = receivedKeys.length === allowed.length
      && receivedKeys.every(key => Object.hasOwn(fields, key))
    if (!keysMatch) return null

    const payload: Record<string, string | number> = {}
    for (const key of allowed) {
        const cleaned = cleanField(fields[key] as RuntimeField, received[key])
        if (cleaned === null) return null
        payload[key] = cleaned
    }
    return payload
}

function cleanField(field: RuntimeField, value: unknown): string | number | null {
    if (field === 'count') return cleanCount(value)
    if (typeof value !== 'string') return null
    if (looksLikeEmail(value) || looksLikePhone(value)) return null
    return field.includes(value) ? value : null
}

function cleanCount(value: unknown): number | null {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return null
    return Math.min(value, LISTING_COUNT_CAP)
}

function looksLikeEmail(value: string): boolean {
    return value.includes('@')
}

function looksLikePhone(value: string): boolean {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 8 && /^[+\d\s().-]+$/.test(value)
}

function deliver(name: string, payload: Record<string, string | number>): void {
    if (typeof window === 'undefined' || typeof window.umami?.track !== 'function') return

    try {
        if (Object.keys(payload).length === 0) {
            window.umami.track(name)
            return
        }
        window.umami.track(name, payload)
    } catch {
        // A tracker failure must not block the click that reported it.
    }
}
