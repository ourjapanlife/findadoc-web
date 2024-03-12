/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line
const colors = require("tailwindcss/colors");

// eslint-disable-next-line
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        screens: {
            md: { min: "800px" },
            sm: { max: "640px" },
        },
        colors: {
            ////from tailwind labs https://youtu.be/MAtaT8BZEAo. allows opacity to still work with css vars.
            //https://tailwindcss.com/docs/customizing-colors#using-css-variables
            transparent: "transparent",
            current: "currentColor",
            currentColor: "#ED6C5A",
            primary: "rgb(var(--color-primary) / <alpha-value>)",
            secondary: "rgb(var(--color-secondary) / <alpha-value>)",
            tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
            "primary-inverted":
                "rgb(var(--color-primary-inverted) / <alpha-value>)",
            "primary-hover": "rgb(var(--color-primary-hover) / <alpha-value>)",
            "primary-bg": "rgb(var(--color-bg-primary) / <alpha-value>)",
            "secondary-bg": "rgb(var(--color-bg-secondary) / <alpha-value>)",
            "primary-text": "rgb(var(--color-text-base) / <alpha-value>)",
            "primary-text-muted":
                "rgb(var(--color-text-muted) / <alpha-value>)",
            "primary-text-inverted":
                "rgb(var(--color-text-inverted) / <alpha-value>)",
            "secondary-inverted":
                "rgb(var(--color-secondary-inverted) / <alpha-value>)",
            "secondary-hover":
                "rgb(var(--color-secondary-hover) / <alpha-value>)",
            blue: "#245A7D",
            neutral: colors.gray,
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            emerald: colors.emerald,
            indigo: colors.indigo,
            yellow: colors.yellow,
            teal: colors.teal,
            slate: colors.slate,
            zinc: colors.zinc,
        },
        // this section is temporary for the beta marquee banner
        extend: {
            animation: {
                marquee: 'marquee 50s linear infinite',
                marquee2: 'marquee2 50s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            }
        }
    },
    plugins: [],
};
