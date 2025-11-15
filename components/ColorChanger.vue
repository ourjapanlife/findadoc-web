<template>
    <div class="flex items-center gap-3">
        <div
            v-if="selected && lightDarkToggle"
            class="flex items-center gap-3 object-fill bg-secondary-bg size-full"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p>{{ name }}</p>
            <Toggle
                :state="lightMode"
                @theme-change="changeLightDark"
            />
        </div>
        <div
            v-else-if="selected"
            class="flex items-center gap-3 object-fill bg-secondary-bg size-full"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p>{{ name }}</p>
        </div>
        <!-- <div
            v-else-if="selected"
            class="w-7 h-7 mr-1 rounded-full"
            title="Original Theme"
            style="background-color:#0EB0C0"
        /> -->
        <div
            v-else
            class="w-7 h-7 mr-1 rounded-full"
            title="Original Theme"
        />
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

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
    }
})
</script>
