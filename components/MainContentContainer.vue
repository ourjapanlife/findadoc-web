<template>
    <div class="h-full w-full">
        <Onboarding
            v-if="onboardingState === OnboardingState.NotStarted"
        />
        <div v-if="onboardingState === OnboardingState.Completed">
            <TopNav />
            <LeftNavbar class="bg-primary-bg w-96" />
            <SearchContainer />
            <Footer />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const { onboardingState } = storeToRefs(onboardingStore)
</script>
