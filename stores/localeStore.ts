import { defineStore } from 'pinia'

const localeEn:{label: string, code: string} = {
    label: 'English',
    code: 'en'
}
const localeJa:{label: string, code: string} = {
    label: '日本語',
    code: 'ja'
}

export const useLocaleStore = defineStore('locale', {
    state: () => ({
        locale: localeEn
    }),
    getters: {
        currentLocale: state => state.locale
    },
    actions: {
        changeLocale() {
            if (this.currentLocale.code === 'en')
                this.locale = localeEn
            else
                this.locale = localeJa
        }
    }
})
