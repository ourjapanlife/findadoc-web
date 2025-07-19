<template>
    <div class="min-h-screen bg-primary-bg pt-20 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-primary">{{ t('settingsPage.heading') }}</h1>
          <span class="text-primary-text-muted">{{ t('settingsPage.subheading') }}</span>
        </div>
  
        <div class="bg-secondary-bg rounded-lg shadow p-6 mb-8">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-primary mb-3">{{ t('settingsPage.healthcareProfessionalName') }}</h2>
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-full border-2 border-primary-text-muted overflow-hidden flex items-center justify-center">
                <SVGChiko
                  role="img"
                  alt="Chiko the therapy dog"
                  title="Chiko"
                  class="w-16 h-16 stroke-primary"
                />
              </div>
            </div>
          </div>
  
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-primary mb-3">{{ t('settingsPage.firstName') }}</h2>
            <input
              type="text"
              v-model="displayName"
              class="w-full px-4 py-3 border border-primary-text-muted rounded-lg bg-secondary-bg text-primary-text placeholder-primary-text-muted"
            />
          </div>
  
          <div class="flex justify-end">
            <button class="px-6 py-3 bg-primary text-primary-inverted rounded-lg font-medium">
              {{ t('settingsPage.updateButton') }}
            </button>
          </div>
        </div>
  
        <div class="text-center">
          <SVGChiko
            role="img"
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
  import SVGChiko from '~/assets/icons/characters-chiko-therapy-dog-primary.svg'
  
  const { t } = useI18n()
  const displayName = ref('')
  </script>
  