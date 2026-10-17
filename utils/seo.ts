import { DEFAULT_LOCALE_CODE, LOCALE_CODES, localizedPath, unlocalizedPath } from './localePath'
import { SITE_ORIGIN, SITE_SITEMAP_URL } from './site'

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
 * indexable pages. A locale prefix on `path` is kept, so `/ja-JP/about` canonicalises
 * to that URL and the unprefixed path stays the English URL.
 *
 * Trailing slashes are stripped to match sitemap locs. Generate must emit
 * `about.html` (`nitro.prerender.autoSubfolderIndex: false`) so Netlify Pretty
 * URLs serve `/about` as 200 instead of 301ing it to `/about/`.
 */
export function canonicalUrl(path: string): string {
    const normalised = normalisePagePath(path)
    return normalised === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalised}`
}

/** Open Graph wants `en_US`; vue-i18n ships `en-US`. */
export function openGraphLocale(i18nCode: string): string {
    return i18nCode.replaceAll('-', '_')
}

export type HreflangAlternate = {
    hreflang: string
    href: string
}

/**
 * One alternate per site locale, plus `x-default` on the unprefixed English URL.
 * Href is absolute so it matches `canonicalUrl` for that locale.
 */
export function hreflangAlternates(path: string): HreflangAlternate[] {
    const alternates: HreflangAlternate[] = LOCALE_CODES.map(code => ({
        hreflang: code,
        href: canonicalUrl(localizedPath(path, code))
    }))
    alternates.push({
        hreflang: 'x-default',
        href: canonicalUrl(localizedPath(path, DEFAULT_LOCALE_CODE))
    })
    return alternates
}

export function hreflangLinkTags(path: string): Array<{
    rel: 'alternate'
    hreflang: string
    href: string
    key: string
}> {
    return hreflangAlternates(path).map(alternate => ({
        rel: 'alternate' as const,
        hreflang: alternate.hreflang,
        href: alternate.href,
        key: `hreflang-${alternate.hreflang}`
    }))
}

/**
 * `robots.txt` has no patterns, so each private tree is listed again under every
 * non-default locale prefix. `public/robots.txt` is locked to this list.
 */
export function robotsDisallowPaths(): string[] {
    const prefixed = LOCALE_CODES
        .filter(code => code !== DEFAULT_LOCALE_CODE)
        .flatMap(code => ROBOTS_DISALLOW_PATHS.map(path => localizedPath(path, code)))
    return [...ROBOTS_DISALLOW_PATHS, ...prefixed]
}

/**
 * Named so a crawler that only reads its own group still sees the private-tree
 * disallows. A specific user-agent group does not inherit `User-agent: *`.
 * `Allow: /` is shorter than those Disallow paths, so the private trees stay out.
 */
export const AI_CRAWLER_AGENTS = [
    'OAI-SearchBot',
    'PerplexityBot',
    'ClaudeBot',
    'Google-Extended'
] as const

function robotsGroup(userAgent: string, allowAll: boolean): string {
    const lines = [`User-agent: ${userAgent}`]
    if (allowAll) {
        lines.push('Allow: /')
    }
    lines.push(...robotsDisallowPaths().map(path => `Disallow: ${path}`))
    return lines.join('\n')
}

/** `public/robots.txt` is locked to this text by `tests/vitest/unit/seo.spec.ts`. */
export function robotsTxt(): string {
    const groups = [
        robotsGroup('*', false),
        ...AI_CRAWLER_AGENTS.map(agent => robotsGroup(agent, true))
    ]
    return `${groups.join('\n\n')}\n\nSitemap: ${SITE_SITEMAP_URL}\n`
}

/**
 * Query keys that turn `/search` into a filter combination. Those URLs stay out of
 * the index so they cannot compete with the curated facet pages (`/tokyo/dentistry`).
 * Bare `/search` remains indexable.
 */
const SEARCH_NOINDEX_QUERY_KEYS = ['city', 'specialty', 'language', 'prefecture', 'page', 'facility'] as const

function queryValueIsPresent(value: unknown): boolean {
    if (typeof value === 'string') return value.length > 0
    return value !== null && value !== undefined && String(value).length > 0
}

function queryParamHasValue(query: Record<string, unknown> | undefined, key: string): boolean {
    if (!query) return false
    const value = query[key]
    return Array.isArray(value) ? value.some(queryValueIsPresent) : queryValueIsPresent(value)
}

function queryFromPath(path: string): Record<string, string> | undefined {
    const search = path.split('?')[1]
    return search ? Object.fromEntries(new URLSearchParams(search)) : undefined
}

export function isNoindexRoute(path: string, query?: Record<string, unknown>): boolean {
    const normalised = unlocalizedPath(normalisePagePath(path))
    if (ROBOTS_DISALLOW_PATHS.some(
        prefix => normalised === prefix || normalised.startsWith(`${prefix}/`)
    )) {
        return true
    }

    if (normalised === '/search') {
        const params = query ?? queryFromPath(path)
        return SEARCH_NOINDEX_QUERY_KEYS.some(key => queryParamHasValue(params, key))
    }

    if (normalised === '/404') {
        return true
    }

    return false
}
