<template>
    <div class="result-details landscape:min-w-[480px]">
        <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
            <SVGDoctorsBanner
                role="img"
                alt="Facility Banner Image"
                title="banner image"
                class="w-48 h-48 fill-primary-text-inverted ml-8"
            />
        </div>
        <div class="result-content ml-2">
            <div class="result-header mt-7 ml-4">
                <span class="w-4 text-3xl font-bold pl-2 self-center">{{
                    healthcareProfessionalName
                }}, </span>
                <span class="w-4 text-2xl font-semibold pl-2 self-center">{{
                    healthcareProfessionalDegrees
                }}</span>
            </div>
            <div class="result-details flex flex-col mb-1 ml-4 pl-2 mt-2 text-sm">
                <span class="px-3 text-primary/90 font-medium text-lg">{{
                    facilityName
                }}</span>
                <div
                    v-for="(specialty, index) in specialties"
                    :key="index"
                    class="flex"
                >
                    <span class="px-3 italic">{{ specialty }}</span>
                </div>
            </div>
            <div>
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
            <div class="about ml-4 pl-2">
                <span class="font-semibold">{{
                    t("searchResultsDetails.contact")
                }}</span>
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
                <div class="phone flex my-4">
                    <SVGPhoneIcon
                        role="img"
                        alt="Facility Banner Image"
                        title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
                    />
                    <a
                        v-if="phone"
                        :href="`tel:${phone}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline text-blue"
                    >{{ phone }}</a>
                </div>
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
                <div class="mr-3 mb-1 flex flex-row-reverse text-sm text-primary-text-muted">
                    <p>{{ formattedLastUpdate }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SVGDoctorsBanner from '~/assets/icons/doctors-banner.svg'
import SVGMapPinIcon from '~/assets/icons/map-pin-icon.svg'
import SVGGlobeIcon from '~/assets/icons/globe-icon.svg'
import SVGPhoneIcon from '~/assets/icons/phone-icon.svg'
import SVGEmailIcon from '~/assets/icons/email-icon.svg'
import { useLocaleStore } from '~/stores/localeStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import { useSearchResultsStore } from '~/stores/searchResultsStore'
import { Locale } from '~/typedefs/gqlTypes.js'
import { formatHealthcareProfessionalName } from '~/utils/nameUtils'
import { formatToReadableDate } from '~/utils/dateUtils'

const { t } = useI18n()

const resultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const healthcareProfessionalName = computed(() => {
    const name = formatHealthcareProfessionalName(
        resultsStore.activeResult?.professional.names,
        localeStore.activeLocale.code as Locale
    )
    return name
})

const healthcareProfessionalDegrees = computed(() => {
    const healthcareProfessionalDegreesText
        = resultsStore.activeResult?.professional.degrees.join(', ')
    return healthcareProfessionalDegreesText
})
const specialties = computed(() => {
    const specialties
        = resultsStore.activeResult?.professional.specialties

    const specialtiesDisplayText = specialties?.map(specialty => {
        const specialtyDisplayText
            = specialtiesStore.specialtyDisplayOptions.find(
                options => options.code === specialty
            )?.displayText
        return specialtyDisplayText
    })

    return specialtiesDisplayText
})
const facilityName = computed(() => {
    const englishName = resultsStore.activeResult?.facilities[0].nameEn
    const japaneseName = resultsStore.activeResult?.facilities[0].nameJa
    return localeStore.activeLocale.code === Locale.JaJp ? japaneseName : englishName
})

const spokenLanguages = computed(() => {
    const languagesDisplayText
        = resultsStore.activeResult?.professional.spokenLanguages?.map(
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

const additionalInfoForPatients = computed(() => resultsStore.activeResult?.professional.additionalInfoForPatients)

const addressLine1 = computed(() => {
    const addressObj
        = resultsStore.activeResult?.facilities[0].contact.address

    const englishAddress = `${addressObj?.addressLine1En} ${addressObj?.addressLine2En}`
    const japaneseAddress = `${addressObj?.postalCode} ${addressObj?.prefectureJa}${addressObj?.cityJa}${addressObj?.addressLine1Ja}${addressObj?.addressLine2Ja}`
    return localeStore.activeLocale.code === Locale.JaJp
        ? japaneseAddress
        : englishAddress
})
const addressLine2 = computed(() => {
    const addressObj
        = resultsStore.activeResult?.facilities[0].contact.address

    const englishAddress = `${addressObj?.cityEn}, ${addressObj?.prefectureEn} ${addressObj?.postalCode}`
    return localeStore.activeLocale.code !== Locale.JaJp ? englishAddress : ''
})
const addressLink = computed(
    () => resultsStore.activeResult?.facilities[0].contact.googleMapsUrl
)
const website = computed(
    () => resultsStore.activeResult?.facilities[0]?.contact?.website
)
const phone = computed(
    () => resultsStore.activeResult?.facilities[0]?.contact?.phone
)
const email = computed(
    () => resultsStore.activeResult?.facilities[0]?.contact?.email ?? ''
)

const formattedLastUpdate = computed(() => {
    const unformattedDate = resultsStore.activeResult?.professional.updatedDate
    if (unformattedDate) {
        return t('searchResultsDetails.lastUpdate') + ': ' + formatToReadableDate(unformattedDate)
    }
    return ''
})

const excludedEmailAddresses = ['none', 'email@email.com']
</script>

<style>
.hamburger-list-icon {
    --background-color: transparent;
    --second-background-color: --color-bg-secondary;
}
</style>
