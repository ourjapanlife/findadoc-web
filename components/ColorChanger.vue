<template>
    <div class="flex items-center gap-3">
        <div
            v-if="selected"
            class="flex items-center place-content-between bg-secondary-bg size-full px-4 py-3 z-0"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-7 h-7 mr-1 rounded-full"
                    title="Original Theme"
                    :style="{ backgroundColor: dotColor }"
                />
                <p class="text-primary max-w-32">
                    {{ name }}
                </p>
            </div>
            <Toggle
                :state="state"
                @theme-change="toggleLightDarkMode"
            />
        </div>

        <div
            v-else
            class="flex items-center gap-3 object-fill size-full px-4 py-3 bg-primary-bg"
        >
            <div
                class="w-7 h-7 mr-1 my-2 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p class="text-primary max-w-32">
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
    state: {
        type: Boolean
    }
})

const emit = defineEmits(['theme-change'])

const toggleLightDarkMode = isDarkMode => {
    console.log(`isDarkMode on ColorChanger is ${isDarkMode}`)
    emit('theme-change', isDarkMode)
}
</script>
