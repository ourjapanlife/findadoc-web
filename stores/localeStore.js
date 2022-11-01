import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
    state: () => ({
        locale: { lable: 'English', code: 'en' }
    }),
    getters: {
        currentLocale: state => state.locale
    },
    actions: {
        changeLocale() {
            if (this.currentLocale.code === 'en') {
                this.locale.lable = '日本語'
                this.locale.code = 'ja'
            } else {
                this.locale.lable = 'English'
                this.locale.lable = 'en'
            }
        }
    }
})
