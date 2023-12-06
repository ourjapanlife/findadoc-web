import { defineStore } from 'pinia'

export const useStore = defineStore('navigationStore', {
    state: () => ({ language: 'en-us', display: 'English' }),
    getters: {
        current: state => state.language,
        displayText: state => state.display
    },
    actions: {
        switchLanguage() {
            if (this.language === 'en-us') {
                this.language = 'ja-jp'
                this.display = '日本語'
            } else {
                this.language = 'en-us'
                this.display = 'English'
            }
        }
    }
})
