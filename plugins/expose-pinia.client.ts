import { defineNuxtPlugin } from 'nuxt/app'
import type { Pinia } from 'pinia'
import { useAuthStore } from '~/stores/authStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useLoadingStore } from '~/stores/loadingStore'
import { useLocaleStore } from '~/stores/localeStore'
import { useLocationsStore } from '~/stores/locationsStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { useSubmissionStore } from '~/stores/submissionStore'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || config.public.NUXT_PUBLIC_LOAD_STORES) {
    /* Create the stores using the app's Pinia instance.
    This must be done for every store. So if new stores are created for testing they need to be added here */
        const authStore = useAuthStore(nuxtApp.$pinia as Pinia)
        const facilitiesStore = useFacilitiesStore(nuxtApp.$pinia as Pinia)
        const healthcareProfessionalsStore = useHealthcareProfessionalsStore(nuxtApp.$pinia as Pinia)
        const loadingStore = useLoadingStore(nuxtApp.$pinia as Pinia)
        const localeStore = useLocaleStore(nuxtApp.$pinia as Pinia)
        const locationsStore = useLocationsStore(nuxtApp.$pinia as Pinia)
        const modalStore = useModalStore(nuxtApp.$pinia as Pinia)
        const moderationScreenStore = useModerationScreenStore(nuxtApp.$pinia as Pinia)
        const moderationSubmissionsStore = useModerationSubmissionsStore(nuxtApp.$pinia as Pinia)
        const searchResultsStore = useSearchResultsStore(nuxtApp.$pinia as Pinia)
        const specialtiesStore = useSpecialtiesStore(nuxtApp.$pinia as Pinia)
        const submissionStore = useSubmissionStore(nuxtApp.$pinia as Pinia)

        // Expose them on a global property for Cypress tests
        // eslint-disable-next-line
        window.__stores__ = {
            authStore,
            facilitiesStore,
            healthcareProfessionalsStore,
            loadingStore,
            localeStore,
            locationsStore,
            modalStore,
            moderationScreenStore,
            moderationSubmissionsStore,
            searchResultsStore,
            specialtiesStore,
            submissionStore
        }
    }
})
