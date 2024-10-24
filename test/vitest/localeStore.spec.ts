import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { useLocaleStore } from '@/stores/localeStore'
import { Locale } from '~/typedefs/gqlTypes.js'

describe('LocalStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with default values', () => {
        const localeStore = useLocaleStore()

        expect(localeStore.locale.code).to.equal(Locale.EnUs)
        expect(localeStore.locale.simpleText).to.equal('English')
        expect(localeStore.locale.displayText).to.equal('English (US)')
    })

    it('should update locale when new locale is passed in setLocale', () => {
        const localeStore = useLocaleStore()
        localeStore.setLocale(Locale.JaJp)

        expect(localeStore.locale.code).to.equal(Locale.JaJp)
        expect(localeStore.locale.simpleText).to.equal('日本語')
        expect(localeStore.locale.displayText).to.equal('日本語 (Japan)')
    })

    it('should return formatted language text when spokenLanguages are provided', () => {
        const localeStore = useLocaleStore()
        const spokenLanguages = [Locale.EnUs, Locale.JaJp]
        const localeDisplayOptions = [
            { code: Locale.EnUs, simpleText: 'English' },
            { code: Locale.JaJp, simpleText: '日本語' }
        ]

        const result = localeStore.formatLanguages(spokenLanguages, localeDisplayOptions)

        expect(result).to.deep.equal(['English', '日本語'])
    })

    it('should return an empty array when no spokenLanguages are provided', () => {
        const localeStore = useLocaleStore()
        const spokenLanguages: Locale[] = []
        const localeDisplayOptions = [
            { code: Locale.EnUs, simpleText: 'English' },
            { code: Locale.JaJp, simpleText: '日本語' }
        ]

        const result = localeStore.formatLanguages(spokenLanguages, localeDisplayOptions)

        expect(result).to.deep.equal([])
    })

    it('should return "Not Specified" for unrecognized language codes', () => {
        const localeStore = useLocaleStore()
        const spokenLanguages = ['unrecognized' as Locale]
        const localeDisplayOptions = [
            { code: Locale.EnUs, simpleText: 'English' },
            { code: Locale.JaJp, simpleText: '日本語' }
        ]

        const result = localeStore.formatLanguages(spokenLanguages, localeDisplayOptions)

        expect(result).to.deep.equal(['Not Specified'])
    })
})
