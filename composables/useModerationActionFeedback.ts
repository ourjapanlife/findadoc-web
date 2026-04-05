import type { ToastInterface } from 'vue-toastification'

export function returnWithSuccessToast<T>(
    response: T,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined,
    translationKey: string
): T {
    const msg = t(translationKey) ?? translationKey ?? ''
    toast.success(msg)
    return response
}
