/** @type {import('tailwindcss').Config} */

export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue'
    ],
    theme: {
        screens: {
            md: { min: '800px' },
            sm: { max: '640px' }
        }
    },
    plugins: []
}
