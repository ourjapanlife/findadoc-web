<template>
    <div
        class="w-24"
        data-testid="locale-selector"
    >
        <select
            v-model="selectedLocale"
        >
            <option
                v-for="(localeOption) in localeStore.mvpLocaleDisplayOptions"
                :key="localeOption.code"
                :data-testid="`locale-option-${localeOption.code}`"
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

import type { Locale } from '#i18n'
import type { Locale as GqlLocale } from '~/typedefs/gqlTypes.js'

const { setLocale, getLocaleCookie } = useI18n()
const localeStore = useLocaleStore()

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
