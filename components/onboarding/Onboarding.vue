<template>
    <div class="min-h-screen">
        <Transition
            name="fade"
            mode="out-in"
        >
            <WelcomeScreen
                v-if="currentStep === OnboardingSteps.Welcome"
                @next="completeOnboarding"
            />
            <CategorySelection
                v-else-if="currentStep === OnboardingSteps.Categories"
                @select-category="handleCategorySelect"
            />
            <TransitionToSearchScreen
                v-else-if="currentStep === OnboardingSteps.LoadingSearch"
            />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useSearchResultsStore } from '~/stores/searchResultsStore'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes.js'
import { useOnboardingStore, OnboardingState } from '@/stores/onboardingStore'
// import { useSpecialtiesStore } from '@/stores/specialtiesStore'

// const specialtiesStore = useSpecialtiesStore()
const onboardingStore = useOnboardingStore()
// const searchResultsStore = useSearchResultsStore()

const enum OnboardingSteps {
    Welcome = 'welcome',
    Categories = 'categories',
    LoadingSearch = 'loadingSearch'
}

const currentStep = ref<OnboardingSteps>(OnboardingSteps.Welcome)
const selectedCategory = ref<SpecialtyCategory | undefined>(undefined)

const handleCategorySelect = async (category: SpecialtyCategory | undefined) => {
    selectedCategory.value = category
    currentStep.value = OnboardingSteps.LoadingSearch

    await completeOnboarding()
}

const completeOnboarding = async () => {
    currentStep.value = OnboardingSteps.LoadingSearch
    // Wait for the loading animation to finish, then transition to the search page
    setTimeout(() => {
        onboardingStore.setOnboardingState(OnboardingState.Completed)
    }, 3000)

    // Let's start the search with the selected category to start
    // const specialtiesToSearch = selectedCategory.value
    //     ? specialtiesStore.categoryToSpecialtyMap[selectedCategory.value]
    //     : undefined

    // searchResultsStore.selectedSpecialties = specialtiesToSearch ?? []

    // await searchResultsStore.search()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
