import type enMessages from '../i18n/locales/en.json'
import { isGeographyHubRoute } from './hubPath'

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
 * so `tests/vitest/unit/siteTitle.spec.ts` asserts every page is either in this map,
 * under an untitled prefix (`/my-page`, `/u`, `/login`), an entity prefix
 * (`/clinic`, `/doctor`) that owns its title, or a geography hub (`/tokyo`)
 * or facet (`/tokyo/dentistry`).
 */
export const PAGE_META_TITLE_ROUTES = {
    homeTitle: '/',
    aboutTitle: '/about',
    submitTitle: '/submit',
    termsTitle: '/terms',
    privacyTitle: '/privacypolicy',
    npoTitle: '/npo',
    searchTitle: '/search'
} as const satisfies Record<PageMetaTitleKey, string>

/**
 * Authenticated / non-indexable surfaces that deliberately use the brand-only
 * fallback from `formatPageTitle`. `/login` is here because it is an Auth0
 * interstitial (ssr: false, not prerendered, not in the sitemap) — not a search result.
 */
const UNTITLED_ROUTE_PREFIXES = ['/my-page', '/u', '/login'] as const

/**
 * Directory entity pages set their own `<title>` from the record. They are not
 * in PAGE_META_TITLE_ROUTES (one key cannot cover hundreds of clinics or
 * doctors) and must not fall through to the brand-only title in `app.vue`.
 */
const ENTITY_ROUTE_PREFIXES = ['/clinic', '/doctor'] as const

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

export function isEntityRoute(path: string): boolean {
    const normalised = normalisePagePath(path)
    if (ENTITY_ROUTE_PREFIXES.some(prefix => normalised === prefix || normalised.startsWith(`${prefix}/`))) {
        return true
    }
    return isGeographyHubRoute(normalised)
}
