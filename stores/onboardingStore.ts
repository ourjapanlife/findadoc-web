import { defineStore } from 'pinia'
import { ref } from 'vue'

const ONBOARDING_STORAGE_KEY = 'onboardingState'

export enum OnboardingState {
    Completed = 'completed',
    NotStarted = 'not-started'
}

export const useOnboardingStore = defineStore('onboarding', () => {
    // State
    const onboardingState = ref(getInitialState())

    // Actions
    function setOnboardingState(value: OnboardingState) {
        onboardingState.value = value

        if (typeof window !== 'undefined') {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value))
        }
    }

    return { onboardingState, setOnboardingState }
})

// Initialize from localStorage or default to 'not started'
const getInitialState = (): OnboardingState => {
    if (typeof window == 'undefined')
        return OnboardingState.NotStarted

    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    return stored ? JSON.parse(stored) : OnboardingState.NotStarted
}
