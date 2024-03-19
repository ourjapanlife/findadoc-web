<template>
    <div class="result-details landscape:min-w-[480px]">
        <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
            <svg role="img" alt="Facility Banner Image" title="banner image"
                class="banner-icon w-48 h-48 fill-primary-text-inverted ml-8">
                <use xlink:href="../assets/images/doctors-banner.svg#doctors-icon-svg" />
            </svg>
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
                <div class="flex" v-for="(specialty, index) in specialties" :key="index">
                    <span class="px-3 italic">{{ specialty }}</span>
                </div>
            </div>
            <div>
                <div class="ml-9 mt-2 font-bold text-sm">
                    <span>{{ $t("searchResultsDetails.speaks") }}:</span>
                </div>
                <div class="result-tags flex flex-wrap w-64 mb-6 mt-1 ml-6 pl-2">
                    <div :key="index" v-for="(spokenLanguage, index) in spokenLanguages"
                        class="pl-2 pr-2 py-[1px] mr-2 border-2 border-primary/40 rounded-full shadow-sm text-md text-primary hover:bg-primary/20 transition-all">
                        {{ spokenLanguage }}
                    </div>
                </div>
            </div>
            <div class="about ml-4 pl-2">
                <span class="font-semibold">{{
                    $t("searchResultsDetails.contact")
                }}</span>
                <div class="address flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/map-pin-icon.svg#map-pin-icon-svg" />
                    </svg>
                    <div class="flex flex-col">
                        <div>{{ addressLine1 }}</div>
                        <div v-if="addressLine2">{{ addressLine2 }}</div>
                    </div>
                </div>
                <div class="website flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/globe-icon.svg#globe-icon-svg" />
                    </svg>
                    <a :href="website" v-if="website">{{ website }}</a>
                </div>
                <div class="phone flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/phone-icon.svg#phone-icon-svg" />
                    </svg>
                    {{ phone }}
                </div>
                <div class="email flex my-4" v-if="!excludedEmailAddresses.includes(email)">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/email-icon.svg#email-icon-svg" />
                    </svg>
                    <a :href="`mailto:${email}`" class="email-link">{{ email }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLocaleStore } from "~/stores/localeStore.js"
import { useSpecialtiesStore } from "~/stores/specialtiesStore.js"
import { useSearchResultsStore } from "~/stores/searchResultsStore"
import { Locale } from "~/typedefs/gqlTypes.js"

const resultsStore = useSearchResultsStore()
const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const healthcareProfessionalName = computed(() => {
    const englishName =
        resultsStore.$state.activeResult?.professional.names.find(
            (n) => n.locale === Locale.EnUs
        )
    const japaneseName =
        resultsStore.$state.activeResult?.professional.names.find(
            (n) => n.locale === Locale.JaJp
        )
  
    const englishFullName = `${englishName?.firstName} ${englishName?.lastName}`
    const japaneseFullName = `${japaneseName?.lastName} ${japaneseName?.firstName}`

    switch (localeStore.locale.code) {
        case Locale.EnUs:
            return englishFullName ? englishFullName : japaneseFullName
        case Locale.JaJp:
            return japaneseFullName ? japaneseFullName : englishFullName
        default:
            return englishFullName ? englishFullName : japaneseFullName
    }
})
const healthcareProfessionalDegrees = computed(() => {
    const healthcareProfessionalDegreesText =
        resultsStore.$state.activeResult?.professional.degrees.join(", ")
    return healthcareProfessionalDegreesText
})
const specialties = computed(() => {
    const specialties =
        resultsStore.$state.activeResult?.professional.specialties

    const specialtiesDisplayText = specialties?.map((specialty) => {
        const specialtyDisplayText =
            specialtiesStore.specialtyDisplayOptions.find(
                (options) => options.code === specialty
            )?.displayText
        return specialtyDisplayText
    })

    return specialtiesDisplayText
})
const facilityName = computed(() => {
    const englishName = resultsStore.$state.activeResult?.facilities[0].nameEn
    const japaneseName = resultsStore.$state.activeResult?.facilities[0].nameJa
    return localeStore.locale.code === Locale.EnUs ? englishName : japaneseName
})

const spokenLanguages = computed(() => {
    const languagesDisplayText =
        resultsStore.$state.activeResult?.professional.spokenLanguages?.map(
            (s) => {
                const languageDisplayText =
                    localeStore.localeDisplayOptions.find(
                        (l) => l.code === s
                    )?.simpleText
                return languageDisplayText
            }
        )

    return languagesDisplayText
})

const addressLine1 = computed(() => {
    const addressObj =
        resultsStore.$state.activeResult?.facilities[0].contact.address

    const englishAddress = `${addressObj?.addressLine1En} ${addressObj?.addressLine2En}`
    const japaneseAddress = `${addressObj?.postalCode} ${addressObj?.prefectureJa}${addressObj?.cityJa}${addressObj?.addressLine1Ja}${addressObj?.addressLine2Ja}`
    return localeStore.locale.code === Locale.EnUs
        ? englishAddress
        : japaneseAddress
})
const addressLine2 = computed(() => {
    const addressObj =
        resultsStore.$state.activeResult?.facilities[0].contact.address

    const englishAddress = `${addressObj?.cityEn}, ${addressObj?.prefectureEn} ${addressObj?.postalCode}`
    return localeStore.locale.code === Locale.EnUs ? englishAddress : ""
})
const website = computed(
    () => resultsStore.$state.activeResult?.facilities[0]?.contact?.website
)
const phone = computed(
    () => resultsStore.$state.activeResult?.facilities[0]?.contact?.phone
)
const email = computed(
    () => resultsStore.$state.activeResult?.facilities[0]?.contact?.email
)

const excludedEmailAddresses = ['none', 'email@email.com'];
</script>

<style>
.hamburger-list-icon {
  --background-color: transparent;
  --second-background-color: --color-bg-secondary;
}
</style>
