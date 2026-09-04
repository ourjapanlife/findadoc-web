<template>
    <section
        data-testid="privacy-page"
        class="page-section"
    >
        <div class="page-container-narrow flex flex-col gap-8">
            <header class="flex flex-col gap-3">
                <h1
                    data-testid="privacy-heading"
                    class="page-title-sm"
                >
                    {{ t('privacyPage.heading') }}
                </h1>
                <p
                    data-testid="privacy-subheading"
                    class="text-lg text-primary-text-muted"
                >
                    {{ t('privacyPage.subheading') }}
                </p>
                <p class="text-sm text-primary-text-muted">
                    {{ t('privacyPage.date') }}
                </p>
            </header>

            <div class="prose-legal">
                <p>
                    {{ t('privacyPage.paragraph1') }}
                </p>

                <h2>{{ t('privacyPage.paragraph2') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph3') }}
                </p>

                <h2>{{ t('privacyPage.paragraph4') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph5') }}
                </p>

                <h2>{{ t('privacyPage.paragraph6') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph7') }}
                </p>

                <h2>{{ t('privacyPage.paragraph8') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph9') }}
                </p>

                <h2>{{ t('privacyPage.paragraph10') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph11') }}
                </p>

                <h2>{{ t('privacyPage.paragraph12') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph13') }}
                </p>

                <h2>{{ t('privacyPage.paragraph14') }}</h2>
                <p>
                    {{ t('privacyPage.paragraph15') }}
                </p>
                <p>
                    {{ t('privacyPage.paragraph16') }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

const { t } = useI18n()

useHead({ title: computed(() => t('privacyPage.heading')) })
</script>
