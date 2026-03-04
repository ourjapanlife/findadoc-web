interface ConfirmationConfig {
    message: string
    title?: string
    onCancel?: () => void
    textConfirm?: string
    textCancel?: string
    mode?: 'create' | 'update'
}

type ConfirmationConfigInput = string | ConfirmationConfig

const parseConfirmationConfig = (input: ConfirmationConfigInput): ConfirmationConfig =>
    typeof input === 'string'
        ? { message: input }
        : input

interface ConfirmationData {
    message: string
    onConfirm: () => void
    onCancel?: () => void
    title?: string
    textConfirm?: string
    textCancel?: string
    mode?: 'create' | 'update'
}

export default defineNuxtPlugin(() => {
    const confirmation = ref<ConfirmationData>()

    const withConfirmation = (onConfirm: () => void, input: ConfirmationConfigInput) => {
        const config = parseConfirmationConfig(input)
        confirmation.value = {
            title: config.title,
            message: config.message,
            textCancel: config.textCancel,
            textConfirm: config.textConfirm,
            mode: config.mode,
            onCancel: config.onCancel,
            onConfirm
        }
    }

    const confirmAction = () => {
        confirmation.value?.onConfirm()
        confirmation.value = undefined
    }
    const cancelAction = () => {
        confirmation.value?.onCancel?.()
        confirmation.value = undefined
    }

    return {
        provide: {
            confirmationDialog: {
                confirmation,
                confirmAction,
                cancelAction
            },
            withConfirmation
        }
    }
})
