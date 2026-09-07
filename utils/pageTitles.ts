import type enMessages from '../i18n/locales/en.json'

export type PageMetaTitleKey = Extract<keyof typeof enMessages.pageMeta, string>

export function pageMetaI18nKey(key: PageMetaTitleKey): `pageMeta.${PageMetaTitleKey}` {
    return `pageMeta.${key}`
}

/**
 * Every `pageMeta` title key must map to a route. Adding a translation without a
 * path (or a path with a typo'd key) is a compile error — the same exhaustiveness
 * Effect gets from `Match.exhaustive`, via `satisfies Record<PageMetaTitleKey, …>`.
 *
 * New `pages/*.vue` files are a different axis: TypeScript cannot see the filesystem,
 * so `tests/vitest/unit/siteTitle.spec.ts` asserts every page is either in this map
 * or under an untitled prefix (`/my-page`, `/u`).
 */
export const PAGE_META_TITLE_ROUTES = {
    homeTitle: '/',
    aboutTitle: '/about',
    submitTitle: '/submit',
    termsTitle: '/terms',
    privacyTitle: '/privacypolicy',
    npoTitle: '/npo',
    searchTitle: '/search',
    loginTitle: '/login'
} as const satisfies Record<PageMetaTitleKey, string>

/**
 * Authenticated / non-indexable surfaces that deliberately use the brand-only
 * fallback from `formatPageTitle`. A new page that is neither titled nor listed
 * here fails the exhaustive pages test.
 */
const UNTITLED_ROUTE_PREFIXES = ['/my-page', '/u'] as const

function normalisePagePath(path: string): string {
    if (path.length > 1 && path.endsWith('/')) {
        return path.slice(0, -1)
    }
    return path || '/'
}

export function pageTitleKeyForPath(path: string): PageMetaTitleKey | undefined {
    const normalised = normalisePagePath(path)

    for (const [key, route] of Object.entries(PAGE_META_TITLE_ROUTES) as [PageMetaTitleKey, string][]) {
        if (route === normalised) {
            return key
        }
    }

    return undefined
}

export function isUntitledRoute(path: string): boolean {
    const normalised = normalisePagePath(path)
    return UNTITLED_ROUTE_PREFIXES.some(prefix => normalised === prefix || normalised.startsWith(`${prefix}/`))
}
