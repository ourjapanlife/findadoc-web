<template>
  <div class="result-details landscape:min-w-[480px]">
    <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
      <svg
        role="img"
        alt="Facility Banner Image"
        title="banner image"
        class="banner-icon w-48 h-48 fill-primary-text-inverted ml-8"
      >
        <use xlink:href="../assets/images/doctors-banner.svg#doctors-icon-svg" />
      </svg>
    </div>
    <div class="result-content ml-2">
      <div class="result-header mt-7 ml-4">
        <span class="w-4 text-3xl font-bold pl-2 self-center">{{ healthcareProfessionalName }}</span>
      </div>
      <div class="result-details flex mb-1 ml-4 pl-2 text-sm">
        <div class="flex" v-for="(specialty, index) in specialties">
          <span class="pr-2">{{ specialty }}</span>
          <span class="self-center">·</span>
        </div>
        <div class="self-center">·</div>
        <span class="px-2">{{ facilityName }}</span>
      </div>
      <div class="result-tags flex flex-wrap w-64 my-6 ml-4 pl-2">
        <div
          :key="index"
          v-for="(spokenLanguage, index) in spokenLanguages"
          class="pl-2 pr-2 py-[1px] mr-2 border-2 border-primary/40 rounded-full shadow-sm text-md text-primary hover:bg-primary/20 transition-all"
        >{{ spokenLanguage }}</div>
      </div>
      <div class="about ml-4 pl-2">
        <span class="font-semibold">About</span>
        <div class="address flex my-4">
          <svg
            role="img"
            alt="Facility Banner Image"
            title="banner image"
            class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
          >
            <use xlink:href="../assets/images/map-pin-icon.svg#map-pin-icon-svg" />
          </svg>
          {{ address }}
        </div>
        <div class="website flex my-4">
          <svg
            role="img"
            alt="Facility Banner Image"
            title="banner image"
            class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
          >
            <use xlink:href="../assets/images/globe-icon.svg#globe-icon-svg" />
          </svg>
          <a :href="website" v-if="website">{{ website }}</a>
        </div>
        <div class="phone flex my-4">
          <svg
            role="img"
            alt="Facility Banner Image"
            title="banner image"
            class="banner-icon w-6 h-6 stroke-primary mr-2 self-center"
          >
            <use xlink:href="../assets/images/phone-icon.svg#phone-icon-svg" />
          </svg>
          {{ phone }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLocaleStore } from "~/stores/localeStore.js";
import { useSearchResultsStore } from "~/stores/searchResultsStore";
import { Locale } from "~/typedefs/gqlTypes.js";

const resultsStore = useSearchResultsStore();
const localeStore = useLocaleStore();

const healthcareProfessionalName = computed(() => {
  const englishName = resultsStore.$state.activeResult?.professional.names.find(
    n => n.locale === Locale.EnUs
  );
  const japaneseName = resultsStore.$state.activeResult?.professional.names.find(
    n => n.locale === Locale.JaJp
  );
  const englishFullName = `${englishName?.firstName} ${englishName?.lastName}`;
  const japaneseFullName = `${japaneseName?.lastName} ${japaneseName?.firstName}`;
  return localeStore.locale.code === Locale.EnUs
    ? englishFullName
    : japaneseFullName;
});
const specialties = computed(() => {
  const specialties =
    resultsStore.$state.activeResult?.professional.specialties;

  const specialtiesDisplayText = specialties?.map(s => {
    const specialtyDisplayText = localeStore.localeDisplayOptions.find(
      l => l.code === s
    )?.simpleText;
    return specialtyDisplayText;
  });

  return specialtiesDisplayText;
});
const facilityName = computed(() => {
  const englishName = resultsStore.$state.activeResult?.facilities[0].nameEn;
  const japaneseName = resultsStore.$state.activeResult?.facilities[0].nameJa;
  return localeStore.locale.code === Locale.EnUs ? englishName : japaneseName;
});

const spokenLanguages = computed(
    () => {
        const languagesDisplayText = resultsStore.$state.activeResult?.professional.spokenLanguages?.map(s => {
            const languageDisplayText = localeStore.localeDisplayOptions.find(l => l.code === s)?.simpleText
            return languageDisplayText
        })

        return languagesDisplayText
    }
)

const address = computed(() => {
  const addressObj =
    resultsStore.$state.activeResult?.facilities[0].contact.address;
  const englishAddress = `${addressObj?.addressLine1En} ${addressObj?.addressLine2En}, ${addressObj?.cityEn}, ${addressObj?.prefectureEn} ${addressObj?.postalCode}`;
  const japaneseAddress = `${addressObj?.postalCode} ${addressObj?.prefectureJa}${addressObj?.cityJa}${addressObj?.addressLine1Ja}${addressObj?.addressLine2Ja}`;
  return localeStore.locale.code === Locale.EnUs
    ? englishAddress
    : japaneseAddress;
});
const website = computed(
  () => resultsStore.$state.activeResult?.facilities[0]?.contact?.website
);
const phone = computed(
  () => resultsStore.$state.activeResult?.facilities[0]?.contact?.phone
);
</script>

<style>
.hamburger-list-icon {
  --background-color: transparent;
  --second-background-color: --color-bg-secondary;
}
</style>
