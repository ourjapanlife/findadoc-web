/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
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
            md: { min: '800px' }
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            currentColor: '#ED6C5A',
            orange: {
                100: '#fff7ed',
                200: '#ffedd5',
                300: '#fed7aa',
                400: '#fb923c',
                DEFAULT: '#ED6C5A',
                500: '#ED6C5A',
                600: '#ea580c',
                700: '#c2410c',
                800: '#9a3412',
                900: '#7c2d12'
            },
            blue: '#245A7D',
            neutral: colors.gray,
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            emerald: colors.emerald,
            indigo: colors.indigo,
            yellow: colors.yellow,
            teal: colors.teal,
            slate: colors.slate,
            zinc: colors.zinc
        }
    },
    plugins: []
}
