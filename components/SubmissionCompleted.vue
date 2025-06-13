<template>
    <div
        data-testid="submit-completed"
        class="flex flex-col place-items-center"
    >
        <img
            class="mb-10"
            src="../assets/images/heart-circle.png"
            alt="heart circle icon"
        >
        <p
            class="mb-3.5 text-primary-text text-2xl font-bold font-sans leading-normal"
        >
            {{ t('thankYouPage.heading') }}
        </p>
        <p
            class="mb-20 text-center text-neutral-600 text-sm font-bold font-sans"
        >
            {{ t('thankYouPage.submission') }}
        </p>
        <div
            class="action-button-container flex flex-col"
        >
            <button
                class="px-20 py-3 rounded-full bg-currentColor w-96 text-center
        text-white text-base font-medium font-sans mb-2"
                @click="resetFormCompleted"
            >
                {{ t('thankYouPage.submitAnotherDoctor') }}
            </button>
            <NuxtLink
                class="flex"
                to="/"
            >
                <button
                    class="px-20 py-3 rounded-full bg-currentColor w-96 text-center
        text-white text-base font-medium font-sans"
                >{{ t('thankYouPage.home') }}</button>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSubmissionStore } from '~/stores/submissionStore'

const { t } = useI18n()

const submissionStore = useSubmissionStore()

const resetFormCompleted = () => {
    submissionStore.submissionCompleted = false
}
</script>

