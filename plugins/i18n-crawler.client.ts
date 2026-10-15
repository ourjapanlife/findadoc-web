import { defineNuxtPlugin } from 'nuxt/app'
import { isSearchCrawler } from '~/utils/crawler'
import { DEFAULT_LOCALE_CODE, localeCodeFromPath } from '~/utils/localePath'

/**
 * Server middleware already hides detection signals from the first HTML.
 * This stops the client plugin from navigating `/` after hydration when the
 * crawler executes JavaScript. A prefixed URL keeps the locale in the path.
 */
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('i18n:beforeLocaleSwitch', data => {
        if (!data.initialSetup || !isSearchCrawler(navigator.userAgent)) {
            return
        }

        const path = nuxtApp.$router?.currentRoute.value.path ?? window.location.pathname
        if (localeCodeFromPath(path) !== DEFAULT_LOCALE_CODE) {
            return
        }

        data.newLocale = DEFAULT_LOCALE_CODE
    })
})
