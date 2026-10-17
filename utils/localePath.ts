import i18nLocales from '../i18n'

/** Unprefixed locale. Matches `i18n.defaultLocale` in `nuxt.config.ts`. */
export const DEFAULT_LOCALE_CODE = 'en-US'

/**
 * Locales whose clinic, doctor, hub, and facet HTML is written at generate time.
 * Production is about 1,100 of those pages. All 11 locales is ~12,000 SSR passes
 * and Netlify kills the build at 18 minutes. English is the default URL.
 * Japanese is the host-country language. Marketing pages still generate for
 * every locale. Other directory URLs render in the browser — see `public/_redirects`.
 */
export const DIRECTORY_PRERENDER_LOCALE_CODES = [DEFAULT_LOCALE_CODE, 'ja-JP'] as const

export function isDirectoryPrerenderLocale(code: string): boolean {
    return (DIRECTORY_PRERENDER_LOCALE_CODES as readonly string[]).includes(code)
}

/** vue-i18n codes, English first. Same order as `i18n/index.ts`. */
export const LOCALE_CODES = i18nLocales.map(locale => locale.code)

/** Locales that do not get static directory HTML. */
export function clientRenderedDirectoryLocaleCodes(): string[] {
    return LOCALE_CODES.filter(code => !isDirectoryPrerenderLocale(code))
}

// Path segments are plain strings, so membership accepts any string.
const PREFIXED_LOCALE_CODES = new Set<string>(
    LOCALE_CODES.filter(code => code !== DEFAULT_LOCALE_CODE)
)

function pathnameOnly(path: string): string {
    const withoutQuery = path.split('?')[0]?.split('#')[0] ?? ''
    if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
        return withoutQuery.slice(0, -1)
    }
    return withoutQuery || '/'
}

/**
 * Drop a `prefix_except_default` locale segment so `/ja-JP/about` and `/about`
 * compare as the same page. Entity slugs stay romanised; the prefix is the locale.
 */
export function unlocalizedPath(path: string): string {
    const normalised = pathnameOnly(path)
    const prefix = normalised.split('/')[1]
    if (!prefix || !PREFIXED_LOCALE_CODES.has(prefix)) {
        return normalised
    }

    const rest = normalised.split('/').slice(2).join('/')
    return rest ? `/${rest}` : '/'
}

/** Locale the URL already chose, or the default when the path has no prefix. */
export function localeCodeFromPath(path: string): string {
    const prefix = pathnameOnly(path).split('/')[1]
    return prefix && PREFIXED_LOCALE_CODES.has(prefix) ? prefix : DEFAULT_LOCALE_CODE
}

/**
 * Same page under another locale. Default locale stays unprefixed.
 * `/clinic/tokyo/...` becomes `/ja-JP/clinic/tokyo/...`; the slug does not change.
 * Query and hash are kept so `/my-page?view=facilities` stays a dashboard link.
 */
export function localizedPath(path: string, localeCode: string): string {
    const hashIndex = path.indexOf('#')
    const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
    const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
    const queryIndex = withoutHash.indexOf('?')
    const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : ''
    const bare = unlocalizedPath(withoutHash)
    const prefixed = PREFIXED_LOCALE_CODES.has(localeCode)
        ? (bare === '/' ? `/${localeCode}` : `/${localeCode}${bare}`)
        : bare
    return `${prefixed}${query}${hash}`
}

function withLocales(paths: readonly string[], codes: readonly string[]): string[] {
    return paths.flatMap(path => codes.map(code => localizedPath(path, code)))
}

/** One path per site locale, default locale first and unprefixed. */
export function withLocaleVariants(paths: readonly string[]): string[] {
    return withLocales(paths, LOCALE_CODES)
}

/** Directory pages for the locales `nuxi generate` actually writes. */
export function withDirectoryLocaleVariants(paths: readonly string[]): string[] {
    return withLocales(paths, DIRECTORY_PRERENDER_LOCALE_CODES)
}

/** Nav highlight: `/ja-JP/about` is the About item. */
export function routeMatchesPath(routePath: string, path: string): boolean {
    const current = unlocalizedPath(routePath)
    if (path === '/') {
        return current === '/'
    }
    return current === path || current.startsWith(`${path}/`)
}
