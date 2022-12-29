<template>
    <div class="flex flex-col">
        <div class="result-header flex flex-row">
            <img alt="profile icon" class="profile-icon w-4 flex-0" src="@/assets/images/profileIcon.svg" width="125"
                height="125" />
            <span class="flex-1 w-16"> {{ name }} </span>
        </div>
        <div class="result-details flex flex-row">
            <span class="basis-1/2"> {{ specialty }}</span>
            <span class="basis-1/2"> {{ facilityName }}</span>
        </div>
        <div class="result-tags flex flex-row flex-wrap">
            <div :key="index" v-for="(spokenLanguage, index) in spokenLanguages" class="w-2 border-radius">
                {{ spokenLanguage }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    facilityName: {
        type: String,
        required: true
    },
    spokenLanguages: {
        type: [String],
        required: true,
        validator(value) {
            // The value must match one of these strings
            return ['japanese', 'english'].includes(value)
        }
    }
})
</script>
