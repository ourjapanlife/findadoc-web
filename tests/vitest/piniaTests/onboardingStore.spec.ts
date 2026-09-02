import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { OnboardingState, useOnboardingStore } from '@/stores/onboardingStore'

describe('onboardingStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('defaults to not-started when storage is empty', () => {
        const store = useOnboardingStore()
        expect(store.onboardingState).to.equal(OnboardingState.NotStarted)
    })

    it('hydrates a completed visit from localStorage', () => {
        localStorage.setItem('onboardingState', JSON.stringify(OnboardingState.Completed))
        const store = useOnboardingStore()
        store.hydrateFromStorage()
        expect(store.onboardingState).to.equal(OnboardingState.Completed)
    })

    it('persists completion to localStorage', () => {
        const store = useOnboardingStore()
        store.setOnboardingState(OnboardingState.Completed)
        expect(JSON.parse(localStorage.getItem('onboardingState') || '')).to.equal(OnboardingState.Completed)
    })
})
