import { isNavigationFailure, NavigationFailureType, type Router } from 'vue-router'
import { ModerationScreen } from '~/stores/moderationScreenStore'
import {
    SelectedModerationListView,
    useModerationSubmissionsStore
} from '~/stores/moderationSubmissionsStore'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'
import type { ServerError } from '~/typedefs/serverResponse'

import type { Submission } from '~/typedefs/gqlTypes'

export function isNewSubmission(
    submission: Pick<Submission, 'isApproved' | 'isRejected' | 'isUnderReview'>
): boolean {
    return !submission.isRejected && !submission.isApproved && !submission.isUnderReview
}

export type ModerationDashboardView = 'submissions' | 'facilities' | 'healthcare-professionals'

const MY_PAGE_FORM_ROUTE = /^\/(?:my-page|moderation)\/(?:edit-|create-)/

export function isMyPageFormRoute(path: string): boolean {
    return MY_PAGE_FORM_ROUTE.test(path)
}

export function hasServerErrors(
    response: { errors?: ServerError[] } | undefined
): response is { errors: ServerError[] } {
    return !!response?.errors?.length
}

export function getModerationDashboardViewForScreen(activeScreen: ModerationScreen): ModerationDashboardView {
    switch (activeScreen) {
        case ModerationScreen.EditFacility:
        case ModerationScreen.CreateFacility:
            return 'facilities'
        case ModerationScreen.EditHealthcareProfessional:
        case ModerationScreen.CreateHealthcareProfessional:
            return 'healthcare-professionals'
        default:
            return 'submissions'
    }
}

function syncModerationListView(view: ModerationDashboardView) {
    const moderationSubmissionsStore = useModerationSubmissionsStore()
    switch (view) {
        case 'facilities':
            moderationSubmissionsStore.setSelectedModerationListViewChosen(SelectedModerationListView.Facilities)
            break
        case 'healthcare-professionals':
            moderationSubmissionsStore.setSelectedModerationListViewChosen(
                SelectedModerationListView.HealthcareProfessionals
            )
            break
        default:
            moderationSubmissionsStore.setSelectedModerationListViewChosen(SelectedModerationListView.Submissions)
    }
}

/** Clears router-guard blockers so programmatic navigation can complete. */
export function clearModerationNavigationBlockers() {
    const { $unsavedChangesRegistry } = useNuxtApp()
    $unsavedChangesRegistry?.clearAll?.()
    useModerationSubmissionUnsavedStore().setEditSubmissionFormDirty(false)
}

/**
 * Leave an edit/create form and return to the my-page dashboard.
 * Sets screen + list tab first, clears unsaved blockers, then updates the URL.
 */
export async function leaveToModerationDashboard(
    router: Router,
    moderationScreenStore: {
        setActiveScreen: (screen: ModerationScreen) => void
        activeScreen: ModerationScreen
    },
    modalStore?: { hideModal: () => void },
    view?: ModerationDashboardView
) {
    const targetView = view ?? getModerationDashboardViewForScreen(moderationScreenStore.activeScreen)

    syncModerationListView(targetView)
    clearModerationNavigationBlockers()
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    modalStore?.hideModal()

    const navigationResult = await router.push(`/my-page?view=${targetView}`)
    if (isNavigationFailure(navigationResult)
      && !isNavigationFailure(navigationResult, NavigationFailureType.duplicated)) {
        return
    }
}

export async function leaveToAppHome(
    router: Router,
    moderationScreenStore: { setActiveScreen: (screen: ModerationScreen) => void },
    modalStore?: { hideModal: () => void }
) {
    clearModerationNavigationBlockers()
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    modalStore?.hideModal()

    const navigationResult = await router.push('/')
    if (isNavigationFailure(navigationResult)
      && !isNavigationFailure(navigationResult, NavigationFailureType.duplicated)) {
        return
    }
}

/** @deprecated Use leaveToModerationDashboard */
export const exitToModerationDashboard = leaveToModerationDashboard

/** @deprecated Use leaveToModerationDashboard */
export const navigateToModerationDashboard = leaveToModerationDashboard

/** @deprecated Use leaveToAppHome */
export const navigateToAppHome = leaveToAppHome
