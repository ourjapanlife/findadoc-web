import { setActivePinia, createPinia } from 'pinia'
import { useLocaleStore } from '@/stores/localeStore'
import { Locale } from '~/typedefs/gqlTypes.js'
import { expect } from 'chai'

describe("LocalStore", () => {

    beforeEach(() => {
        setActivePinia(createPinia())
    });

    it('should initialize with default values', () => {
        const localStore = useLocaleStore()

        expect(localStore.locale.code).to.equal(Locale.EnUs)
        expect(localStore.locale.simpleText).to.equal('English')
        expect(localStore.locale.displayText).to.equal('English (US)')
    })

    it('should update locale when new locale is passed in setLocale', () => {
        const localStore = useLocaleStore()
        localStore.setLocale(Locale.JaJp)

        expect(localStore.locale.code).to.equal(Locale.JaJp)
        expect(localStore.locale.simpleText).to.equal('日本語')
        expect(localStore.locale.displayText).to.equal('日本語 (Japan)')
    })
})