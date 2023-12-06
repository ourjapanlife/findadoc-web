import i18n from './i18n/index.js'

//@ts-ignore-next-line
export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en_US',
    fallbackLocale: 'en_US',
    messages: i18n
}))
