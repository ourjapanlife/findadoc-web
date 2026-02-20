<template>
    <div class="flex items-center gap-3">
        <div
            v-if="isSelected"
            class="flex items-center place-content-between bg-secondary-bg size-full px-4 py-3 cursor-pointer"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-7 h-7 mr-1 rounded-full"
                    title="Original Theme"
                    :style="{ backgroundColor: dotColor }"
                />
                <p class="text-primary max-w-32">
                    {{ themeName }}
                </p>
            </div>
            <Toggle
                :is-toggled-on="isDarkMode"
                :toggle-text="isDarkMode ? 'Dark' : 'Light'"
                @toggled-on-off="toggleLightDarkMode"
            />
        </div>

        <div
            v-else
            class="flex items-center gap-3 object-fill size-full px-4 py-3 bg-primary-bg cursor-pointer"
        >
            <div
                class="w-7 h-7 mr-1 my-2 rounded-full"
                title="Original Theme"
                :style="{ backgroundColor: dotColor }"
            />
            <p class="text-primary max-w-32">
                {{ themeName }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    themeId: {
        type: String,
        required: true
    },
    dotColor: {
        type: String,
        required: true
    },
    themeName: {
        type: String,
        required: true
    },
    isSelected: {
        type: Boolean,
        required: true
    },
    isDarkMode: {
        type: Boolean
    }
})

const emit = defineEmits(['lightdarkmode-toggle'])

const toggleLightDarkMode = (isDarkMode: boolean) => {
    emit('lightdarkmode-toggle', isDarkMode)
}
</script>
