<template>
    <div
        data-testid="doctor-details"
        class="flex flex-col gap-8"
    >
        <header class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
                <h1
                    id="doctor-details-title"
                    class="text-2xl font-bold leading-tight text-primary-text"
                >
                    {{ displayName }}
                </h1>
                <p
                    v-if="otherLanguageName"
                    class="m-0 text-lg text-primary-text-muted"
                    data-testid="doctor-other-name"
                >
                    {{ otherLanguageName }}
                </p>
                <p
                    v-if="degrees"
                    class="m-0 text-primary-text-muted"
                >
                    {{ degrees }}
                </p>
            </div>
        </header>

        <section
            v-if="specialties.length"
            class="flex flex-col gap-3"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ t('doctorPage.specialties') }}
            </h2>
            <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                <li
                    v-for="specialty in specialties"
                    :key="specialty"
                    class="chip chip-primary h-7 px-2.5 text-xs"
                >
                    {{ specialty }}
                </li>
            </ul>
        </section>

        <section
            v-if="languages.length"
            class="flex flex-col gap-3"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ t('doctorPage.languages') }}
            </h2>
            <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                <li
                    v-for="languageName in languages"
                    :key="languageName"
                    class="chip h-7 px-2.5 text-xs"
                >
                    {{ languageName }}
                </li>
            </ul>
        </section>

        <section
            v-if="insurance.length"
            class="flex flex-col gap-3"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ t('doctorPage.insurance') }}
            </h2>
            <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                <li
                    v-for="label in insurance"
                    :key="label"
                    class="chip h-7 px-2.5 text-xs"
                >
                    {{ label }}
                </li>
            </ul>
        </section>

        <section
            v-if="additionalInfo"
            class="flex flex-col gap-3"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ t('doctorPage.additionalInfo') }}
            </h2>
            <p class="m-0 whitespace-pre-line text-primary-text">
                {{ additionalInfo }}
            </p>
        </section>

        <section
            v-if="facilities.length"
            class="flex flex-col gap-3"
        >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ t('doctorPage.facilities') }}
            </h2>
            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                <li
                    v-for="facility in facilities"
                    :key="facility.id"
                    data-testid="doctor-facility"
                    class="card flex flex-col gap-1 p-4"
                >
                    <NuxtLink
                        :to="facility.path"
                        class="text-lg font-semibold leading-snug text-primary hover:underline"
                    >
                        {{ facility.name }}
                    </NuxtLink>
                    <p
                        v-if="facility.address"
                        class="m-0 text-sm text-primary-text-muted"
                    >
                        {{ facility.address }}
                    </p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeDisplayOptions } from '~/stores/localeStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { isJapaneseLocale, toGqlLocale } from '~/utils/activeLocale'
import { facilityPath } from '~/utils/clinicPath'
import type { ProfessionalSearchResult } from '~/utils/clinicPrerender'
import { Insurance, Locale, type LocalizedName } from '~/typedefs/gqlTypes'

const props = defineProps<{
    professional: ProfessionalSearchResult
}>()

const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()

const isJapanese = computed(() => isJapaneseLocale(locale.value))
const gqlLocale = computed(() => toGqlLocale(locale.value))

const displayName = computed(() => formatHealthcareProfessionalName(props.professional.names, gqlLocale.value))

function formatOneName(name: LocalizedName): string {
    const first = name.firstName?.trim() ?? ''
    const last = name.lastName?.trim() ?? ''
    if (!first && !last) {
        return ''
    }
    return name.locale === Locale.JaJp ? `${last} ${first}`.trim() : `${first} ${last}`.trim()
}

const otherLanguageName = computed(() => {
    const names = (props.professional.names ?? [])
        .map(formatOneName)
        .filter(name => name && name !== displayName.value)

    return [...new Set(names)][0] ?? ''
})

const degrees = computed(() => (props.professional.degrees ?? []).join(', '))

const specialties = computed(() => (props.professional.specialties ?? [])
    .map(code => specialtiesStore.specialtyDisplayOptions.find(option => option.code === code)?.displayText)
    .filter((name): name is string => !!name))

const languages = computed(() => (props.professional.spokenLanguages ?? [])
    .map(code => localeDisplayOptions.find(option => option.code === code)?.simpleText)
    .filter((name): name is string => !!name))

function insuranceLabel(code: Insurance): string {
    switch (code) {
        case Insurance.InsuranceNotAccepted:
            return t('doctorPage.insuranceLabels.INSURANCE_NOT_ACCEPTED')
        case Insurance.InternationalHealthInsurance:
            return t('doctorPage.insuranceLabels.INTERNATIONAL_HEALTH_INSURANCE')
        case Insurance.JapaneseHealthInsurance:
            return t('doctorPage.insuranceLabels.JAPANESE_HEALTH_INSURANCE')
        case Insurance.TravelInsurance:
            return t('doctorPage.insuranceLabels.TRAVEL_INSURANCE')
        case Insurance.Uninsured:
            return t('doctorPage.insuranceLabels.UNINSURED')
        default:
            return code
    }
}

const insurance = computed(() => (props.professional.acceptedInsurance ?? []).map(insuranceLabel))

const additionalInfo = computed(() => props.professional.additionalInfoForPatients?.trim() ?? '')

const facilities = computed(() => props.professional.facilities.map(facility => {
    const address = facility.contact?.address
    const addressText = isJapanese.value
        ? `${address?.prefectureJa ?? ''}${address?.cityJa ?? ''}`
        : [address?.cityEn, address?.prefectureEn].filter(Boolean).join(', ')

    return {
        id: facility.id,
        path: facilityPath(facility),
        name: (isJapanese.value ? facility.nameJa : facility.nameEn) || facility.nameEn,
        address: addressText
    }
}))
</script>
