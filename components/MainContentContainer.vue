<template>
    <div class="h-full w-full">
        <Onboarding
            v-if="onboardingState === OnboardingState.NotStarted"
        />
        <div
            v-if="onboardingState === OnboardingState.Completed"
            id="search-container"
        >
            <TopNav class="relative top-0 left-0 z-10" />
            <SearchContainer class="absolute top-0 z-0 w-full" />
            <Footer class="z-10" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)
</script>
