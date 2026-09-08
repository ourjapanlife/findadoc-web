/**
 * The analytics tag, only when it is actually configured.
 *
 * A bare truthiness check is not enough: the deploy environment sets these to the
 * literal two-character string `""`, which is truthy, so the build emitted
 * `<script src='""'>`. An empty `src` resolves against the current document, so every
 * page requested itself as JavaScript — normally a harmless 404, but fatal on any path
 * covered by an SPA rewrite, where it returns HTML with 200 and the parser throws
 * `Unexpected token '<'` before the app can hydrate.
 */
export function umamiScript() {
    const clean = (value?: string) => value?.replace(/^["']|["']$/g, '').trim() ?? ''
    const url = clean(process.env.NUXT_PUBLIC_UMAMI_URL)
    const siteId = clean(process.env.NUXT_PUBLIC_UMAMI_SITE_ID)

    if (!url || !siteId || process.env.NODE_ENV !== 'production') {
        return []
    }

    return [{ src: url, async: true, defer: true, 'data-website-id': siteId }]
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
