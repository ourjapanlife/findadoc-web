import { useNuxtApp } from '#app'

export const useTranslation = (translationString: string) => {
    const nuxtApp = useNuxtApp()
    // Access the i18n plugin from nuxtApp
    return nuxtApp.$i18n?.t(translationString) ?? translationString
}
