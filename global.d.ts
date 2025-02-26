import type { useAuthStore } from './stores/authStore'
import type { useFacilitiesStore } from './stores/facilitiesStore'
import type { useHealthcareProfessionalsStore } from './stores/healthcareProfessionalsStore'
import type { useLoadingStore } from './stores/loadingStore'
import type { useLocaleStore } from './stores/localeStore'
import type { useLocationsStore } from './stores/locationsStore'
import type { useModalStore } from './stores/modalStore'
import type { useModerationScreenStore } from './stores/moderationScreenStore'
import type { useModerationSubmissionsStore } from './stores/moderationSubmissionsStore'
import type { useSearchResultsStore } from './stores/searchResultsStore'
import type { useSpecialtiesStore } from './stores/specialtiesStore'
import type { useSubmissionStore } from './stores/submissionStore'

export {}

/* These types are declared on the window object so that we can type them when registering them
   to the window in the plugin that exposes the pinia stores for cypress tests */
declare global {
    interface Window {
        __stores__?: {
            authStore: ReturnType<typeof useAuthStore>
            facilitiesStore: ReturnType<typeof useFacilitiesStore>
            healthcareProfessionalsStore: ReturnType<typeof useHealthcareProfessionalsStore>
            loadingStore: ReturnType<typeof useLoadingStore>
            localeStore: ReturnType<typeof useLocaleStore>
            locationsStore: ReturnType<typeof useLocationsStore>
            modalStore: ReturnType<typeof useModalStore>
            moderationScreenStore: ReturnType<typeof useModerationScreenStore>
            moderationSubmissionsStore: ReturnType<typeof useModerationSubmissionsStore>
            searchResultsStore: ReturnType<typeof useSearchResultsStore>
            specialtiesStore: ReturnType<typeof useSpecialtiesStore>
            submissionStore: ReturnType<typeof useSubmissionStore>
        }
    }
}
