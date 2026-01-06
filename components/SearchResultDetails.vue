<template>
    <!-- Result Details -->
    <div
        class="result-details landscape:min-w-[480px] pt-5 landscape:pt-0 pb-[50vh] md:pb-6"
    >
        <!-- Banner -->
        <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
            <SVGDoctorsBanner
                role="img"
                alt="Facility Banner Image"
                title="banner image"
                class="w-48 h-48 fill-primary-text-inverted ml-8"
            />
        </div>
        <div class="result-content ml-2">
            <!-- Header -->
            <div class="result-header mt-7 ml-4">
                <template v-if="activeProfessional">
                    <span class="w-4 text-3xl font-bold pl-2 self-center">{{
                        healthcareProfessionalName
                    }}, </span>
                    <span class="w-4 text-2xl font-semibold pl-2 self-center">{{
                        healthcareProfessionalDegrees
                    }}</span>
                </template>
                <span
                    v-else
                    class="w-4 text-3xl font-bold pl-2 self-center"
                >
                    {{ facilityName }}
                </span>
            </div>
            <!-- Facility Or Hp Details -->
            <div class="result-details flex flex-col mb-1 ml-4 pl-2 mt-2 text-sm">
                <span
                    v-if="activeProfessional"
                    class="px-3 text-primary/90 font-medium text-lg"
                >{{
                    facilityName
                }}</span>
                <!-- Specialties -->
                <div
                    v-for="(specialty, index) in specialties"
                    :key="index"
                    class="flex"
                >
                    <span class="px-3 italic">{{ specialty }}</span>
                </div>
            </div>
            <!-- Healthcare Professionals Related to Facility -->
            <div v-if="!activeProfessional && hpNamesInFacility.length">
                <div class="about ml-4 pl-2">
                    <span class="font-semibold">{{ t("searchResultsDetails.healthcareProfessionals") }}:</span>
                </div>
                <div class="result-tags flex flex-col mb-2 mt-1 ml-6 pl-2">
                    <button
                        v-for="hp in hpNamesInFacility"
                        :key="hp.id"
                        class="flex items-center text-left py-1 px-3 w-full
                               text-primary hover:bg-primary/10 transition-colors cursor-pointer rounded-lg"
                        @click.stop="showProfessionalProfile(hp)"
                    >
                        <SVGProfileIcon
                            role="img"
                            alt="Healthcare Professional Icon"
                            class="w-7 h-7 stroke-primary mr-1"
                        />
                        <span class="underline">
                            {{ hp.displayName }}
                            ({{ hp.degrees.join(', ') }})
                        </span>
                    </button>
                </div>
            </div>
            <!-- Languages -->
            <div v-if="activeProfessional">
                <div class="ml-9 mt-2 font-bold text-sm">
                    <span>{{ t("searchResultsDetails.speaks") }}:</span>
                </div>
                <div class="result-tags flex flex-wrap w-64 mb-2 mt-1 ml-6 pl-2">
                    <div
                        v-for="(spokenLanguage, index) in spokenLanguages"
                        :key="index"
                        class="pl-2 pr-2 py-px mr-2 border-2 border-primary/40 rounded-full shadow-sm text-md
                    text-primary hover:bg-primary/20 transition-all"
                    >
                        {{ spokenLanguage }}
                    </div>
                </div>
            </div>
            <!-- Additional Info -->
            <div v-show="additionalInfoForPatients">
                <div
                    class="ml-9 mt-2 font-bold text-sm"
                >
                    <span>{{ t("searchResultsDetails.additionalInfo") }}:</span>
                </div>
                <div class="ml-9 mb-4 text-primary-text">
                    <p>{{ additionalInfoForPatients }}</p>
                </div>
            </div>
            <!-- Contact Details -->
            <div class="about mx-4 pl-2">
                <span class="font-semibold">{{
                    t("searchResultsDetails.contact")
                }}</span>
                <!-- Address -->
                <div class="address flex my-4">
                    <SVGMapPinIcon
                        role="img"
                        alt="Facility Banner Image"
                        title="banner image"
                        class="w-6 h-6 stroke-primary mr-2 self-center"
                    />
                    <div class="flex flex-col">
                        <a
                            :href="addressLink"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="underline text-blue"
                        >
                            <div>{{ addressLine1 }}</div>
                            <div v-if="addressLine2">
                                {{ addressLine2 }}
                            </div>
                        </a>
                    </div>
                </div>
                <!-- Website -->
                <div class="website flex my-4">
                    <SVGGlobeIcon
                        role="img"
                        alt="Facility Banner Image"
                        title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
                    />
                    <a
                        v-if="website"
                        :href="website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline text-blue"
                    >{{ website }}</a>
                </div>
                <!-- Phone -->
                <div class="phone flex my-4 items-center justify-between">
                    <div class="flex">
                        <SVGPhoneIcon
                            role="img"
                            alt="Facility Banner Image"
                            title="banner image"
                            class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
                        />
                        <a
                            v-if="phone"
                            class=" text-blue"
                        >{{ phone }}</a>
                    </div>
                    <a
                        v-if="phone"
                        class="mr-5 px-4 py-1 shadow-sm text-white rounded-lg bg-primary
                        font-medium hover:bg-primary/90 hover:scale-105 transition-colors"
                        :href="`tel:${phone}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        @click="handleCallNow"
                    >
                        {{ t("searchResultsDetails.callNow") }} ☎️
                    </a>
                </div>
                <!-- Email -->
                <div
                    v-if="email && !excludedEmailAddresses.includes(email)"
                    class="email flex my-4"
                >
                    <SVGEmailIcon
                        role="img"
                        alt="Facility Banner Image"
                        title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
                    />
                    <a
                        :href="`mailto:${email}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline text-blue"
                    >{{ email }}</a>
                </div>
                <!-- Last Updated Time -->
                <div class="mr-3 mb-1 flex flex-row-reverse text-sm text-primary-text-muted">
                    <p>{{ formattedLastUpdate }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGDoctorsBanner from '~/assets/icons/doctors-banner.svg'
import SVGMapPinIcon from '~/assets/icons/map-pin-icon.svg'
import SVGGlobeIcon from '~/assets/icons/globe-icon.svg'
import SVGPhoneIcon from '~/assets/icons/phone-icon.svg'
import SVGEmailIcon from '~/assets/icons/email-icon.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import { useLocaleStore } from '~/stores/localeStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { Locale } from '~/typedefs/gqlTypes.js'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { formatToReadableDate } from '~/utils/dateUtils'
import { useUmami } from '~/composables/useUmamiTracking'

const { t } = useI18n()

const resultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()
const bottomSheetStore = useBottomSheetStore()
const { track } = useUmami()

// Form Data
const activeProfessional = computed(() => resultsStore.activeProfessional)
const activeFacility = computed(() => resultsStore.activeFacility)

const healthcareProfessionalName = computed(() => {
    const name = formatHealthcareProfessionalName(
        activeProfessional.value?.names,
        localeStore.activeLocale.code as Locale
    )
    return name
})

const healthcareProfessionalDegrees = computed(() => activeProfessional.value?.degrees?.join(', '))

const specialties = computed(() => {
    const specialtiesList = activeProfessional.value?.specialties

    if (!specialtiesList || specialtiesList.length) return []

    const specialtiesDisplayText = specialtiesList
        .map(specialty => specialtiesStore.specialtyDisplayOptions.find(
            options => options.code === specialty
        )?.displayText)

    return specialtiesDisplayText
})

const facilityName = computed(() => {
    const facility = activeFacility.value
    if (!facility) return ''

    const englishName = facility.nameEn
    const japaneseName = facility.nameJa
    return localeStore.activeLocale.code === Locale.JaJp ? japaneseName : englishName
})

type MappedProfessional = {
    id: string
    displayName: string
    degrees: string[]
}

const hpNamesInFacility = computed(() => {
    const allProfessionals = activeFacility.value?.healthcareProfessionals
    const currentProfessionalId = activeProfessional.value?.id

    if (!allProfessionals || !allProfessionals.length) return []

    const localeCode = localeStore.activeLocale.code as Locale

    return allProfessionals
        .filter(hp => hp.id !== currentProfessionalId)
        .map(hp => ({
            id: hp.id,
            displayName: formatHealthcareProfessionalName(hp.names, localeCode),
            degrees: hp.degrees
        }))
})

function showProfessionalProfile(hp: MappedProfessional) {
    resultsStore.setActiveProfessional(hp.id)
    bottomSheetStore.showBottomSheet(BottomSheetType.SearchResultDetails)
    bottomSheetStore.isMinimized = false
}

const spokenLanguages = computed(() => {
    const languagesDisplayText
        = resultsStore.activeProfessional?.spokenLanguages?.map(
            s => {
                const languageDisplayText
                    = localeStore.localeDisplayOptions.find(
                        l => l.code === s
                    )?.simpleText
                return languageDisplayText
            }
        )

    return languagesDisplayText
})

const additionalInfoForPatients = computed(() => activeProfessional.value?.additionalInfoForPatients)

const addressObj = computed(() => activeFacility.value?.contact?.address)
const isJapaneseLocale = computed(() => localeStore.activeLocale.code === Locale.JaJp)

const addressLine1 = computed(() => {
    const address = addressObj.value
    if (!address) return ''

    const englishAddress = `${address.addressLine1En ?? ''} ${address.addressLine2En ?? ''}`

    const japaneseAddress = `${address.postalCode ?? ''} ${address.prefectureJa ?? ''}${address.cityJa ?? ''}${address.addressLine1Ja ?? ''}${address.addressLine2Ja ?? ''}`

    return isJapaneseLocale.value ? japaneseAddress : englishAddress
})

const addressLine2 = computed(() => {
    const address = addressObj.value
    if (!address || isJapaneseLocale.value) return ''

    return `${address.cityEn ?? ''}, ${address.prefectureEn ?? ''} ${address.postalCode ?? ''}`
})
const addressLink = computed(() => activeFacility.value?.contact?.googleMapsUrl)
const website = computed(() => activeFacility.value?.contact?.website)
const phone = computed(() => activeFacility.value?.contact?.phone)
const email = computed(() => activeFacility.value?.contact?.email ?? '')

const formattedLastUpdate = computed(() => {
    const unformattedDate = activeProfessional.value?.updatedDate
    if (unformattedDate) {
        return t('searchResultsDetails.lastUpdate') + ': ' + formatToReadableDate(unformattedDate)
    }
    return ''
})

const handleCallNow = () => {
    // logging data using umami
    track('Call button clicked', {
        facilityName: facilityName.value,
        professionalName: healthcareProfessionalName.value,
        phone: phone.value,
        email: email.value,
        website: website.value,
        addressLine1: addressLine1.value
    })
}

const excludedEmailAddresses = ['none', 'email@email.com']
</script>
