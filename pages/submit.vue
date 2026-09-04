<template>
    <section
        data-testid="submit-page"
        class="page-section"
    >
        <div
            class="page-container grid gap-10
                   landscape:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] landscape:gap-16"
        >
            <SubmissionForm v-if="!submissionStore.submissionCompleted" />
            <SubmissionCompleted v-else />
            <aside class="card flex flex-col gap-3 self-start p-6">
                <h2 class="text-lg font-semibold text-primary-text">
                    {{ t('home.contributeHeading') }}
                </h2>
                <p class="text-primary-text-muted">
                    {{ t('home.contributeBody') }}
                </p>
                <img
                    :src="illustration"
                    alt=""
                    width="355"
                    height="638"
                    loading="lazy"
                    decoding="async"
                    class="mt-2 h-32 w-auto self-center"
                >
            </aside>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'
import { useSubmissionStore } from '~/stores/submissionStore'

const { t } = useI18n()
const submissionStore = useSubmissionStore()

useHead({ title: computed(() => t('submitPage.heading')) })

// A cached file rather than an inline SVG component; bound so the compiler leaves the URL alone.
const illustration = '/illustrations/characters-sachi.svg'
</script>
