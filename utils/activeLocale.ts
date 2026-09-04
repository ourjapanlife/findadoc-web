import { Locale } from '~/typedefs/gqlTypes'

/*
 * vue-i18n and the API disagree about locale codes: i18n uses "ja-JP", the gql `Locale` enum
 * uses "ja_JP". They also disagree about *when* they know the answer — `localeStore.activeLocale`
 * only updates when someone uses the language picker, so on a direct load carrying the
 * `i18n_redirected` cookie the page renders Japanese while the store still says en-US.
 *
 * Anything choosing between Japanese and English content must therefore key off vue-i18n's
 * active locale, not the store.
 */

const GQL_LOCALES = new Set<string>(Object.values(Locale))

/** Maps vue-i18n's active locale onto the gql `Locale` enum, falling back to English. */
export function toGqlLocale(i18nLocale: string): Locale {
    const candidate = i18nLocale.replace('-', '_')
    return GQL_LOCALES.has(candidate) ? candidate as Locale : Locale.EnUs
}

export function isJapaneseLocale(i18nLocale: string): boolean {
    return toGqlLocale(i18nLocale) === Locale.JaJp
}
