import { defineNuxtConfig } from 'nuxt/config'
import i18nLocales from './i18n'
import tailwindcss from '@tailwindcss/vite'
import { VIEWPORT_BREAKPOINTS, VIEWPORT_FALLBACK_BREAKPOINT } from './utils/viewport'
import { publicSitemapUrls, SITEMAP_EXCLUDE } from './utils/sitemap'
import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_SOCIAL_IMAGE, SITE_TITLE } from './utils/site'
import { COLOR_SCHEME_BOOTSTRAP, umamiScript } from './utils/nuxt/appHead'
import {
    applyEntityDirectoryToNitro,
    applyEntityDirectoryToNuxt,
    entityDirectoryVitePlugins
} from './utils/nuxt/entityDirectoryGenerate'

export default defineNuxtConfig({

    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
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
            // Descriptive titles come from PAGE_META_TITLE_ROUTES via app.vue, which also
            // wraps them with the brand. Untitled routes fall back to the brand alone.
            title: 'Health services in Japan',
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
                    content: 'summary_large_image'
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
                    content: SITE_SOCIAL_IMAGE
                },
                {
                    name: 'twitter:image:alt',
                    content: SITE_TITLE
                },
                {
                    property: 'og:type',
                    content: 'website'
                },
                {
                    property: 'og:site_name',
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
                    content: SITE_SOCIAL_IMAGE
                },
                {
                    property: 'og:image:secure_url',
                    content: SITE_SOCIAL_IMAGE
                },
                {
                    property: 'og:image:alt',
                    content: SITE_TITLE
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
    site: {
        url: SITE_ORIGIN,
        name: SITE_TITLE
    },

    runtimeConfig: {
        // Filled during `nuxi generate` so clinic and doctor pages prerender from memory.
        // Private: not sent to the browser. Empty in `nuxi dev` (live GraphQL).
        clinicPrerenderDirectory: {},
        doctorPrerenderDirectory: {},
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
         * Clinic URLs (`/clinic/…`, #1789), doctor URLs (`/doctor/…`, #1790), and
         * geography hubs (`/tokyo`, #1791) are the indexable directory pages; they
         * are listed for generate in the nitro:config hook, not here, so unknown
         * IDs and locations stay a real 404.
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
            // Clinic, doctor, and hub HTML is filled from the generate-time directory
            // cache, not live facility(id)/healthcareProfessional(id) calls. Parallel
            // prerender is then just disk, not API.
            concurrency: 8,
            routes: ['/', '/about', '/terms', '/privacypolicy', '/submit', '/npo', '/sitemap.xml']
        }
    },

    vite: { plugins: [
        tailwindcss(),
        ...entityDirectoryVitePlugins()
    ] },
    telemetry: false,

    hooks: {
        async ready(nuxt) {
            await applyEntityDirectoryToNuxt(nuxt)
        },
        async 'nitro:config'(nitroConfig) {
            await applyEntityDirectoryToNitro(nitroConfig)
        }
    },
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
    sitemap: {
        // One loc per public page until #1796 adds locale prefixes. Clinic,
        // doctor, and geography hub URLs join via /api/__sitemap__/directory.
        autoI18n: false,
        excludeAppSources: true,
        exclude: [...SITEMAP_EXCLUDE],
        urls: publicSitemapUrls(),
        sources: ['/api/__sitemap__/directory'],
        // Google's per-file cap. A sitemap index is unnecessary until locale × entity
        // URLs cross this; keep /sitemap.xml stable for robots.txt until then.
        defaultSitemapsChunkSize: 50000,
        discoverImages: false,
        discoverVideos: false
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
