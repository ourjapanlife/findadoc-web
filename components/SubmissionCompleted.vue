<template>
    <div
        data-testid="submit-completed"
        class="card flex flex-col items-center gap-4 p-8 text-center"
    >
        <SvgHeartIcon
            class="h-20 w-20 text-primary"
            aria-hidden="true"
        />
        <h1 class="page-title-sm">
            {{ t('thankYouPage.heading') }}
        </h1>
        <p class="max-w-md text-lg text-primary-text-muted">
            {{ t('thankYouPage.submission') }}
        </p>
        <div class="mt-2 flex flex-wrap justify-center gap-3">
            <button
                type="button"
                class="btn btn-primary"
                @click="resetFormCompleted"
            >
                {{ t('thankYouPage.submitAnotherDoctor') }}
            </button>
            <NuxtLink
                to="/"
                class="btn btn-secondary"
            >
                {{ t('thankYouPage.home') }}
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SvgHeartIcon from '~/assets/icons/heart-icon.svg'
import { useSubmissionStore } from '~/stores/submissionStore'

const { t } = useI18n()
const submissionStore = useSubmissionStore()

const resetFormCompleted = () => {
    submissionStore.submissionCompleted = false
}
</script>
