<template>
    <div
        data-testid="search-result-details"
        class="flex flex-col gap-8"
    >
        <header class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
                <h2
                    id="search-details-title"
                    class="text-2xl font-bold leading-tight text-primary-text"
                >
                    {{ facilityName }}
                </h2>
                <p class="m-0 text-primary-text-muted">
                    {{ addressLine1 }}
                    <template v-if="addressLine2">
                        <br>{{ addressLine2 }}
                    </template>
                </p>
            </div>

            <div class="mt-1 flex flex-wrap gap-2">
                <a
                    v-if="phone"
                    :href="`tel:${phoneHref}`"
                    data-testid="search-details-call"
                    class="btn btn-primary btn-sm"
                    @click="handleCallNow"
                >
                    <SVGPhoneIcon
                        class="h-4 w-4 stroke-current"
                        aria-hidden="true"
                    />
                    {{ t('searchResultsDetails.callNow') }}
                </a>
                <a
                    v-if="website"
                    :href="website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-secondary btn-sm"
                >
                    <SVGGlobeIcon
                        class="h-4 w-4 stroke-current"
                        aria-hidden="true"
                    />
                    {{ t('search.website') }}
                </a>
                <a
                    v-if="mapsUrl"
                    :href="mapsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-secondary btn-sm"
                >
                    <SVGMapPinIcon
                        class="h-4 w-4 stroke-current"
                        aria-hidden="true"
                    />
                    {{ t('search.openInMaps') }}
                </a>
                <a
                    v-if="email"
                    :href="`mailto:${email}`"
                    class="btn btn-secondary btn-sm"
                >
                    <SVGEmailIcon
                        class="h-4 w-4 stroke-current"
                        aria-hidden="true"
                    />
                    {{ t('search.email') }}
                </a>
            </div>

            <dl
                v-if="phone || website"
                class="m-0 flex flex-col gap-1 text-sm text-primary-text-muted"
            >
                <div
                    v-if="phone"
                    class="flex gap-2"
                >
                    <dt class="font-semibold">
                        {{ t('search.phone') }}
                    </dt>
                    <dd class="m-0 select-all">
                        {{ phone }}
                    </dd>
                </div>
                <div
                    v-if="website"
                    class="flex min-w-0 gap-2"
                >
                    <dt class="shrink-0 font-semibold">
                        {{ t('search.website') }}
                    </dt>
                    <dd class="m-0 min-w-0 truncate">
                        {{ websiteLabel }}
                    </dd>
                </div>
            </dl>
        </header>

        <section class="flex flex-col gap-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                {{ professionalsCountText }}
            </h3>
            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                <li
                    v-for="professional in professionals"
                    :key="professional.id"
                    data-testid="search-details-professional"
                    class="card flex flex-col gap-3 p-4"
                >
                    <div class="flex flex-col">
                        <p class="m-0 text-lg font-semibold leading-snug text-primary-text">
                            {{ professional.name }}
                        </p>
                        <p
                            v-if="professional.degrees"
                            class="m-0 text-sm text-primary-text-muted"
                        >
                            {{ professional.degrees }}
                        </p>
                    </div>
                    <p
                        v-if="professional.specialties"
                        class="m-0 text-primary-text"
                    >
                        {{ professional.specialties }}
                    </p>
                    <div
                        v-if="professional.languages.length"
                        class="flex flex-col gap-1.5"
                    >
                        <span class="text-xs font-semibold uppercase tracking-wide text-primary-text-muted">
                            {{ t('searchResultsDetails.speaks') }}
                        </span>
                        <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                            <li
                                v-for="languageName in professional.languages"
                                :key="languageName"
                                class="chip chip-primary h-7 px-2.5 text-xs"
                            >
                                {{ languageName }}
                            </li>
                        </ul>
                    </div>
                    <p
                        v-if="professional.additionalInfo"
                        class="m-0 whitespace-pre-line text-sm text-primary-text-muted"
                    >
                        {{ professional.additionalInfo }}
                    </p>
                    <p
                        v-if="professional.updated"
                        class="m-0 text-xs text-primary-text-muted"
                    >
                        {{ t('searchResultsDetails.lastUpdate') }}: {{ professional.updated }}
                    </p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGMapPinIcon from '~/assets/icons/map-pin-icon.svg'
import SVGGlobeIcon from '~/assets/icons/globe-icon.svg'
import SVGPhoneIcon from '~/assets/icons/phone-icon.svg'
import SVGEmailIcon from '~/assets/icons/email-icon.svg'
import { localeDisplayOptions } from '~/stores/localeStore'
import { useSpecialtiesStore } from '~/stores/specialtiesStore'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { isJapaneseLocale, toGqlLocale } from '~/utils/activeLocale'
import { formatToReadableDate } from '~/utils/dateUtils'
import { useUmami } from '~/composables/useUmamiTracking'
import { facilityEmail,
    facilityMapsUrl,
    facilityPhone,
    facilityPhoneHref,
    facilityWebsiteLabel,
    facilityWebsiteUrl,
    type FacilitySearchResult } from '~/utils/searchDirectory'

const props = defineProps<{ facility: FacilitySearchResult }>()

const { t, locale } = useI18n()
const specialtiesStore = useSpecialtiesStore()
const { track } = useUmami()

// Keyed off vue-i18n, not localeStore: the store lags behind a cookie-driven locale.
const isJapanese = computed(() => isJapaneseLocale(locale.value))

const facilityName = computed(() => (isJapanese.value ? props.facility.nameJa : props.facility.nameEn) || props.facility.nameEn)

const address = computed(() => props.facility.contact?.address)

const addressLine1 = computed(() => {
    const value = address.value
    if (!value) return ''

    return isJapanese.value
        ? `${value.postalCode ?? ''} ${value.prefectureJa ?? ''}${value.cityJa ?? ''}${value.addressLine1Ja ?? ''}${value.addressLine2Ja ?? ''}`.trim()
        : `${value.addressLine1En ?? ''} ${value.addressLine2En ?? ''}`.trim()
})

const addressLine2 = computed(() => {
    const value = address.value
    if (!value || isJapanese.value) return ''

    return `${value.cityEn ?? ''}, ${value.prefectureEn ?? ''} ${value.postalCode ?? ''}`.trim()
})

/*
 * Every contact value goes through a normaliser rather than straight into an href. These are
 * volunteer-entered free text: websites arrive without a scheme (which an <a> reads as a
 * relative path, so the button silently navigated inside our own site), and several fields
 * carry placeholders like "none" that should show no control at all.
 */
const mapsUrl = computed(() => facilityMapsUrl(props.facility, isJapanese.value))
const website = computed(() => facilityWebsiteUrl(props.facility))
const websiteLabel = computed(() => facilityWebsiteLabel(props.facility))
const phone = computed(() => facilityPhone(props.facility))
const phoneHref = computed(() => facilityPhoneHref(props.facility))
const email = computed(() => facilityEmail(props.facility))

const professionals = computed(() => props.facility.healthcareProfessionals.map(professional => ({
    id: professional.id,
    name: formatHealthcareProfessionalName(professional.names, toGqlLocale(locale.value)),
    degrees: (professional.degrees ?? []).join(', '),
    specialties: (professional.specialties ?? [])
        .map(code => specialtiesStore.specialtyDisplayOptions.find(option => option.code === code)?.displayText)
        .filter(Boolean)
        .join(', '),
    languages: (professional.spokenLanguages ?? [])
        .map(code => localeDisplayOptions.find(option => option.code === code)?.simpleText)
        .filter((name): name is string => !!name),
    additionalInfo: professional.additionalInfoForPatients ?? '',
    updated: professional.updatedDate ? formatToReadableDate(professional.updatedDate) : ''
})))

// In script rather than the template: i18n/cleanUnusedLocaleKeys.js only sees template t() calls with no second argument.
const professionalsCountText = computed(() => t('search.professionalsAtFacility', professionals.value.length))

function handleCallNow() {
    track('Call button clicked', {
        facilityName: facilityName.value,
        phone: phone.value,
        website: website.value,
        addressLine1: addressLine1.value
    })
}
</script>
