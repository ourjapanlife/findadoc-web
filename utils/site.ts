/**
 * The brand name used in the global title template and social meta tags.
 *
 * Keep this in one place: nuxt.config.ts cannot hold a function `titleTemplate`
 * (it is serialized into the app manifest and functions are dropped), so app.vue
 * formats titles at runtime with `formatPageTitle`.
 */
export const SITE_TITLE = 'Find a Doc, Japan'

const BRAND_SUFFIX = ` · ${SITE_TITLE}`

/**
 * Builds a document title that always includes the brand, never doubles it, and
 * never produces a leading " · Brand" when a page has not set a title.
 *
 * Untitled pages (and pages whose title is already the brand) fall back to the
 * brand alone, so the homepage can opt into a descriptive title without
 * `titleTemplate` rendering "Find a Doc, Japan · Find a Doc, Japan".
 */
export function formatPageTitle(title?: string | null): string {
    const trimmed = title?.trim() ?? ''

    if (!trimmed || trimmed === SITE_TITLE) {
        return SITE_TITLE
    }

    if (trimmed.endsWith(BRAND_SUFFIX)) {
        return trimmed
    }

    return `${trimmed}${BRAND_SUFFIX}`
}
