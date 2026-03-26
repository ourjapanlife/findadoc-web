import type { ToastInterface } from 'vue-toastification'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'
import { hasServerErrors } from '~/utils/moderationUtils'

type ServerErrorResponse = {
    errors?: Array<{ code?: string }>
}

export function handleModerationResponseErrors(
    response: ServerErrorResponse | undefined,
    toast: ToastInterface,
    t: (translatableString: string) => string | undefined
): boolean {
    if (!hasServerErrors(response)) {
        return false
    }

    handleServerErrorMessaging(response.errors ?? [], toast, t)
    return true
}
