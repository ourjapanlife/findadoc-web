import type { ToastInterface } from 'vue-toastification'

type SuccessToastOptions = Parameters<ToastInterface['success']>[1]

export function returnWithSuccessToast<T>(
    response: T,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined,
    translationKey: string,
    toastOptions?: SuccessToastOptions
): T {
    const msg = t(translationKey) ?? translationKey ?? ''
    toast.success(msg, toastOptions)
    return response
}
