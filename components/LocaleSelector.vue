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
// Nuxt vue-i18n documentation:
// https://i18n.nuxtjs.org/docs/v8/api/vue-i18n

import { onMounted, ref, watch } from 'vue'
import { useLocaleStore } from '../stores/localeStore'
import type { Locale } from '#i18n'
import { Locale as GqlLocale } from '~/typedefs/gqlTypes.js'
import { useI18n } from '#imports'

const { setLocale, getLocaleCookie } = useI18n()
const localeStore = useLocaleStore()

// getLocaleCookie to set the initial locale, if there is no cookie, it will default based on the nuxt.config.js
// Browser's code language is using "-" instead of "_".
const localeCookie = getLocaleCookie()?.replace('-', '_') || GqlLocale.EnUs
const selectedLocale = ref(localeCookie)

watch(selectedLocale, newLocale => {
    localeStore.setLocale(newLocale as GqlLocale)
    // setLocale to update the i18n plugin and set the 'i18n_redirected' cookie
    setLocale(newLocale.replace('_', '-') as Locale)
})
</script>
