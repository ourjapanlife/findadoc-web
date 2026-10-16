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
import { useUmami } from '~/composables/useUmamiTracking'
import { siteLanguage } from '~/utils/analyticsEvents'

const { t, locale, setLocale } = useI18n()
const localeStore = useLocaleStore()
const { track } = useUmami()
const selectId = useId()

function toGqlCode(code: string): string {
    return code.replace('-', '_')
}

function toI18nCode(code: string): string {
    return code.replace('_', '-')
}

// The URL is the locale. setLocale navigates to the prefixed path and writes
// i18n_redirected, so a later visit to `/` still lands on the chosen language.
const selectedLocale = ref(toGqlCode(locale.value))
localeStore.setLocale(selectedLocale.value as GqlLocale)

watch(locale, value => {
    const gqlCode = toGqlCode(String(value))
    if (selectedLocale.value !== gqlCode) {
        selectedLocale.value = gqlCode
    }
})

watch(selectedLocale, newLocale => {
    const i18nCode = toI18nCode(newLocale)
    if (i18nCode === locale.value) {
        return
    }
    localeStore.setLocale(newLocale as GqlLocale)
    void setLocale(i18nCode as Locale)
    const to = siteLanguage(newLocale)
    if (to) track('Language switched', { to })
})
</script>
