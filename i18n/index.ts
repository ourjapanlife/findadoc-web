/*
    The 'CustomLocale' object is based on our server's 'Locale' type.
    We are extracting only the keys from it. Since our backend uses '_'
    instead of '-' for the language code, we need to create a new type
    to align with the browser and Nuxt language formats.

    We are using Partial because our server's type has more than 40 language codes,
    but we haven't implemented all these languages yet.
*/

import type { LocaleObject } from '@nuxtjs/i18n'
import type { Locale as OriginalLocale } from '~/typedefs/gqlTypes'

type CustomLocale = Record<keyof typeof OriginalLocale, string>

/**
 * The browser's language code uses "-" instead of "_".
 * Once the backend is updated to follow the browser's default locale code format, this will no longer be needed.
 * At that point, we can import the codes directly from `gqlTypes.Locale`.
 */
const Locale = {
    EnUs: 'en-US',
    JaJp: 'ja-JP',
    PtBr: 'pt-BR',
    RuRu: 'ru-RU',
    DeDe: 'de-DE',
    ZhCn: 'zh-CN',
    FrFr: 'fr-FR',
    TlPh: 'tl-PH',
    ViVn: 'vi-VN',
    ItIt: 'it-IT'
} as const satisfies Partial<CustomLocale>

const i18n: LocaleObject[] = [
    {
        code: Locale.EnUs,
        file: 'en.json'
    },
    {
        code: Locale.JaJp,
        file: 'ja.json'
    },
    {
        code: Locale.PtBr,
        file: 'pt.json'
    },
    {
        code: Locale.RuRu,
        file: 'ru.json'
    },
    {
        code: Locale.DeDe,
        file: 'de.json'
    },
    {
        code: Locale.ZhCn,
        file: 'cn.json'
    },
    {
        code: Locale.FrFr,
        file: 'fr.json'
    },
    {
        code: Locale.TlPh,
        file: 'tl.json'
    },
    {
        code: Locale.ViVn,
        file: 'vi.json'
    },
    {
        code: Locale.ItIt,
        file: 'it.json'
    }
]

export default i18n

