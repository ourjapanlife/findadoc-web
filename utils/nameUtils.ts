import { Locale, type LocalizedName } from '~/typedefs/gqlTypes.js'

export const formatHealthcareProfessionalName = (
    names: LocalizedName[] | undefined,
    preferredLocale: Locale
): string => {
    if (!names?.length) return ''

    const englishName = names.find(n => n.locale === Locale.EnUs)
    const japaneseName = names.find(n => n.locale === Locale.JaJp)

    const englishFullName = englishName?.firstName && englishName?.lastName
        ? `${englishName.firstName} ${englishName.lastName}`
        : null
    const japaneseFullName = japaneseName?.firstName && japaneseName?.lastName
        ? `${japaneseName.lastName} ${japaneseName.firstName}`
        : null

    switch (preferredLocale) {
        case Locale.EnUs:
            return englishFullName || japaneseFullName || ''
        case Locale.JaJp:
            return japaneseFullName || englishFullName || ''
        default:
            return englishFullName || japaneseFullName || ''
    }
} 