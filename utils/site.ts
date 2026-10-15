/**
 * Site-wide identity used in titles, canonicals, and social meta.
 *
 * Keep this in one place: nuxt.config.ts cannot hold a function `titleTemplate`
 * (it is serialized into the app manifest and functions are dropped), so app.vue
 * formats titles at runtime with `formatPageTitle`. Canonicals always use
 * SITE_ORIGIN so prerendered HTML points at production, not localhost.
 */
export const SITE_TITLE = 'Find a Doc, Japan'

export const SITE_ORIGIN = 'https://www.findadoc.jp'

export const SITE_DESCRIPTION
    = 'Find English-speaking and multilingual doctors and clinics in Japan. '
      + 'Search by language, medical specialty, and location to find healthcare providers who speak your language. Free to use.'

export const SITE_SOCIAL_IMAGE = `${SITE_ORIGIN}/findadoc-social.jpg`

export const SITE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`

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

/**
 * The organisation's public contact address. It replaced a Google Form everywhere the site
 * asks people to get in touch, so the contact a bank or partner sees is on our own domain.
 */
export const CONTACT_EMAIL = 'contact@findadoc.jp'

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`

/** Registered name, as published in the footer and on /npo. */
export const NPO_LEGAL_NAME = 'NPO法人Find a Doc, Japan'

/** 東京都 NPO法人台帳 registration number. Shown on /npo. */
export const NPO_REGISTRATION_NUMBER = '9011005010215'

/** Certified by the Tokyo Metropolitan Government. Shown on /npo as 28 August 2023. */
export const NPO_FOUNDING_DATE = '2023-08-28'

/** Public profiles linked from the footer, menu, and about page. */
export const GITHUB_ORGANIZATION_URL = 'https://github.com/ourjapanlife'

export const LINKEDIN_ORGANIZATION_URL = 'https://www.linkedin.com/company/find-a-doc-japan/'

export const ORGANIZATION_PROFILE_URLS = [
    GITHUB_ORGANIZATION_URL,
    LINKEDIN_ORGANIZATION_URL
] as const
