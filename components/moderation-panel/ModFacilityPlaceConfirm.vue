<template>
    <div
        v-if="facilityId"
        class="mt-4 space-y-3"
        data-testid="mod-facility-place-confirm"
    >
        <p class="text-sm font-medium text-primary-text">
            {{ t('modFacilitySection.placeMatchHeading') }}
        </p>
        <p
            v-if="currentPlaceId"
            class="break-all text-sm text-primary-text-muted"
        >
            {{ t('modFacilitySection.placeMatchCurrent') }}: {{ currentPlaceId }}
        </p>
        <button
            type="button"
            class="btn btn-secondary btn-sm"
            :disabled="loading"
            data-testid="mod-facility-place-find"
            @click="findPlaces"
        >
            {{ t('modFacilitySection.placeMatchFind') }}
        </button>
        <p
            v-if="empty"
            class="text-sm text-primary-text-muted"
        >
            {{ t('modFacilitySection.placeMatchEmpty') }}
        </p>
        <p
            v-if="saveFailed"
            class="text-sm text-primary-text"
            role="alert"
        >
            {{ t('modFacilitySection.placeMatchError') }}
        </p>
        <ul
            v-if="candidates.length"
            class="space-y-3"
        >
            <li
                v-for="candidate in candidates"
                :key="candidate.placeId"
                class="rounded-lg border border-border-strong p-3"
            >
                <p class="font-medium text-primary-text">
                    {{ candidate.name }}
                </p>
                <p
                    v-if="candidate.category"
                    class="text-sm text-primary-text-muted"
                >
                    {{ candidate.category }}
                </p>
                <p
                    v-if="candidate.address"
                    class="text-sm text-primary-text"
                >
                    {{ candidate.address }}
                </p>
                <p class="text-sm text-primary-text-muted">
                    {{ candidate.confidence === 'HIGH'
                        ? t('modFacilitySection.placeMatchHigh')
                        : t('modFacilitySection.placeMatchLow') }}
                </p>
                <p class="text-xs text-primary-text-muted">
                    Google
                </p>
                <button
                    type="button"
                    class="btn btn-secondary btn-sm mt-2"
                    :disabled="savingId === candidate.placeId"
                    @click="savePlace(candidate.placeId)"
                >
                    {{ savedPlaceId === candidate.placeId
                        ? t('modFacilitySection.placeMatchSaved')
                        : t('modFacilitySection.placeMatchSave') }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '#imports'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import {
    confirmFacilityPlace,
    fetchFacilityPlaceCandidates,
    type FacilityPlaceCandidate
} from '~/utils/facilityPlace'

const { t, locale } = useI18n()
const facilityStore = useFacilitiesStore()

const candidates = ref<FacilityPlaceCandidate[]>([])
const loading = ref(false)
const empty = ref(false)
const saveFailed = ref(false)
const savingId = ref('')
const savedPlaceId = ref('')

const facilityId = computed(() => facilityStore.selectedFacilityData?.id ?? '')
const currentPlaceId = computed(() =>
    savedPlaceId.value || facilityStore.selectedFacilityData?.googlePlaceId || '')

watch(facilityId, () => {
    candidates.value = []
    empty.value = false
    saveFailed.value = false
    savingId.value = ''
    savedPlaceId.value = ''
})

async function findPlaces() {
    const fields = facilityStore.facilitySectionFields
    const latitude = Number(fields.mapLatitude)
    const longitude = Number(fields.mapLongitude)
    const address = [
        fields.addressLine1Ja,
        fields.cityJa,
        fields.prefectureJa,
        fields.addressLine1En
    ].filter(Boolean).join(' ')

    loading.value = true
    empty.value = false
    saveFailed.value = false
    try {
        candidates.value = await fetchFacilityPlaceCandidates({
            url: fields.googlemapsURL,
            nameEn: fields.nameEn,
            nameJa: fields.nameJa,
            address,
            latitude: Number.isFinite(latitude) ? latitude : null,
            longitude: Number.isFinite(longitude) ? longitude : null,
            languageCode: String(locale.value).startsWith('ja') ? 'ja' : 'en'
        })
        empty.value = candidates.value.length === 0
    } finally {
        loading.value = false
    }
}

async function savePlace(placeId: string) {
    if (!facilityId.value) return

    savingId.value = placeId
    saveFailed.value = false
    try {
        const confirmed = await confirmFacilityPlace(facilityId.value, placeId)
        if (!confirmed) {
            saveFailed.value = true
            return
        }

        savedPlaceId.value = confirmed
        if (facilityStore.selectedFacilityData) {
            facilityStore.selectedFacilityData.googlePlaceId = confirmed
        }
    } finally {
        savingId.value = ''
    }
}
</script>
