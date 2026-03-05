type ConfirmationMode = 'create' | 'update'

interface ConfirmationConfig {
    message?: string
    title?: string
    onCancel?: () => void
    textConfirm?: string
    textCancel?: string
    mode?: ConfirmationMode
}

type ConfirmationConfigInput = string | ConfirmationConfig

const parseConfirmationConfig = (input: ConfirmationConfigInput): ConfirmationConfig =>
    typeof input === 'string' ? { message: input } : input

interface ConfirmationData {
    id: symbol
    message?: string
    title?: string
    textConfirm?: string
    textCancel?: string
    mode?: ConfirmationMode
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
}

export default defineNuxtPlugin(() => {
    const confirmation = ref<ConfirmationData>()

    const withConfirmation = (
        onConfirm: () => void | Promise<void>,
        input: ConfirmationConfigInput
    ) => {
        const config = parseConfirmationConfig(input)
        const id = Symbol('confirmation')

        confirmation.value = {
            id,
            title: config.title,
            message: config.message,
            textCancel: config.textCancel,
            textConfirm: config.textConfirm,
            mode: config.mode,
            onCancel: config.onCancel,
            onConfirm
        }

        return id
    }

    const clearIfCurrent = (id: symbol) => {
        if (confirmation.value?.id === id) confirmation.value = undefined
    }

    const confirmAction = async () => {
        const current = confirmation.value
        if (!current) return

        try {
            await current.onConfirm()
        } finally {
            clearIfCurrent(current.id)
        }
    }

    const cancelAction = () => {
        const current = confirmation.value
        if (!current) return

        current.onCancel?.()
        clearIfCurrent(current.id)
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
