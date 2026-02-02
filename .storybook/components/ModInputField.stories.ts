import type { Meta, StoryObj } from '@storybook/vue3'
import ModInputField from '../../components/moderation-panel/ModInputField.vue'

const meta = {
    title: 'components/moderation-panel/ModInputField',
    component: ModInputField,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'Label text for the input field'
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'tel', 'url'],
            description: 'HTML input type'
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input'
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required'
        },
        invalidInputErrorMessage: {
            control: 'text',
            description: 'Error message shown when validation fails'
        },
        inputValidationCheck: {
            control: false,
            description: 'Validation function: `(value: string | undefined) => boolean`. Returns true if valid, false otherwise.'
        }
    }
} satisfies Meta<typeof ModInputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your name',
        required: true
    }
}

export const Optional: Story = {
    args: {
        label: 'Middle Name',
        type: 'text',
        placeholder: 'Enter middle name',
        required: false
    }
}

export const EmailWithValidation: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email',
        required: true,
        invalidInputErrorMessage: 'Please enter a valid email address',
        inputValidationCheck: (value: string | undefined) => {
            if (!value) return false
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        }
    }
}

export const PasswordWithValidation: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        required: true,
        invalidInputErrorMessage: 'Password must be at least 8 characters',
        inputValidationCheck: (value: string | undefined) => value ? value.length >= 8 : false
    }
}

export const PhoneWithValidation: Story = {
    args: {
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+81 123-4567-8900',
        required: true,
        invalidInputErrorMessage: 'Please enter a valid phone number',
        inputValidationCheck: (value: string | undefined) => {
            if (!value) return false
            return /^\+?\d{10,}$/.test(value.replace(/[\s\-()]/g, ''))
        }
    }
}
