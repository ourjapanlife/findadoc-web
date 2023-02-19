<template>
    <div class="result-details landscape:min-w-[480px]">
        <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
            <svg role="img" alt="Facility Banner Image" title="banner image"
                class="banner-icon w-48 h-48 fill-primary-text-inverted ml-8">
                <use xlink:href="../assets/images/doctors-banner.svg#doctors-icon-svg" />
            </svg>
        </div>
        <div class="result-header mt-4 ml-2">
            <span class="w-4 font-bold pl-2 self-center"> {{ name }} </span>
        </div>
        <div class="result-details flex my-1 ml-4 text-sm">
            <span class="pr-2"> {{ specialty }}</span>
            <span class="self-center">·</span>
            <span class="px-2"> {{ facilityName }}</span>
        </div>
        <div class="result-tags flex flex-wrap w-64 mb-2 mt-3 ml-4">
            <div :key="index" v-for="(spokenLanguage, index) in spokenLanguages"
                class="pl-2 pr-2 py-[1px] mr-2 border border-primary/40 rounded-full shadow text-sm hover:bg-primary/20 transition-all">
                {{ spokenLanguage }}
            </div>
        </div>
        <div class="about">
            <span>About</span>
            <div class="address flex">
                <svg role="img" alt="Facility Banner Image" title="banner image"
                    class="banner-icon w-4 h-4 fill-primary-text ml-2 mr-2 self-center">
                    <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                </svg>
                {{ address }}
            </div>
            <div class="hours flex">
                <svg role="img" alt="Facility Banner Image" title="banner image"
                    class="banner-icon w-4 h-4 fill-primary-text ml-2 mr-2 self-center">
                    <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                </svg>
                {{ hours }}
            </div>
            <div class="website flex">
                <svg role="img" alt="Facility Banner Image" title="banner image"
                    class="banner-icon w-4 h-4 fill-primary-text ml-2 mr-2 self-center">
                    <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                </svg>
                <a href="{website}"> {{ website }}</a>
            </div>
            <div class="phone flex">
                <svg role="img" alt="Facility Banner Image" title="banner image"
                    class="banner-icon w-4 h-4 fill-primary-text ml-2 mr-2 self-center">
                    <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                </svg>
                {{ phone }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dummyData = {
    name: 'test person 1',
    specialty: 'Practitioner',
    facilityName: 'LifeSavers',
    spokenLanguages: ['japanese', 'english'],
    address: '1-2-3 ShinTokyo',
    hours: '10am - 5pm',
    website: 'findadoc.jp',
    phone: '080-1234-4455'
}

const name = ref(dummyData.name)
const specialty = ref(dummyData.specialty)
const facilityName = ref(dummyData.facilityName)
const spokenLanguages = ref(dummyData.spokenLanguages)
const address = ref(dummyData.address)
const hours = ref(dummyData.hours)
const website = ref(dummyData.website)
const phone = ref(dummyData.phone)

</script>

<style>
.hamburger-list-icon {
    --background-color: transparent;
    --second-background-color: --color-bg-secondary;
}
</style>
