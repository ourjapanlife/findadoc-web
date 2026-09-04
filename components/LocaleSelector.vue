<template>
    <div
        class="relative"
        data-testid="locale-selector"
    >
        <label
            :for="selectId"
            class="sr-only"
        >{{ t('hamburgerMenu.languageDropdownTitle') }}</label>
        <select
            :id="selectId"
            v-model="selectedLocale"
            class="h-10 appearance-none rounded-lg border border-border-strong bg-secondary-bg pl-3 pr-8
                   text-sm font-medium text-primary-text transition-colors hover:border-primary"
        >
            <option
                v-for="localeOption in localeStore.mvpLocaleDisplayOptions"
                :key="localeOption.code"
                :data-testid="`locale-option-${localeOption.code}`"
                :value="localeOption.code"
            >
                {{ localeOption.simpleText }}
            </option>
        </select>
        <svg
            class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-primary-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    </div>
</template>

<script setup lang="ts">
// Nuxt vue-i18n documentation:
// https://i18n.nuxtjs.org/docs/v8/api/vue-i18n

import { ref, useId, watch } from 'vue'
import type { Locale } from '#i18n'
import type { Locale as GqlLocale } from '~/typedefs/gqlTypes.js'
import { useLocaleStore } from '~/stores/localeStore'

const { t, setLocale, getLocaleCookie } = useI18n()
const localeStore = useLocaleStore()
const selectId = useId()

// getLocaleCookie to set the initial locale, if there is no cookie, it will default based on the nuxt.config.js
// Browser's code language is using "-" instead of "_".
const localeCookie = getLocaleCookie()?.replace('-', '_') || localeStore.activeLocale.code

// If cookie doesn't exist, set it to currently active locale. Default is EnUs
const selectedLocale = ref(localeCookie ? localeCookie : localeStore.activeLocale.code)

watch(selectedLocale, newLocale => {
    localeStore.setLocale(newLocale as GqlLocale)
    // setLocale to update the i18n plugin and set the 'i18n_redirected' cookie
    setLocale(newLocale.replace('_', '-') as Locale)
})
</script>
