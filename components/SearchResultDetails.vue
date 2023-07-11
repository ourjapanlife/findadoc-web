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
                <span class="w-4 text-3xl font-bold pl-2 self-center"> {{ healthcareProfessionalName }} </span>
            </div>
            <div class="result-details flex mb-1 ml-4 pl-2 text-sm">
                <span class="pr-2"> {{ specialty }}</span>
                <span class="self-center">·</span>
                <span class="px-2"> {{ facilityName }}</span>
            </div>
            <div class="result-tags flex flex-wrap w-64 my-6 ml-4 pl-2">
                <div :key="index" v-for="(spokenLanguage, index) in spokenLanguages"
                    class="pl-2 pr-2 py-[1px] mr-2
                border-2 border-primary/40 rounded-full shadow-sm text-md text-primary hover:bg-primary/20 transition-all">
                    {{ spokenLanguage }}
                </div>
            </div>
            <div class="about ml-4 pl-2">
                <span class="font-semibold">About</span>
                <div class="address flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/map-pin-icon.svg#map-pin-icon-svg" />
                    </svg>
                    {{ address }}
                </div>
                <div class="hours flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/time-icon.svg#time-icon-svg" />
                    </svg>
                    {{ hours }}
                </div>
                <div class="website flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/globe-icon.svg#globe-icon-svg" />
                    </svg>
                    <a href="{website}"> {{ website }}</a>
                </div>
                <div class="phone flex my-4">
                    <svg role="img" alt="Facility Banner Image" title="banner image"
                        class="banner-icon w-6 h-6 stroke-primary mr-2 self-center">
                        <use xlink:href="../assets/images/phone-icon.svg#phone-icon-svg" />
                    </svg>
                    {{ phone }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocationStore } from '~/stores/locationStore'

const healthcareProfessionalName = ref(useLocationStore().$state.healthcareProfessionalName)
const specialty = ref(useLocationStore().$state.specialty)
const facilityName = ref(useLocationStore().$state.facilityName)
const spokenLanguages = ref(useLocationStore().$state.spokenLanguages)
const address = ref(useLocationStore().$state.address)
const hours = ref(useLocationStore().$state.hours)
const website = ref(useLocationStore().$state.website)
const phone = ref(useLocationStore().$state.phone)

</script>

<style>
.hamburger-list-icon {
  --background-color: transparent;
  --second-background-color: --color-bg-secondary;
}
</style>
