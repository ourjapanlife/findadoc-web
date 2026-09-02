import { defineStore, skipHydrate } from 'pinia'
import { ref } from 'vue'

const ONBOARDING_STORAGE_KEY = 'onboardingState'

export enum OnboardingState {
    Completed = 'completed',
    NotStarted = 'not-started'
}

function readStoredState(): OnboardingState | null {
    if (!import.meta.client)
        return null

    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (!stored)
        return null

    try {
        const parsed = JSON.parse(stored) as OnboardingState
        if (parsed === OnboardingState.Completed || parsed === OnboardingState.NotStarted)
            return parsed
    } catch {
        // ignore corrupt storage
    }

    return null
}

export const useOnboardingStore = defineStore('onboarding', () => {
    // localStorage is the source of truth. Skip Pinia payload hydration so a
    // server-rendered "not-started" value cannot overwrite a completed visit.
    const onboardingState = skipHydrate(ref(OnboardingState.NotStarted))

    function hydrateFromStorage() {
        const stored = readStoredState()
        if (stored)
            onboardingState.value = stored
    }

    function setOnboardingState(value: OnboardingState) {
        onboardingState.value = value

        if (import.meta.client)
            localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value))
    }

    hydrateFromStorage()

    return { onboardingState, setOnboardingState, hydrateFromStorage }
})
