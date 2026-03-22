import { computed } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export type AppAccessNavItem = {
    to: string
    /** i18n key for the link label */
    labelKey: string
}

/**
 * Routes shown in the app-access shell left nav for the current user.
 * Extend with permission checks (e.g. Auth0 roles) when available.
 */
export function useAppAccessNavItems() {
    const authStore = useAuthStore()

    const items = computed((): AppAccessNavItem[] => {
        if (!authStore.isLoggedIn) {
            return []
        }
        return [
            { to: '/', labelKey: 'topNav.home' },
            { to: '/settings', labelKey: 'topNav.settings' },
            { to: '/moderation', labelKey: 'appAccessNav.moderation' },
        ]
    })

    return { items }
}
