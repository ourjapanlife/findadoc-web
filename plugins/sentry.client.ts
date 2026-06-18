import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app'

export default defineNuxtPlugin(nuxtApp => {
    const sentryConfig = useRuntimeConfig().public.sentry as {
        dsn?: string
        environment?: string
        tracesSampleRate?: string
    }

    if (!sentryConfig.dsn) {
        // eslint-disable-next-line no-console
        console.log('🛰️ Sentry DSN not set — skipping Sentry initialization')
        return
    }

    const parsedSampleRate = sentryConfig.tracesSampleRate
        ? Number(sentryConfig.tracesSampleRate)
        : NaN
    const tracesSampleRate = Number.isFinite(parsedSampleRate)
        ? parsedSampleRate
        : (import.meta.dev ? 1.0 : 0.1)

    Sentry.init({
        app: nuxtApp.vueApp,
        dsn: sentryConfig.dsn,
        environment: sentryConfig.environment
          ?? (import.meta.dev ? 'development' : 'production'),
        integrations: [
            Sentry.browserTracingIntegration({ router: useRouter() })
        ],
        tracesSampleRate,
        sendDefaultPii: false
    })
    // eslint-disable-next-line no-console
    console.log('🛰️ Sentry initialized')
})
