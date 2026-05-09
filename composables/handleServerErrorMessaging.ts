import type { ToastInterface } from 'vue-toastification'
import type { ServerError } from '~/typedefs/serverResponse'

export function handleServerErrorMessaging(
    serverErrors: ServerError[], toast: ToastInterface,
    t: (translatableString: string) => string | undefined
) {
    if (serverErrors.length === 0) {
        toast.error(t('serverErrorMessages.genericErrorMessage') ?? 'An error occurred')
        return
    }
    serverErrors.forEach(error => {
        if (t(`serverErrorMessages.${error.code}`)) {
            toast.error((t(`serverErrorMessages.${error.code}`)))
            console.error(error.code)
            return
        }
        toast.error((t('serverErrorMessages.genericErrorMessage')))
        console.error((t('serverErrorMessages.genericErrorMessage')))
        console.info(t('serverErrorMessages.errorCodeMessagingNeeded'))
    })
}

