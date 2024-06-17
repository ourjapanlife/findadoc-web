<template>
  <div class="w-24">
    <select
      v-model="selectedLocale"
      class="rounded-full landscape:w-full px-2 py-1 landscape:px-1 landscape:py-1.5 border-2 border-primary/80
      landscape:border-primary/60 drop-shadow-md text-primary-text bg-secondary-bg/5
      landscape:bg-primary-bg hover:bg-primary-hover/10 transition-colors"
    >
      <option
        v-for="(localeOption) in localeStore.mvpLocaleDisplayOptions"
        :key="localeOption.code"
        :value="localeOption.code"
      >
        {{ localeOption.simpleText }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocaleStore } from '../stores/localeStore'
import { Locale } from '~/typedefs/gqlTypes.js'
import { useI18n } from '#imports'

const { locale } = useI18n()
const localeStore = useLocaleStore()
const selectedLocale = ref(Locale.EnUs)

watch(selectedLocale, (newLocale: Locale) => {
    localeStore.setLocale(newLocale)
    locale.value = newLocale
})
</script>
