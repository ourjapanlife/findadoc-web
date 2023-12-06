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
})
