import { computed, onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { fetchFacilityMatchingMapsUrl, type ExistingFacilityMatch } from '~/utils/existingFacility'
import { facilityMatchToShow } from '~/utils/existingFacilityMatch'
import { validateGoogleMapsUrlInput } from '~/utils/formValidations'

const LOOKUP_DELAY_MS = 800

/** Looks up whether this Maps link is already a clinic. Editing that same clinic is ignored. */
export function useExistingFacilityMatch(
    url: MaybeRefOrGetter<string>,
    ignoreId?: MaybeRefOrGetter<string | null | undefined>
) {
    const found = ref<ExistingFacilityMatch | null>(null)
    const match = computed(() => facilityMatchToShow(found.value, toValue(ignoreId)))
    let request = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    watch(() => toValue(url).trim(), trimmed => {
        if (timer) clearTimeout(timer)
        if (!validateGoogleMapsUrlInput(trimmed)) {
            request += 1
            found.value = null
            return
        }
        const current = ++request
        timer = setTimeout(() => {
            void lookup(trimmed, current)
        }, LOOKUP_DELAY_MS)
    }, { immediate: true })

    async function lookup(trimmed: string, current: number) {
        try {
            const next = await fetchFacilityMatchingMapsUrl(trimmed)
            if (current !== request) return
            found.value = next
        } catch (error) {
            if (current !== request) return
            console.error('Checking for an existing clinic failed', error)
            found.value = null
        }
    }

    onUnmounted(() => {
        if (timer) clearTimeout(timer)
        request += 1
    })

    return { match }
}
