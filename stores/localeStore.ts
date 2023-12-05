import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { Locale } from '~/typedefs/gqlTypes.js'

type LocaleDisplay = {
    label: string,
    code: string
}

const localeDisplayEn: { label: string, code: string } = {
    label: 'English',
    code: Locale.EnUs
} satisfies LocaleDisplay

const localeDisplayJa: { label: string, code: string } = {
    label: '日本語',
    code: Locale.JaJp
} satisfies LocaleDisplay

export const useLocaleStore = defineStore('locale', () => {
    const locale: Ref<LocaleDisplay> = ref(localeDisplayEn)

    function changeLocale() {
        if (locale.value.code === Locale.EnUs)
            locale.value = localeDisplayEn
        else
            locale.value = localeDisplayJa
    }

    return { locale, changeLocale }
    
    
    import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('localeStore', () => {
    const locales = ref([
        {"none": "None"},
        { "en_US": "English (US)"},
        { "ja_JP": "Japanese" },
        { "ak_GH": "Akan (Ghana)" },
        { "am_ET": "Amharic (Ethiopia)" },
        { "ar_AE": "Arabic (United Arab Emirates)" },
        { "bm_ML": "Bambara (Mali)" },
        { "bn_BD": "Bengali (Bangladesh)" },
        { "bs_BA": "Bosnian (Bosnia and Herzegovina)" },
        { "ca_ES": "Catalan (Spain)" },
        { "cs_CZ": "Czech (Czech Republic)" },
        { "chr_US": "Cherokee (United States)" },
        { "cy_GB": "Welsh (United Kingdom)" },
        { "da_DK": "Danish (Denmark)" },
        { "de_DE": "German (Germany)" },
        { "ee_GH": "Ewe (Ghana)" },
        { "el_GR": "Greek (Greece)" },
        { "en_US": "English (United States)" },
        { "es_ES": "Spanish (Spain)" },
        { "et_EE": "Estonian (Estonia)" },
        { "fa_AF": "Persian (Afghanistan)" },
        { "fil_PH": "Filipino (Philippines)" },
        { "fi_FI": "Finnish (Finland)" },
        { "fr_FR": "French (France)" },
        { "guz_KE": "Gusii (Kenya)" },
        { "he_IL": "Hebrew (Israel)" },
        { "hi_IN": "Hindi (India)" },
        { "hr_HR": "Croatian (Croatia)" },
        { "hu_HU": "Hungarian (Hungary)" },
        { "hy_AM": "Armenian (Armenia)" },
        { "id_ID": "Indonesian (Indonesia)" },
        { "ig_NG": "Igbo (Nigeria)" },
        { "is_IS": "Icelandic (Iceland)" },
        { "it_IT": "Italian (Italy)" },
        { "kab_DZ": "Kabyle (Algeria)" },
        { "km_KH": "Khmer (Cambodia)" },
        { "kn_IN": "Kannada (India)" },
        { "ko_KR": "Korean (South Korea)" },
        { "lag_TZ": "Langi (Tanzania)" },
        { "lg_UG": "Ganda (Uganda)" },
        { "lv_LV": "Latvian (Latvia)" },
        { "nb_NO": "Norwegian Bokmål (Norway)" },
        { "ne_NP": "Nepali (Nepal)" },
        { "nl_BE": "Dutch (Belgium)" },
        { "pl_PL": "Polish (Poland)" },
        { "pt_BR": "Portuguese (Brazil)" },
        { "ru_RU": "Russian (Russia)" },
        { "si_LK": "Sinhala (Sri Lanka)" },
        { "sq_AL": "Albanian (Albania)" },
        { "sr_Cyrl": "Serbian (Cyrillic)" },
        { "sw_KE": "Swahili (Kenya)" },
        { "th_TH": "Thai (Thailand)" },
        { "tr_TR": "Turkish (Turkey)" },
        { "vi_VN": "Vietnamese (Vietnam)" },
        { "zh_CN": "Chinese (Simplified, China)" },
        { "zh_HK": "Chinese (Traditional, Hong Kong SAR China)" },
        { "zh_TW": "Chinese (Traditional, Taiwan)" },
    ])
    return { locales }
})
