/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line
const colors = require("tailwindcss/colors");

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
            md: { min: '800px' },
            sm: { max: '640px' }
        },
        colors: {
            ////from tailwind labs https://youtu.be/MAtaT8BZEAo. allows opacity to still work with css vars.
            //https://tailwindcss.com/docs/customizing-colors#using-css-variables
            transparent: 'transparent',
            current: 'currentColor',
            currentColor: '#ED6C5A',
            primary: 'rgb(var(--color-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
            accent: 'rgb(var(--color-accent) / <alpha-value>)',
            'primary-inverted':
                'rgb(var(--color-primary-inverted) / <alpha-value>)',
            'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
            'primary-bg': 'rgb(var(--color-bg-primary) / <alpha-value>)',
            'secondary-bg': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
            'accent-bg': 'rgb(var(--color-bg-accent) / <alpha-value>)',
            'primary-text': 'rgb(var(--color-text-base) / <alpha-value>)',
            'primary-text-muted':
                'rgb(var(--color-text-muted) / <alpha-value>)',
            'primary-text-inverted':
                'rgb(var(--color-text-inverted) / <alpha-value>)',
            'secondary-inverted':
                'rgb(var(--color-secondary-inverted) / <alpha-value>)',
            'secondary-hover':
                'rgb(var(--color-secondary-hover) / <alpha-value>)',
            success:
                'rgb(var(--color-success) / <alpha-value>)',
            error:
                'rgb(var(--color-error) / <alpha-value>)',
            warning:
                'rgb(var(--color-warning) / <alpha-value>)',
            info:
                'rgb(var(--color-info) / <alpha-value>)',
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
