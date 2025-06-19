<template>
    <div class="min-h-screen">
        <Transition
            name="fade"
            mode="out-in"
        >
            <WelcomeScreen
                v-if="currentStep === OnboardingSteps.Welcome"
                @next="currentStep = OnboardingSteps.Categories"
            />
            <CategorySelection
                v-else-if="currentStep === OnboardingSteps.Categories"
                @select-category="handleCategorySelect"
            />
            <TransitionToSearchScreen
                v-else-if="currentStep === OnboardingSteps.LoadingSearch"
                :category="selectedCategory"
                @animation-complete="completeOnboarding"
            />
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes.js'
import { useOnboardingStore, OnboardingState } from '@/stores/onboardingStore'
import { useSpecialtiesStore } from '@/stores/specialtiesStore'

const specialtiesStore = useSpecialtiesStore()
const onboardingStore = useOnboardingStore()
const searchResultsStore = useSearchResultsStore()

const enum OnboardingSteps {
    Welcome = 'welcome',
    Categories = 'categories',
    LoadingSearch = 'loadingSearch'
}

const currentStep = ref<OnboardingSteps>(OnboardingSteps.Welcome)
const selectedCategory = ref<SpecialtyCategory | undefined>(undefined)

const handleCategorySelect = (category: SpecialtyCategory | undefined) => {
    if (category === undefined || category in specialtiesStore.specialtyCategories) {
        selectedCategory.value = category
        currentStep.value = OnboardingSteps.LoadingSearch
        onboardingStore.setOnboardingState(OnboardingState.Completed)
    }
}

const completeOnboarding = async () => {
    if (selectedCategory.value !== undefined) {
        await searchResultsStore.search(undefined, specialtiesStore.categoryToSpecialtyMap[selectedCategory.value])
    }
    onboardingStore.setOnboardingState(OnboardingState.Completed)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
