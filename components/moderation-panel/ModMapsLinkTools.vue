<template>
    <div
        v-if="urlIsValid"
        class="mod-span-2 flex flex-col gap-2 rounded-lg border border-accent-bg bg-secondary-bg p-3"
        data-testid="mod-maps-link-tools"
    >
        <a
            :href="url"
            class="link inline-flex min-h-11 items-center break-all"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="mod-open-maps-link"
        >
            {{ url }}
        </a>
        <div class="flex flex-wrap gap-2">
            <a
                :href="url"
                class="btn btn-secondary btn-sm"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ t('modFacilitySection.openMaps') }}
            </a>
            <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-testid="mod-fill-from-maps"
                :disabled="filling"
                @click="fillEmptyFields"
            >
                {{ t('modFacilitySection.fillFromMaps') }}
            </button>
        </div>
        <p class="text-sm text-primary-text-muted">
            {{ t('modFacilitySection.fillFromMapsHint') }}
        </p>
        <p
            v-if="status"
            class="text-sm text-primary-text"
            role="status"
            data-testid="mod-fill-from-maps-status"
        >
            {{ status }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '#imports'
import { parseMapsPlace, validateGoogleMapsUrlInput } from '~/utils/formValidations'
import {
    fillEmptyFacilityFields,
    type FacilityMapsFillTarget
} from '~/utils/mapsAutofill'
import { fetchMapsPlaceDetails } from '~/utils/mapsPlaceDetails'

const props = defineProps<{
    url: string
    current: FacilityMapsFillTarget
}>()

const emit = defineEmits<{
    apply: [patch: Partial<FacilityMapsFillTarget>]
}>()

const { t } = useI18n()
const filling = ref(false)
const status = ref('')
const urlIsValid = computed(() => validateGoogleMapsUrlInput(props.url))

async function fillEmptyFields() {
    filling.value = true
    status.value = ''
    const parsed = parseMapsPlace(props.url)
    let nameEn: string | null = null
    let nameJa: string | null = null
    let addressEn: string | null = null
    let addressJa: string | null = null
    let failed = false

    try {
        const [english, japanese] = await Promise.all([
            fetchMapsPlaceDetails(props.url, 'en'),
            fetchMapsPlaceDetails(props.url, 'ja')
        ])
        nameEn = english?.name ?? null
        nameJa = japanese?.name ?? null
        addressEn = english?.address ?? null
        addressJa = japanese?.address ?? null
    } catch (error) {
        failed = true
        console.error('Reading a Maps link for autofill failed', error)
    } finally {
        filling.value = false
    }

    const patch = fillEmptyFacilityFields(props.current, {
        nameEn,
        nameJa,
        addressEn,
        addressJa,
        latitude: parsed?.latitude ?? null,
        longitude: parsed?.longitude ?? null
    })
    const filled = Object.keys(patch).length
    if (filled) emit('apply', patch)

    if (filled) {
        status.value = t('modFacilitySection.fillFromMapsDone', { count: filled })
        return
    }
    status.value = failed
        ? t('modFacilitySection.fillFromMapsFailed')
        : t('modFacilitySection.fillFromMapsNone')
}
</script>
