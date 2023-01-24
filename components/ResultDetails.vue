<template>
    <div class="result-details landscape:min-w-[480px]">
        <div class="header flex flex-1 bg-primary bg-gradient-to-r from-primary to-secondary">
            <svg role="img" alt="Facility Banner Image" title="banner image"
                class="banner-icon w-48 h-48 fill-primary-text-inverted ml-8 mb-4">
                <use xlink:href="../assets/images/doctors-icon.svg#doctors-icon-svg" />
            </svg>
        </div>
        <div class="result-header mt-4 ml-2">
            <span class="w-4 font-bold pl-2 self-center"> {{ name }} </span>
        </div>
        <div class="result-details flex my-1 ml-4 text-sm text-secondary/50">
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
    </div>
</template>

<script setup>
import { ref } from 'vue'

const dummyData = {
    name: 'test person 1',
    specialty: 'Practitioner',
    facilityName: 'LifeSavers',
    spokenLanguages: ['japanese', 'english']
}

const name = ref(dummyData.name)
const specialty = ref(dummyData.specialty)
const facilityName = ref(dummyData.facilityName)
const spokenLanguages = ref(dummyData.spokenLanguages)

</script>
