import type { ToastInterface } from 'vue-toastification'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'
import type { ServerError } from '~/typedefs/serverResponse'
import { hasServerErrors } from '~/utils/moderationUtils'

export function handleModerationResponseErrors(
    response: { errors?: ServerError[] } | undefined,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined
): boolean {
    if (!hasServerErrors(response)) {
        return false
    }

    handleServerErrorMessaging(response.errors, toast, t)
    return true
}
