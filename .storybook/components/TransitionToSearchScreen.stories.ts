import type { Meta, StoryObj } from '@storybook/vue3'
import TransitionToSearchScreen from '../../components/onboarding/TransitionToSearchScreen.vue'

const meta = {
    title: 'components/onboarding/TransitionToSearchScreen',
    component: TransitionToSearchScreen,
    tags: ['autodocs']
} satisfies Meta<typeof TransitionToSearchScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
