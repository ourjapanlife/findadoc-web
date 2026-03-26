import type { ToastInterface } from 'vue-toastification'

export function returnWithSuccessToast<T>(
    response: T,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined,
    translationKey: string
): T {
    toast.success(t(translationKey))
    return response
}
