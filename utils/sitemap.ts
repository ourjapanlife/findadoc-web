import { LOCALE_CODES, localizedPath } from './localePath'
import { PAGE_META_TITLE_ROUTES } from './pageTitles'
import { hreflangAlternates, ROBOTS_DISALLOW_PATHS, type HreflangAlternate } from './seo'

/**
 * Private and non-enumerable trees the sitemap must never list. Matches
 * `robots.txt` plus `/u` (SPA profiles we cannot enumerate from the API yet).
 */
export const SITEMAP_EXCLUDE = [
    ...ROBOTS_DISALLOW_PATHS.flatMap(path => [path, `${path}/**`]),
    '/u',
    '/u/**'
] as const

export type SitemapLocaleEntry = {
    loc: string
    lastmod?: string
    alternatives: HreflangAlternate[]
}

/**
 * One sitemap row per locale, each carrying the same `xhtml:link` set.
 * `autoI18n` stays off so this remains a single `/sitemap.xml` (an i18n sitemap
 * index would change the URL `robots.txt` publishes).
 */
export function withLocaleAlternates<T extends { loc: string, lastmod?: string }>(
    entries: readonly T[]
): Array<Omit<T, 'loc'> & SitemapLocaleEntry> {
    return entries.flatMap(entry => {
        const alternatives = hreflangAlternates(entry.loc)
        return LOCALE_CODES.map(code => ({
            ...entry,
            loc: localizedPath(entry.loc, code),
            alternatives
        }))
    })
}

/** Public indexable paths. The same exhaustive map as document titles, per locale. */
export function publicSitemapUrls(): SitemapLocaleEntry[] {
    return withLocaleAlternates(Object.values(PAGE_META_TITLE_ROUTES).map(loc => ({ loc })))
}
