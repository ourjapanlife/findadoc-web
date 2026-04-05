import type { Router } from 'vue-router'
import { ModerationScreen } from '~/stores/moderationScreenStore'
import type { ServerError } from '~/typedefs/serverResponse'

export function hasServerErrors(
    response: { errors?: ServerError[] } | undefined
): response is { errors: ServerError[] } {
    return !!response?.errors?.length
}

export async function navigateToModerationDashboard(
    router: Router,
    moderationScreenStore: { setActiveScreen: (screen: ModerationScreen) => void },
    modalStore?: { hideModal: () => void }
) {
    modalStore?.hideModal()
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    await router.push('/moderation')
}
