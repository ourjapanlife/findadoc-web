<template>
    <div class="flex items-center gap-3">
        <div
            v-if="selected && lightDarkToggle"
            class="flex items-center gap-3 object-fill bg-secondary-bg size-full p-3"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p class="text-primary">
                {{ name }}
            </p>
            <Toggle
                :state="state"
                @theme-change="changeLight"
            />
        </div>
        <div
            v-else-if="selected"
            class="flex items-center gap-3 object-fill bg-secondary-bg size-full p-3"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p class="text-primary">
                {{ name }}
            </p>
        </div>
        <!-- <div
            v-else-if="selected"
            class="w-7 h-7 mr-1 rounded-full"
            title="Original Theme"
            style="background-color:#0EB0C0"
        /> -->
        <div
            v-else
            class="flex items-center gap-3 object-fill size-full p-3"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p class="text-primary">
                {{ name }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    id: {
        type: String,
        required: true
    },
    dotColor: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    },
    lightDarkToggle: {
        type: Boolean,
        required: true
    },
    state: {
        type: Boolean
    }
})

const emit = defineEmits(['theme-change'])

const changeLight = isDarkMode => {
    console.log(isDarkMode)
    emit('theme-change', isDarkMode)
}
</script>
