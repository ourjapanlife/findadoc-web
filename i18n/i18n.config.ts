import { defineI18nConfig } from '#imports'

/**
 * Message-level fallback.
 *
 * `detectBrowserLanguage.fallbackLocale` in nuxt.config only decides which locale to
 * *select* for a visitor; it has no bearing on a key that is missing from the locale
 * that was selected. Without the fallback below, a key present in en.json but not yet
 * translated renders as its own path — "home.heroHeading" — on the page.
 */
export default defineI18nConfig(() => ({
    fallbackLocale: 'en-US',
    // Fallback quietly. A missing key is a translation task, not a console error.
    silentFallbackWarn: true
}))
