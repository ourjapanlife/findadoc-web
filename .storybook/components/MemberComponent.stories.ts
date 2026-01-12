import type { Meta, StoryObj } from '@storybook/vue3'
import MemberComponent from '../../components/MemberComponent.vue'

const meta = {
    title: 'components/MemberComponent',
    component: MemberComponent,
    tags: ['autodocs']
} satisfies Meta<typeof MemberComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        avatarImg: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg',
        name: 'Samantha Carter',
        title: 'Full stack developer',
        dataTestId: 1,
        githubUrl: '',
        linkedInUrl: ''
    }
}
