<template>
    <div class="search-result">
        <div class="result-header flex">
            <img alt="profile icon" class="profile-icon" src="@/assets/images/profile-icon.svg" width="25"
                height="25" />
            <span class="flex-1 w-4 font-bold pl-2"> {{ name }} </span>
        </div>
        <div class="result-details flex my-2">
            <span class="pr-2"> {{ specialty }}</span>
            <span class="self-center">·</span>
            <span class="px-2"> {{ facilityName }}</span>
        </div>
        <div class="result-tags flex flex-wrap w-64 mb-2">
            <div :key="index" v-for="(spokenLanguage, index) in spokenLanguages"
                class="pl-2 pr-2 py-[1px] mr-2 border border-orange/40 rounded-full shadow text-sm">
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
        type: Array,
        required: true,
        validator(arrayValue) {
            // must match accepted languages
            const acceptedLanguages = ['japanese', 'english']

            return arrayValue.every(x => acceptedLanguages.includes(x))
        }
    }
})
</script>
