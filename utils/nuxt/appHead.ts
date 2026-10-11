import {
    cleanUmamiEnv,
    UMAMI_DATA_HOST_URL,
    UMAMI_SCRIPT_PATH,
    umamiDataDomains,
    umamiUpstreams
} from './umamiProxy'

/**
 * The analytics tag, only when it is actually configured.
 *
 * A bare truthiness check is not enough: the deploy environment sets these to the
 * literal two-character string `""`, which is truthy, so the build emitted
 * `<script src='""'>`. An empty `src` resolves against the current document, so every
 * page requested itself as JavaScript — normally a harmless 404, but fatal on any path
 * covered by an SPA rewrite, where it returns HTML with 200 and the parser throws
 * `Unexpected token '<'` before the app can hydrate.
 *
 * The src is a same-origin path, not NUXT_PUBLIC_UMAMI_URL. That variable is the
 * upstream script (cloud.umami.is or a self-hosted tracker). Netlify proxies
 * `/stats.js` and `/api/send` to it so the browser never contacts Umami's hosts,
 * which ad blockers drop. See public/_redirects.
 */
export function umamiScript() {
    const url = cleanUmamiEnv(process.env.NUXT_PUBLIC_UMAMI_URL)
    const siteId = cleanUmamiEnv(process.env.NUXT_PUBLIC_UMAMI_SITE_ID)

    if (!url || !siteId || !umamiUpstreams(url) || process.env.NODE_ENV !== 'production') {
        return []
    }

    return [{
        src: UMAMI_SCRIPT_PATH,
        async: true,
        defer: true,
        'data-website-id': siteId,
        'data-host-url': UMAMI_DATA_HOST_URL,
        'data-domains': umamiDataDomains()
    }]
}

/**
 * Applies the stored colour scheme before first paint.
 *
 * Runs inline in <head> so a returning dark-mode visitor never sees a light flash on a
 * prerendered page. Mirrors the migration in composables/useColorScheme.ts: only an explicit
 * dark choice survives from the old five-colourway picker. Anything else means "auto", which
 * is no class at all — the stylesheet then follows prefers-color-scheme.
 */
export const COLOR_SCHEME_BOOTSTRAP = `(function () {
  try {
    var s = localStorage.getItem('colorScheme')
    if (s !== 'dark' && s !== 'light') s = localStorage.getItem('isDarkMode') === 'true' ? 'dark' : ''
    if (s) document.documentElement.classList.add('theme-' + s)
  } catch (e) {}
})()`
