<template>
    <div class="mod-picker">
        <label
            class="field-label"
            for="primary-license"
        >
            {{ t('modHealthcareProfessionalSection.selectPrimaryLicense') }}
        </label>
        <select
            id="primary-license"
            data-testid="mod-healthcare-professional-primary-license"
            class="field"
            :disabled="keepBoth"
            :value="primaryLicense"
            @change="onPrimaryChange"
        >
            <option value="">
                {{ t('modHealthcareProfessionalSection.placeholderPrimaryLicense') }}
            </option>
            <option
                v-for="license in PICKER_PRIMARY_LICENSES"
                :key="license"
                :value="license"
            >
                {{ license }}
            </option>
        </select>
        <p
            v-if="recommendationText"
            class="mt-2 text-sm text-primary-text-muted"
            data-testid="mod-license-recommendation"
        >
            {{ recommendationText }}
        </p>
        <label
            v-if="recommendation"
            class="mt-2 flex items-center gap-2 text-sm text-primary-text"
        >
            <input
                data-testid="mod-keep-both-licenses"
                type="checkbox"
                :checked="keepBoth"
                @change="onKeepBothChange"
            >
            {{ t('modHealthcareProfessionalSection.keepBothLicenses') }}
        </label>
    </div>
    <div class="mod-picker">
        <label
            class="field-label"
            for="additional-credentials"
        >
            {{ t('modHealthcareProfessionalSection.selectAdditionalCredentials') }}
        </label>
        <ModSearchBar
            v-model="credentialsModel"
            data-testid="mod-healthcare-professional-additional-credentials"
            :place-holder-text="t('modHealthcareProfessionalSection.placeholderAdditionalCredentials')"
            :no-match-text="t('modHealthcareProfessionalSection.noDegreesWereFound')"
            :fields-to-display-callback="credentialLabel"
            :default-suggestions="[...PICKER_CREDENTIALS]"
            @search-input-change="onCredentialSearch"
        />
        <ModTokenList :labels="additionalCredentials" />
        <p
            v-if="hiddenDegrees.length"
            class="mt-2 text-sm text-primary-text-muted"
        >
            {{ t('modHealthcareProfessionalSection.storedHiddenDegrees', { degrees: hiddenDegrees.join(', ') }) }}
        </p>
        <p class="mt-2 text-sm text-primary-text-muted">
            {{ t('modHealthcareProfessionalSection.listingShowsSavedDegrees') }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { LicenseReviewStatus, type Degree, type Maybe } from '~/typedefs/gqlTypes'
import { filterByCaseInsensitiveIncludes } from '~/utils/moderationSearchUtils'
import {
    PICKER_CREDENTIALS,
    PICKER_PRIMARY_LICENSES,
    degreesFromForm,
    formStateFromDegrees,
    type LicenseRecommendation
} from '~/utils/professionalLicense'
import { useI18n } from '#imports'

const props = defineProps<{
    degrees?: Degree[] | null
    licenseReview?: Maybe<LicenseReviewStatus>
}>()

const emit = defineEmits<{
    'update:degrees': [degrees: Degree[]]
    'update:licenseReview': [licenseReview: LicenseReviewStatus | null]
}>()

const { t } = useI18n()

const primaryLicense = ref<Degree | ''>('')
const additionalCredentials = ref<Degree[]>([])
const keepBoth = ref(false)
const preservedClinicalLicenses = ref<Degree[]>([])
const hiddenDegrees = ref<Degree[]>([])
const recommendation = ref<LicenseRecommendation | null>(null)

const recommendationText = computed(() => {
    if (!recommendation.value || keepBoth.value) {
        return ''
    }
    if (recommendation.value === 'MD') {
        return t('modHealthcareProfessionalSection.licenseRecommendationMd')
    }
    if (recommendation.value === 'one_dental_license') {
        return t('modHealthcareProfessionalSection.licenseRecommendationDental')
    }
    return t('modHealthcareProfessionalSection.licenseRecommendationConfirm')
})

function load(
    degrees: readonly Degree[] | null | undefined,
    licenseReview: Maybe<LicenseReviewStatus> | undefined
) {
    const state = formStateFromDegrees(degrees)
    primaryLicense.value = state.primaryLicense ?? ''
    additionalCredentials.value = [...state.additionalCredentials]
    preservedClinicalLicenses.value = [...state.preservedClinicalLicenses]
    hiddenDegrees.value = [...state.hiddenDegrees]
    recommendation.value = state.recommendation
    const confirmedDual = licenseReview === LicenseReviewStatus.Confirmed
    keepBoth.value = confirmedDual && state.preservedClinicalLicenses.length > 1
}

watch(
    () => [props.degrees, props.licenseReview] as const,
    () => load(props.degrees, props.licenseReview),
    { immediate: true }
)

function publish() {
    emit('update:degrees', degreesFromForm({
        primaryLicense: primaryLicense.value || null,
        additionalCredentials: additionalCredentials.value,
        preservedClinicalLicenses: preservedClinicalLicenses.value,
        hiddenDegrees: hiddenDegrees.value,
        keepBoth: keepBoth.value
    }))
    emit('update:licenseReview', keepBoth.value ? LicenseReviewStatus.Confirmed : null)
}

function onPrimaryChange(event: Event) {
    primaryLicense.value = (event.target as HTMLSelectElement).value as Degree | ''
    if (primaryLicense.value) {
        keepBoth.value = false
    }
    publish()
}

const credentialsModel = computed({
    get: () => additionalCredentials.value,
    set: (value: Degree[]) => {
        additionalCredentials.value = value
        publish()
    }
})

function onKeepBothChange(event: Event) {
    keepBoth.value = (event.target as HTMLInputElement).checked
    if (keepBoth.value) {
        primaryLicense.value = ''
    }
    publish()
}

function onCredentialSearch(filteredItems: Ref<Degree[]>, inputValue: string) {
    filteredItems.value = filterByCaseInsensitiveIncludes([...PICKER_CREDENTIALS], inputValue)
}

function credentialLabel(credential: Degree) {
    return [credential]
}
</script>
