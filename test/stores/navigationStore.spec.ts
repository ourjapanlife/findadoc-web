import { setActivePinia, createPinia } from 'pinia'
import { useStore } from '@/stores/navigationStore.js'
import { expect } from 'vitest'

describe('Navigation Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('is English by default', () => {
        const store = useStore()

        expect(store.current).toBe('en-us')
        expect(store.display).toBe('English')
    })

    it('allows to switch between English and Japanese', () => {
        const store = useStore()

        expect(store.current).toBe('en-us')
        expect(store.display).toBe('English')
        store.switchLanguage()
        expect(store.current).toBe('ja-jp')
        expect(store.display).toBe('日本語')
        store.switchLanguage()
        expect(store.current).toBe('en-us')
        expect(store.display).toBe('English')
    })
})
