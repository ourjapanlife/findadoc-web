import { facilityDocumentTitle, locationCitySlug, locationPrefectureSlug } from './clinicPath'

/**
 * First path segments that already belong to a real page. A geography hub at
 * `/search` or `/doctor` would steal those routes; Nuxt static files win, but
 * we still omit them from the hub index so a prefecture named "Search" 404s
 * instead of colliding.
 */
export const RESERVED_HUB_SEGMENTS = new Set([
    'about',
    'terms',
    'privacypolicy',
    'submit',
    'npo',
    'search',
    'login',
    'my-page',
    'clinic',
    'doctor',
    'u',
    'moderation'
])

/** City hubs with fewer than this many facilities get `noindex` and stay out of the sitemap. */
export const INDEXABLE_CITY_HUB_MIN_FACILITIES = 2

export function isReservedHubSegment(segment: string): boolean {
    return RESERVED_HUB_SEGMENTS.has(segment)
}

export function isIndexableCityHub(facilityCount: number): boolean {
    return facilityCount >= INDEXABLE_CITY_HUB_MIN_FACILITIES
}

export function prefectureHubPathFromSlug(prefectureSlug: string): string | undefined {
    if (!prefectureSlug || isReservedHubSegment(prefectureSlug)) {
        return undefined
    }
    return `/${prefectureSlug}`
}

export function cityHubPathFromSlugs(prefectureSlug: string, citySlug: string): string | undefined {
    if (!prefectureSlug || !citySlug || isReservedHubSegment(prefectureSlug)) {
        return undefined
    }
    return `/${prefectureSlug}/${citySlug}`
}

export function prefectureHubPath(prefectureEn: string | null | undefined): string | undefined {
    return prefectureHubPathFromSlug(locationPrefectureSlug(prefectureEn))
}

export function cityHubPath(
    prefectureEn: string | null | undefined,
    cityEn: string | null | undefined
): string | undefined {
    return cityHubPathFromSlugs(locationPrefectureSlug(prefectureEn), locationCitySlug(cityEn))
}

export function hubPrefectureDocumentTitle(prefecture: string): string {
    return facilityDocumentTitle(`Healthcare in ${prefecture}`)
}

export function hubCityDocumentTitle(city: string, prefecture: string): string {
    return facilityDocumentTitle(`Healthcare in ${city}, ${prefecture}`)
}

/**
 * Runtime `/tokyo` and `/tokyo/shibuya`, plus the filesystem placeholders
 * `/[prefecture]` that `siteTitle.spec.ts` derives from the Vue page files.
 */
export function isGeographyHubRoute(path: string): boolean {
    const trimmed = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
    const parts = trimmed.split('/').filter(Boolean)

    if (parts.length < 1 || parts.length > 2) {
        return false
    }

    if (parts[0] === '[prefecture]') {
        return true
    }

    return !isReservedHubSegment(parts[0] ?? '')
}
