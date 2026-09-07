import { SITE_ORIGIN } from './site'

/**
 * Paths crawlers must not index. `public/robots.txt` Disallow lines are kept in
 * lockstep by `tests/vitest/unit/seo.spec.ts`. `/moderation` is listed even
 * though that page tree is gone, so leftover inbound links stay out of the index.
 *
 * `/u` is a public profile and is intentionally not here.
 */
export const ROBOTS_DISALLOW_PATHS = ['/moderation', '/my-page', '/login'] as const

export const DEFAULT_OG_LOCALE = 'en_US'

function normalisePagePath(path: string): string {
    const withoutQuery = path.split('?')[0]?.split('#')[0] ?? ''
    if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
        return withoutQuery.slice(0, -1)
    }
    return withoutQuery || '/'
}

/**
 * Self-referencing canonical for the current route. Query strings are stripped so
 * `/search?specialty=…` does not mint a unique URL until those filters are
 * indexable pages. Locale prefixes land with #1796.
 */
export function canonicalUrl(path: string): string {
    const normalised = normalisePagePath(path)
    return normalised === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalised}`
}

/** Open Graph wants `en_US`; vue-i18n ships `en-US`. */
export function openGraphLocale(i18nCode: string): string {
    return i18nCode.replaceAll('-', '_')
}

export function isNoindexRoute(path: string): boolean {
    const normalised = normalisePagePath(path)
    return ROBOTS_DISALLOW_PATHS.some(
        prefix => normalised === prefix || normalised.startsWith(`${prefix}/`)
    )
}
