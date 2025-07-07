<template>
    <div class="search-result">
        <div class="result-header ml-4">
            <SVGProfileIcon
                role="img"
                alt="profile icon"
                title="profile icon"
                class="profile-icon w-8 h-8 stroke-primary inline"
            />
            <span class="w-4 font-bold pl-2 self-center"> {{ name }}, </span>
            <span class="w-4 pl-2 font-semibold self-center">{{
                degrees.length === 1
                    ? degrees[0]
                    : degrees[0] + ", ... +" + (degrees.length - 1).toString()
            }}</span>
        </div>
        <div class="result-details flex flex-col my-2 ml-4">
            <span class="px-2 text-primary font-medium">
                {{ facilityName }}</span>
            <div
                v-for="(specialty, index) in formattedSpecialties"
                :key="index"
                class="flex"
            >
                <span class="ml-2 pr-2 italic"> {{ specialty }}</span>
            </div>

            <div class="flex ml-2 mt-4">
                <SVGChatBubblesIcon
                    role="img"
                    alt="chat bubbles icon"
                    title="chat bubbles icon"
                    class="chat-bubbles-icon w-8 h-8 stroke-primary inline"
                />
                <div class="result-tags flex flex-wrap w-64 mb-2 mt-1 ml-1">
                    <div
                        v-for="(spokenLanguage, index) in formattedLanguages"
                        :key="index"
                        class="px-2 py-[1px] mr-2 border border-primary/40 rounded-full shadow text-sm
                        hover:bg-primary/20 transition-all"
                    >
                        {{ spokenLanguage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import SVGChatBubblesIcon from '~/assets/icons/chat-bubbles.svg'
import { useLocaleStore } from '~/stores/localeStore.js'
import { useSpecialtiesStore } from '~/stores/specialtiesStore.js'
import type { Locale } from '~/typedefs/gqlTypes'

const localeStore = useLocaleStore()
const specialtiesStore = useSpecialtiesStore()

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    degrees: {
        type: Array,
        required: true
    },
    specialties: {
        type: Array,
        required: true
    },
    facilityName: {
        type: String,
        required: true
    },
    spokenLanguages: {
        type: Array<Locale>,
        required: true
    }
})

const formattedSpecialties = computed(() => {
    const specialtiesDisplayText = props.specialties?.map(s => {
        const specialtyDisplayText
            = specialtiesStore.specialtyDisplayOptions.find(
                l => l.code === s
            )?.displayText
        return specialtyDisplayText
    })

    return specialtiesDisplayText
})

const formattedLanguages = computed(() => localeStore.formatLanguages(props.spokenLanguages, localeStore.localeDisplayOptions))
</script>
