import { PAGE_META_TITLE_ROUTES } from './pageTitles'
import { ROBOTS_DISALLOW_PATHS } from './seo'

/**
 * Private and non-enumerable trees the sitemap must never list. Matches
 * `robots.txt` plus `/u` (SPA profiles we cannot enumerate from the API yet).
 */
export const SITEMAP_EXCLUDE = [
    ...ROBOTS_DISALLOW_PATHS.flatMap(path => [path, `${path}/**`]),
    '/u',
    '/u/**'
] as const

/** Public indexable paths. The same exhaustive map as document titles. */
export function publicSitemapUrls(): Array<{ loc: string }> {
    return Object.values(PAGE_META_TITLE_ROUTES).map(loc => ({ loc }))
}
