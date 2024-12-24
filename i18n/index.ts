/*
    The 'CustomLocale' object is based on our server's 'Locale' type.
    We are extracting only the keys from it. Since our backend uses '_'
    instead of '-' for the language code, we need to create a new type
    to align with the browser and Nuxt language formats.

    We are using Partial because our server's type has more than 40 language codes,
    but we haven't implemented all these languages yet.
*/

type CustomLocale = {
    [key in keyof typeof import('~/typedefs/gqlTypes').Locale]: string
}

// HACK: Browser's code language is using "-" instead of "_".
const Locale: Partial<CustomLocale> = {
    EnUs: 'en-US',
    JaJp: 'ja-JP',
    PtBr: 'pt-BR',
    RuRu: 'ru-RU',
    DeDe: 'de-DE',
    ZhCn: 'zh-CN',
    FrFr: 'fr-FR',
    TlPh: 'tl-PH'
}

const i18n = [
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
    }
]

export default i18n

