import type { ToastInterface } from 'vue-toastification'
import type { ServerError } from '~/typedefs/serverResponse'

export function handleServerErrorMessaging(
    serverErrors: ServerError[], toast: ToastInterface,
    t: (translatableString: string) => string | undefined
) {
    serverErrors.map(error => {
        if (t(`serverErrorMessages.${error.code}`)) {
            toast.error((t(`serverErrorMessages.${error.code}`)))
            return
        }
        toast.error((t('serverErrorMessages.genericErrorMessage')))
        console.info(t('serverErrorMessages.errorCodeMessagingNeeded'))
    })
    return
}

