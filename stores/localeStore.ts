import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { Locale } from '~/typedefs/gqlTypes.js'

export type LocaleDisplay = {
    displayText: string
    simpleText: string
    code: string
}

export const useLocaleStore = defineStore('locale', () => {
    const enUsLocale = localeDisplayOptions.find(currentLocale => currentLocale.code === Locale.EnUs) as LocaleDisplay
    const locale: Ref<LocaleDisplay> = ref(enUsLocale)

    function setLocale(selectedLocale: Locale) {
        locale.value = localeDisplayOptions.find(currentLocale => currentLocale.code === selectedLocale) as LocaleDisplay
    }

    function formatLanguageCodeToSimpleText(selectedLocale: string) {
        const language = localeDisplayOptions.find(currentLocale => currentLocale.code === selectedLocale)
        return language?.simpleText || 'Language not found'
    }

    function formatLanguages(
        spokenLanguages: Locale[], localeDisplayOptions: { code: string, simpleText: string }[]
    ) {
        return spokenLanguages?.map(languageCode =>
            localeDisplayOptions.find(option =>
                option.code === languageCode)?.simpleText || 'Not Specified')
              ?? []
    }

    // Takes the input value and searches all locale display options to return the locale code
    function getLocaleByNameInput(inputValue: string) {
        const lowercasedInput = inputValue.toLowerCase()
        const filteredLocales = localeDisplayOptions
            .filter(localeDisplay =>
                localeDisplay.code.toLowerCase().replace('_', '').includes(lowercasedInput)
                || localeDisplay.simpleText.toLowerCase().includes(lowercasedInput)
                || localeDisplay.displayText.toLowerCase().replace('(', '').replace(')', '').includes(lowercasedInput))
            .map(filteredLocale => filteredLocale.code as Locale)
        return filteredLocales
    }

    return {
        locale,
        localeDisplayOptions,
        mvpLocaleDisplayOptions,
        setLocale,
        formatLanguages,
        formatLanguageCodeToSimpleText,
        getLocaleByNameInput
    }
})

export const localeDisplayOptions = [
    { code: '', simpleText: '', displayText: 'None' },
    { code: Locale.EnUs, simpleText: 'English', displayText: 'English (US)' },
    { code: Locale.JaJp, simpleText: '日本語', displayText: '日本語 (Japan)' },
    { code: Locale.AkGh, simpleText: 'Akan', displayText: 'Akan (Ghana)' },
    { code: Locale.AmEt, simpleText: 'Amharic', displayText: 'Amharic (Ethiopia)' },
    { code: Locale.ArAe, simpleText: 'اَلْعَرَبِيَّة', displayText: 'اَلْعَرَبِيَّة (United Arab Emirates)' },
    { code: Locale.BmMl, simpleText: 'Bambara', displayText: 'Bambara (Mali)' },
    { code: Locale.BnBd, simpleText: 'Bengali', displayText: 'Bengali (Bangladesh)' },
    { code: Locale.BsBa, simpleText: 'Bosnian', displayText: 'Bosnian (Bosnia and Herzegovina)' },
    { code: Locale.CaEs, simpleText: 'Catalan', displayText: 'Catalan (Spain)' },
    { code: Locale.CsCz, simpleText: 'Czech', displayText: 'Czech (Czech Republic)' },
    { code: Locale.ChrUs, simpleText: 'Cherokee', displayText: 'Cherokee (United States)' },
    { code: Locale.CyGb, simpleText: 'Welsh', displayText: 'Welsh (United Kingdom)' },
    { code: Locale.DaDk, simpleText: 'Danish', displayText: 'Danish (Denmark)' },
    { code: Locale.DeDe, simpleText: 'German', displayText: 'German (Germany)' },
    { code: Locale.EeGh, simpleText: 'Ewe', displayText: 'Ewe (Ghana)' },
    { code: Locale.ElGr, simpleText: 'Greek', displayText: 'Greek (Greece)' },
    { code: Locale.EsEs, simpleText: 'Spanish', displayText: 'Spanish (Spain)' },
    { code: Locale.EtEe, simpleText: 'Estonian', displayText: 'Estonian (Estonia)' },
    { code: Locale.FaAf, simpleText: 'Persian', displayText: 'Persian (Afghanistan)' },
    { code: Locale.TlPh, simpleText: 'Tagalog', displayText: 'Tagalog (Philippines)' },
    { code: Locale.FiFi, simpleText: 'Finnish', displayText: 'Finnish (Finland)' },
    { code: Locale.FrFr, simpleText: 'French', displayText: 'French (France)' },
    { code: Locale.GuzKe, simpleText: 'Gusii', displayText: 'Gusii (Kenya)' },
    { code: Locale.HeIl, simpleText: 'עִבְרִית', displayText: 'עִבְרִית (Israel)' },
    { code: Locale.HiIn, simpleText: 'Hindi', displayText: 'Hindi (India)' },
    { code: Locale.HrHr, simpleText: 'Croatian', displayText: 'Croatian (Croatia)' },
    { code: Locale.HuHu, simpleText: 'Hungarian', displayText: 'Hungarian (Hungary)' },
    { code: Locale.HyAm, simpleText: 'Armenian', displayText: 'Armenian (Armenia)' },
    { code: Locale.IdId, simpleText: 'Indonesian', displayText: 'Indonesian (Indonesia)' },
    { code: Locale.IgNg, simpleText: 'Igbo', displayText: 'Igbo (Nigeria)' },
    { code: Locale.IsIs, simpleText: 'Icelandic', displayText: 'Icelandic (Iceland)' },
    { code: Locale.ItIt, simpleText: 'Italiano', displayText: 'Italiano (Italy)' },
    { code: Locale.KabDz, simpleText: 'Kabyle', displayText: 'Kabyle (Algeria)' },
    { code: Locale.KmKh, simpleText: 'Khmer', displayText: 'Khmer (Cambodia)' },
    { code: Locale.KnIn, simpleText: 'Kannada', displayText: 'Kannada (India)' },
    { code: Locale.KoKr, simpleText: '한국어', displayText: '한국어 (South Korea)' },
    { code: Locale.LagTz, simpleText: 'Langi', displayText: 'Langi (Tanzania)' },
    { code: Locale.LgUg, simpleText: 'Ganda', displayText: 'Ganda (Uganda)' },
    { code: Locale.LvLv, simpleText: 'Latvian', displayText: 'Latvian (Latvia)' },
    { code: Locale.NbNo, simpleText: 'Norwegian', displayText: 'Norwegian Bokmål (Norway)' },
    { code: Locale.NeNp, simpleText: 'Nepali', displayText: 'Nepali (Nepal)' },
    { code: Locale.NlBe, simpleText: 'Dutch', displayText: 'Dutch (Belgium)' },
    { code: Locale.PlPl, simpleText: 'Polish', displayText: 'Polish (Poland)' },
    { code: Locale.PtBr, simpleText: 'Português', displayText: 'Português (Brasil)' },
    { code: Locale.RuRu, simpleText: 'русский', displayText: 'Russian (Russia)' },
    { code: Locale.SiLk, simpleText: 'Sinhala', displayText: 'Sinhala (Sri Lanka)' },
    { code: Locale.SqAl, simpleText: 'Albanian', displayText: 'Albanian (Albania)' },
    { code: Locale.SrCyrl, simpleText: 'Serbian', displayText: 'Serbian (Cyrillic)' },
    { code: Locale.SwKe, simpleText: 'Swahili', displayText: 'Swahili (Kenya)' },
    { code: Locale.ThTh, simpleText: 'ภาษาไทย', displayText: 'ภาษาไทย (Thailand)' },
    { code: Locale.TrTr, simpleText: 'Turkish', displayText: 'Turkish (Turkey)' },
    { code: Locale.ViVn, simpleText: 'tiếng', displayText: 'tiếng Việt (Vietnam)' },
    { code: Locale.ZhCn, simpleText: '汉语', displayText: 'Chinese (Simplified, China)' },
    { code: Locale.ZhHk, simpleText: '漢語', displayText: 'Chinese (Traditional, Hong Kong SAR China)' },
    { code: Locale.ZhTw, simpleText: '國語', displayText: 'Chinese (Traditional, Taiwan)' }
] satisfies LocaleDisplay[]

export const mvpLocaleDisplayOptions = [
    { code: Locale.EnUs, simpleText: 'English', displayText: 'English (US)' },
    { code: Locale.JaJp, simpleText: '日本語', displayText: '日本語 (Japan)' },
    { code: Locale.PtBr, simpleText: 'Português', displayText: 'Português (Brasil)' },
    { code: Locale.RuRu, simpleText: 'русский', displayText: 'Russian (Russia)' },
    { code: Locale.DeDe, simpleText: 'Deutsch', displayText: 'Deutsch(Deutschland)' },
    { code: Locale.ZhCn, simpleText: '简体中文', displayText: 'Chinese (Simplified, China)' },
    { code: Locale.FrFr, simpleText: 'Français', displayText: 'Français (France)' },
    { code: Locale.TlPh, simpleText: 'Tagalog', displayText: 'Tagalog (Philippines)' },
    { code: Locale.ViVn, simpleText: 'tiếng', displayText: 'tiếng Việt (Vietnam)' },
    { code: Locale.ItIt, simpleText: 'Italiano', displayText: 'Italiano (Italy)' }
] satisfies LocaleDisplay[]

export const listPrefectureJapanEn: Ref<string[]> = ref([
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
])

export const listPrefectureJapanJa: Ref<string[]> = ref([
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
])
