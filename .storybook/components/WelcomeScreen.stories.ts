import type { Meta, StoryObj } from '@storybook/vue3'
import WelcomeScreen from '../../components/onboarding/WelcomeScreen.vue'

const meta = {
    title: 'components/onboarding/WelcomeScreen',
    component: WelcomeScreen,
    tags: ['autodocs']
} satisfies Meta<typeof WelcomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
