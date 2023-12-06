import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { Locale } from '~/typedefs/gqlTypes.js'

type LocaleDisplay = {
    displayText: string,
    code: string
}

export const useLocaleStore = defineStore('locale', () => {
    const enUsLocale = localeDisplayOptions.find(o => o.code == Locale.EnUs) as LocaleDisplay
    const locale: Ref<LocaleDisplay> = ref(enUsLocale)

    function setLocale(selectedLocale: Locale) {
        locale.value = localeDisplayOptions.find(l => l.code == selectedLocale) as LocaleDisplay
    }

    return { locale, localeDisplayOptions, mvpLocaleDisplayOptions, setLocale }
})

const localeDisplayOptions = [
    { code: '', displayText: "None"},
    { code: Locale.EnUs, displayText: "English (US)"},
    { code: Locale.JaJp, displayText: "Japanese" },
    { code: Locale.AkGh, displayText: "Akan (Ghana)" },
    { code: Locale.AmEt, displayText: "Amharic (Ethiopia)" },
    { code: Locale.ArAe, displayText: "Arabic (United Arab Emirates)" },
    { code: Locale.BmMl, displayText: "Bambara (Mali)" },
    { code: Locale.BnBd, displayText: "Bengali (Bangladesh)" },
    { code: Locale.BsBa, displayText: "Bosnian (Bosnia and Herzegovina)" },
    { code: Locale.CaEs, displayText: "Catalan (Spain)" },
    { code: Locale.CsCz, displayText: "Czech (Czech Republic)" },
    { code: Locale.ChrUs, displayText: "Cherokee (United States)" },
    { code: Locale.CyGb, displayText: "Welsh (United Kingdom)" },
    { code: Locale.DaDk, displayText: "Danish (Denmark)" },
    { code: Locale.DeDe, displayText: "German (Germany)" },
    { code: Locale.EeGh, displayText: "Ewe (Ghana)" },
    { code: Locale.ElGr, displayText: "Greek (Greece)" },
    { code: Locale.EnUs, displayText: "English (United States)" },
    { code: Locale.EsEs, displayText: "Spanish (Spain)" },
    { code: Locale.EtEe, displayText: "Estonian (Estonia)" },
    { code: Locale.FaAf, displayText: "Persian (Afghanistan)" },
    { code: Locale.FilPh, displayText: "Filipino (Philippines)" },
    { code: Locale.FiFi, displayText: "Finnish (Finland)" },
    { code: Locale.FrFr, displayText: "French (France)" },
    { code: Locale.GuzKe, displayText: "Gusii (Kenya)" },
    { code: Locale.HeIl, displayText: "Hebrew (Israel)" },
    { code: Locale.HiIn, displayText: "Hindi (India)" },
    { code: Locale.HrHr, displayText: "Croatian (Croatia)" },
    { code: Locale.HuHu, displayText: "Hungarian (Hungary)" },
    { code: Locale.HyAm, displayText: "Armenian (Armenia)" },
    { code: Locale.IdId, displayText: "Indonesian (Indonesia)" },
    { code: Locale.IgNg, displayText: "Igbo (Nigeria)" },
    { code: Locale.IsIs, displayText: "Icelandic (Iceland)" },
    { code: Locale.ItIt, displayText: "Italian (Italy)" },
    { code: Locale.KabDz, displayText: "Kabyle (Algeria)" },
    { code: Locale.KmKh, displayText: "Khmer (Cambodia)" },
    { code: Locale.KnIn, displayText: "Kannada (India)" },
    { code: Locale.KoKr, displayText: "Korean (South Korea)" },
    { code: Locale.LagTz, displayText: "Langi (Tanzania)" },
    { code: Locale.LgUg, displayText: "Ganda (Uganda)" },
    { code: Locale.LvLv, displayText: "Latvian (Latvia)" },
    { code: Locale.NbNo, displayText: "Norwegian Bokmål (Norway)" },
    { code: Locale.NeNp, displayText: "Nepali (Nepal)" },
    { code: Locale.NlBe, displayText: "Dutch (Belgium)" },
    { code: Locale.PlPl, displayText: "Polish (Poland)" },
    { code: Locale.PtBr, displayText: "Portuguese (Brazil)" },
    { code: Locale.RuRu, displayText: "Russian (Russia)" },
    { code: Locale.SiLk, displayText: "Sinhala (Sri Lanka)" },
    { code: Locale.SqAl, displayText: "Albanian (Albania)" },
    { code: Locale.SrCyrl, displayText: "Serbian (Cyrillic)" },
    { code: Locale.SwKe, displayText: "Swahili (Kenya)" },
    { code: Locale.ThTh, displayText: "Thai (Thailand)" },
    { code: Locale.TrTr, displayText: "Turkish (Turkey)" },
    { code: Locale.ViVn, displayText: "Vietnamese (Vietnam)" },
    { code: Locale.ZhCn, displayText: "Chinese (Simplified, China)" },
    { code: Locale.ZhHk, displayText: "Chinese (Traditional, Hong Kong SAR China)" },
    { code: Locale.ZhTw, displayText: "Chinese (Traditional, Taiwan)" },
] satisfies LocaleDisplay[]

const mvpLocaleDisplayOptions = [
    { code: '', displayText: "None"},
    { code: Locale.EnUs, displayText: "English (US)"},
    { code: Locale.JaJp, displayText: "Japanese" }
] satisfies LocaleDisplay[]
