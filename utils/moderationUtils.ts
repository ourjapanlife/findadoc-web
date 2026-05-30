import { isNavigationFailure, NavigationFailureType, type Router } from 'vue-router'
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
    const navigationResult = await router.push('/moderation')
    if (isNavigationFailure(navigationResult)) {
        // Already on `/moderation` (dashboard + edit share one route); still switch Pinia screen.
        if (!isNavigationFailure(navigationResult, NavigationFailureType.duplicated)) {
            return
        }
    }
    modalStore?.hideModal()
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
}
