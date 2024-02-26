<template>
    <div class="search-result">
        <div class="result-header ml-4">
            <svg role="img" alt="profile icon" title="profile icon" class="profile-icon w-8 h-8 stroke-primary inline">
                <use xlink:href="../assets/images/profile-icon.svg#profile-icon-svg" class="w-[20px] h-[20px]" />
            </svg>
            <span class="w-4 font-bold pl-2 self-center"> {{ name }}, </span>
            <span class="w-4 pl-2 font-semibold self-center">{{ degrees.length === 1 ? degrees[0] : degrees[0] + ", ... +" + (degrees.length - 1).toString() }}</span>
        </div>
        <div class="result-details flex flex-col my-2 ml-4">
            <span class="px-2 text-primary font-medium">
                {{ facilityName }}</span>
            <div class="flex" v-for="(specialty, index) in formattedSpecialties" :key="index">
                <span class="ml-2 pr-2 italic"> {{ specialty }}</span>
            </div>

            <div class="flex ml-2 mt-4">
                <svg role="img" alt="chat bubbles icon" title="chat bubbles icon"
                    class="chat-bubbles-icon w-8 h-8 stroke-primary inline">
                    <use xlink:href="../assets/images/chat-bubbles.svg#chat-bubbles-icon-svg" class="w-[20px] h-[20px]" />
                </svg>
                <div class="result-tags flex flex-wrap w-64 mb-2 mt-1 ml-1">
                    <div :key="index" v-for="(spokenLanguage, index) in formattedLanguages"
                        class="px-2 py-[1px] mr-2 border border-primary/40 rounded-full shadow text-sm hover:bg-primary/20 transition-all">
                        {{ spokenLanguage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useLocaleStore } from "~/stores/localeStore.js"
import { useSpecialtiesStore } from "~/stores/specialtiesStore.js"

const localStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    degrees: {
        type: Array,
        required: true,
    },
    specialties: {
        type: Array,
        required: true,
    },
    facilityName: {
        type: String,
        required: true,
    },
    spokenLanguages: {
        type: Array,
        required: true,
    },
})

const formattedSpecialties = computed(() => {
    const specialtiesDisplayText = props.specialties?.map((s) => {
        const specialtyDisplayText =
            specialtiesStore.specialtyDisplayOptions.find(
                (l) => l.code === s
            )?.displayText
        return specialtyDisplayText
    })

    return specialtiesDisplayText
})

const formattedLanguages = computed(() => {
    const languagesDisplayText = props.spokenLanguages?.map((s) => {
        const languageDisplayText = localStore.localeDisplayOptions.find(
            (l) => l.code === s
        )?.simpleText
        return languageDisplayText
    })

    return languagesDisplayText
})
</script>
