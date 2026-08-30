import { defineNuxtConfig } from 'nuxt/config'
import i18nLocales from './i18n'
import tailwindcss from '@tailwindcss/vite'
import { VIEWPORT_BREAKPOINTS, VIEWPORT_FALLBACK_BREAKPOINT } from './utils/viewport'

const SITE_TITLE = 'Find a Doc, Japan!'
const SITE_DESCRIPTION
    = 'Health service information for the international community in Japan'

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
    ssr: false,

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
            titleTemplate: 'Health Services in Japan',
            title: SITE_TITLE,
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
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }],
            script:
            process.env.NUXT_PUBLIC_UMAMI_URL && process.env.NUXT_PUBLIC_UMAMI_SITE_ID && process.env.NODE_ENV === 'production'
                ? [
                    {
                        src: `${process.env.NUXT_PUBLIC_UMAMI_URL}`,
                        async: true,
                        defer: true,
                        'data-website-id': process.env.NUXT_PUBLIC_UMAMI_SITE_ID
                    }
                ]
                : []
        }
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['~/assets/css/tailwind.css'],

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
    sourcemap: {
        client: true
    },
    compatibilityDate: '2025-01-17',

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
