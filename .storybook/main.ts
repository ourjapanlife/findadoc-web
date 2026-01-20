import type { StorybookConfig } from '@storybook-vue/nuxt'

const config: StorybookConfig = {
    stories: [
        './components/**/*.stories.@(ts)'
    ],
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@storybook/addon-links'
    ],
    framework: '@storybook-vue/nuxt'
}

export default config
