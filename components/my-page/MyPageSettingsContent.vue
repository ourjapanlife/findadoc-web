<template>
    <div class="h-full overflow-y-auto p-4 md:p-6">
        <div class="max-w-2xl mx-auto">
            <div class="mb-6">
                <h1 class="text-2xl md:text-3xl font-bold text-primary-text">
                    {{ t('settingsPage.heading') }}
                </h1>
                <span class="text-primary-text-muted">{{ t('settingsPage.subheading') }}</span>
            </div>

            <div class="bg-secondary-bg rounded-lg border border-accent-bg p-6 mb-6">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary-text mb-3">
                        {{ t('settingsPage.healthcareProfessionalName') }}
                    </h2>
                    <div class="flex items-center gap-6">
                        <div
                            class="w-20 h-20 rounded-full border-2 border-accent-bg overflow-hidden
                            flex items-center justify-center"
                        >
                            <img
                                :src="mascotIllustration"
                                alt=""
                                width="1024"
                                height="1024"
                                loading="lazy"
                                decoding="async"
                                class="w-16 h-16 stroke-primary"
                            >
                        </div>
                    </div>
                </div>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary-text mb-3">
                        {{ t('settingsPage.displayName') }}
                    </h2>
                    <input
                        v-model="displayName"
                        type="text"
                        class="w-full px-4 py-3 border border-accent-bg rounded-lg
                        bg-secondary-bg text-primary-text placeholder-primary-text-muted"
                    >
                </div>

                <div class="flex justify-end">
                    <button class="px-6 py-3 bg-primary text-primary-text-inverted rounded-lg font-medium">
                        {{ t('settingsPage.updateButton') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'
// Served as a cached file rather than inlined into the chunk; bound so the compiler leaves the URL alone.
const mascotIllustration = '/illustrations/characters-chiko-therapy-dog-primary.svg'

const { t } = useI18n()
const displayName = ref('')
</script>
