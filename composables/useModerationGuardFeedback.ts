import type { ToastInterface } from 'vue-toastification'

export function guardWithErrorToast(
    shouldBlock: boolean,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined,
    translationKey: string
): boolean {
    if (!shouldBlock) {
        return false
    }

    toast.error(t(translationKey))
    return true
}

export async function guardWithErrorToastAndEffect(
    shouldBlock: boolean,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined,
    translationKey: string,
    onBlocked: () => void | Promise<void>
): Promise<boolean> {
    if (!guardWithErrorToast(shouldBlock, toast, t, translationKey)) {
        return false
    }

    await onBlocked()
    return true
}
