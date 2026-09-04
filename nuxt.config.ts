import { defineNuxtConfig } from 'nuxt/config'
import i18nLocales from './i18n'
import tailwindcss from '@tailwindcss/vite'
import { VIEWPORT_BREAKPOINTS, VIEWPORT_FALLBACK_BREAKPOINT } from './utils/viewport'

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
function umamiScript() {
    const clean = (value?: string) => value?.replace(/^["']|["']$/g, '').trim() ?? ''
    const url = clean(process.env.NUXT_PUBLIC_UMAMI_URL)
    const siteId = clean(process.env.NUXT_PUBLIC_UMAMI_SITE_ID)

    if (!url || !siteId || process.env.NODE_ENV !== 'production') {
        return []
    }

    return [{ src: url, async: true, defer: true, 'data-website-id': siteId }]
}

const SITE_TITLE = 'Find a Doc, Japan'
const SITE_DESCRIPTION
    = 'Health service information for the international community in Japan'

/**
 * Applies the stored colour scheme before first paint.
 *
 * Runs inline in <head> so a returning dark-mode visitor never sees a light flash on a
 * prerendered page. Mirrors the migration in composables/useColorScheme.ts: only an explicit
 * dark choice survives from the old five-colourway picker. Anything else means "auto", which
 * is no class at all — the stylesheet then follows prefers-color-scheme.
 */
const COLOR_SCHEME_BOOTSTRAP = `(function () {
  try {
    var s = localStorage.getItem('colorScheme')
    if (s !== 'dark' && s !== 'light') s = localStorage.getItem('isDarkMode') === 'true' ? 'dark' : ''
    if (s) document.documentElement.classList.add('theme-' + s)
  } catch (e) {}
})()`

export default defineNuxtConfig({

    modules: [
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'nuxt-viewport',
        'nuxt-svgo',
        '@nuxt/eslint',
        '@nuxt/test-utils/module',
        'nuxt-gtag',
        '@nuxtjs/storybook'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],
    ssr: true,

    // Auto import components: https://nuxt.com/docs/guide/directory-structure/components#component-names
    components: [
        {
            path: '~/components',
            pathPrefix: false
        }
    ],
    app: {
    // Global page headers: https://nuxt.com/docs/getting-started/seo-meta
        head: {
            // Pages set their own title with useHead(); the brand is appended here.
            titleTemplate: `%s · ${SITE_TITLE}`,
            title: 'Health services in Japan, in your language',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                {
                    name: 'google-site-verification',
                    content: '-iHcqQwxR-wiZU6Y4BKtcn79tUZJAcyWXJt7w7iobpY'
                },
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: SITE_DESCRIPTION },
                { name: 'color-scheme', content: 'light dark' },
                { name: 'theme-color', content: '#F7FAFB', media: '(prefers-color-scheme: light)' },
                { name: 'theme-color', content: '#101617', media: '(prefers-color-scheme: dark)' },
                { name: 'format-detection', content: 'telephone=no' },
                {
                    name: 'twitter:card',
                    content: 'summary'
                },
                {
                    name: 'twitter:title',
                    content: SITE_TITLE
                },
                {
                    name: 'twitter:description',
                    content: SITE_DESCRIPTION
                },
                {
                    name: 'twitter:image',
                    content: 'https://www.findadoc.jp/findadoc-social.png'
                },
                {
                    name: 'twitter:image:alt',
                    content: SITE_TITLE
                },
                {
                    property: 'og:title',
                    content: SITE_TITLE
                },
                {
                    property: 'og:description',
                    content: SITE_DESCRIPTION
                },
                {
                    property: 'og:image',
                    content: 'https://www.findadoc.jp/findadoc-social.png'
                },
                {
                    property: 'og:image:secure_url',
                    content: 'https://www.findadoc.jp/findadoc-social.png'
                },
                {
                    property: 'og:image:alt',
                    content: SITE_TITLE
                },
                {
                    property: 'og:url',
                    content: 'https://www.findadoc.jp'
                }
            ],
            link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
            script: [
                { innerHTML: COLOR_SCHEME_BOOTSTRAP, tagPosition: 'head' },
                ...umamiScript()
            ]
        }
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        /*
         * Both brand families are self-hosted, subsetted woff2 from @fontsource. Each file
         * declares one @font-face per unicode-range subset, so a Latin-only visitor fetches
         * ~15 KB per weight of Noto Sans and never downloads the ~1 MB CJK chunk of Noto Sans JP.
         * This replaced 8.3 MB of unsubsetted TTFs that were declared but never actually used.
         */
        '@fontsource/noto-sans/400.css',
        // 500 is loaded because `font-medium` is used across the nav and cards; without the
        // face the browser silently substitutes 400 and the weight has no effect.
        '@fontsource/noto-sans/500.css',
        '@fontsource/noto-sans/600.css',
        '@fontsource/noto-sans/700.css',
        '@fontsource/noto-sans-jp/400.css',
        '@fontsource/noto-sans-jp/700.css',
        '~/assets/css/tailwind.css'
    ],

    runtimeConfig: {
        public: {
            isTestingMode: process.env.NUXT_IS_TESTING_MODE,

            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

            NUXT_PUBLIC_LOAD_STORES: process.env.NUXT_PUBLIC_LOAD_STORES,

            NUXT_USE_LOCAL_API: process.env.NUXT_USE_LOCAL_API,

            sentry: {
                dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
                environment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
                tracesSampleRate: process.env.NUXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
            }
        }
    },

    // Public directory pages are prerendered (keeps the static Netlify generate model).
    // Authenticated surfaces stay SPA. ISR would need a server runtime — see #1787.
    // Non-prerendered app routes (e.g. /u/*) are SPA-rewritten in public/_redirects — see #1785.
    routeRules: {
        '/': { prerender: true },
        '/about': { prerender: true },
        '/terms': { prerender: true },
        '/privacypolicy': { prerender: true },
        '/submit': { prerender: true },
        '/npo': { prerender: true },
        /*
         * /search reads its filters from the query string and loads the directory from the
         * API in the browser, so there is nothing to prerender: a static shell would ship an
         * empty result list under a real heading, which is worse for crawlers than no page.
         * The homepage carries the indexable content instead.
         *
         * This becomes worth revisiting once the server can filter by location (handoff §2a):
         * a single filtered query is cheap enough to run server-side, at which point results
         * could be rendered into the HTML and the per-facility URLs the SEO tickets want
         * (?facility=… already identifies one) could become real, indexable pages.
         */
        '/search': { ssr: false },
        '/login': { ssr: false },
        '/my-page': { ssr: false },
        '/my-page/**': { ssr: false }
    },
    sourcemap: {
        client: true
    },
    compatibilityDate: '2025-01-17',

    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/', '/about', '/terms', '/privacypolicy', '/submit', '/npo']
        }
    },

    vite: { plugins: [
        tailwindcss()
    ] },
    telemetry: false,
    eslint: {
        config: {
            stylistic: true
        }
    },

    // Google analytics configuration
    gtag: {
        enabled: process.env.NODE_ENV === 'production' && process.env.ENABLE_GOOGLE_ANALYTICS === 'true',
        id: 'G-T0RE9B3PRG'
    },

    i18n: {
        strategy: 'no_prefix',
        locales: i18nLocales,
        defaultLocale: 'en-US',
        langDir: 'locales',
        vueI18n: './i18n.config.ts',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            fallbackLocale: 'en-US',
            alwaysRedirect: true
        }
    },

    storybook: {
        host: 'http://localhost',
        port: 6006,
        enabled: !!process.env.NUXT_STORYBOOK
    },

    svgo: {
        defaultImport: 'component'
    },
    viewport: {
        breakpoints: { ...VIEWPORT_BREAKPOINTS },

        cookie: {
            name: 'viewport'
        },

        defaultBreakpoints: {
            desktop: 'desktop',
            mobile: 'mobile',
            tablet: 'tablet'
        },

        fallbackBreakpoint: VIEWPORT_FALLBACK_BREAKPOINT
    }
})
