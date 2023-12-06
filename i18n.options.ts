import i18n from './i18n/index.js'

//@ts-ignore-next-line
export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en-US',
    messages: i18n
}))
