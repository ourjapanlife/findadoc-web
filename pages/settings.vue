<template>
    <div class="min-h-screen bg-primary-bg pt-20 px-4">
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-primary">{{ t('submitPage.heading') }}</h1>
                <span class="text-primary-text-muted">{{ t('submitPage.subheading') }}</span>
            </div>

            <div class="bg-secondary-bg rounded-lg shadow p-6 mb-8">
                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary mb-3">{{ t('submitPage.firstName') }}</h2>
                    <input
                        type="text"
                        v-model="displayName"
                        :placeholder="t('submitPage.firstName')"
                        class="w-full px-4 py-3 border border-primary-text-muted rounded-lg bg-secondary-bg text-primary-text placeholder-primary-text-muted"
                    />
                </div>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-primary mb-3">{{ t('submitPage.healthcareProfessionalName') }}</h2>
                    <div class="flex items-center gap-6">
                        <SVGProfileIcon
                            role="img"
                            alt="profile icon"
                            title="profile icon"
                            class="w-20 h-20 rounded-full border-2 border-primary-text-muted stroke-primary"
                        />

                    </div>
                </div>

                <div class="flex justify-end">
                    <button class="px-6 py-3 bg-primary text-primary-inverted rounded-lg font-medium">
                        {{ t('submitPage.submitButton') }}
                    </button>
                </div>
            </div>

            <div class="text-center">
                <img
                    src="~/assets/icons/characters-chiko-therapy-dog-primary.svg"
                    alt="Chiko the therapy dog"
                    class="w-32 h-32 mx-auto mb-4"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import { ref } from 'vue'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'

const { t } = useI18n()
const displayName = ref('')
</script> 