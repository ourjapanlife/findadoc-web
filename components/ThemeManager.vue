<template>
    <div
        id="color-changer"
        :class="colorThemeAccordionIsClosed
            ? 'transition-discrete duration-300 opacity-0 h-0 rounded-t-2xl border-t border-primary/20'
                + ' portrait:translate-y-20 overflow-hidden landscape:absolute landscape:translate-y-1/2'
            : 'transition-discrete duration-300 portrait:rounded-t-2xl landscape:rounded-md border-t-2'
                + 'border-primary/20 overflow-hidden landscape:absolute landscape:translate-y-2/3'"
    >
        <ThemeOption
            v-for="theme in themes"
            :key="theme.themeId"
            :theme-id="theme.themeId"
            :dot-color="theme.dotColor"
            :theme-name="theme.themeName"
            :is-selected="theme.isSelected"
            :is-dark-mode="isDarkMode"
            @click="setTheme(theme.themeId, isDarkMode)"
            @lightdarkmode-toggle="toggleLightDarkMode"
        />
    </div>

    <div class="portrait:bg-primary-bg z-10 ">
        <div
            class="flex px-4 py-2 gap-3 items-center"
            @click="toggleThemeVisibility"
        >
            <div
                class="w-7 h-7 mr-1 rounded-full bg-primary"
            />
            <p
                id="theme-text"
                class="text-primary"
            >
                {{ t('themeManager.colorThemes') }}
            </p>
            <SvgoAccordionArrow
                id="accordion"
                role="img"
                title="accordion arrow"
                :class="colorThemeAccordionIsClosed
                    ? 'w-6 h-6 transition duration-300 fill-primary'
                    : 'w-6 h-6 transition duration-300 fill-primary -rotate-180'"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import ThemeOption from './ThemeOption.vue'
import { onMounted } from 'vue'

// To dos
// Make theme changer animated back up when disappearing
// Fix theme changer so that it once more changes colors and modes

const { t } = useI18n()

const currentTheme = ref('original')

const isDarkMode = ref(false)

const themes = reactive([
    {
        themeId: 'original',
        dotColor: '#0EB0C0',
        themeName: 'Original',
        isSelected: true,
        isDarkMode: isDarkMode
    },
    {
        themeId: 'coral',
        dotColor: '#ED6C5A',
        themeName: 'Coral',
        isSelected: false,
        isDarkMode: isDarkMode
    },
    {
        themeId: 'violet',
        dotColor: '#A45D9A',
        themeName: 'Violet',
        isSelected: false,
        isDarkMode: isDarkMode
    },
    {
        themeId: 'accessible-high-contrast',
        dotColor: '#006872',
        themeName: 'High Contrast',
        isSelected: false,
        isDarkMode: isDarkMode
    },
    {
        themeId: 'accessible-red-green',
        dotColor: '#007BFF',
        themeName: 'Red-Green Color Blindness',
        isSelected: false,
        isDarkMode: isDarkMode
    }
])

const colorThemeAccordionIsClosed = ref(true)

function toggleThemeVisibility() {
    colorThemeAccordionIsClosed.value = !colorThemeAccordionIsClosed.value
}

function toggleLightDarkMode(returnedDarkModeValue: boolean) {
    isDarkMode.value = returnedDarkModeValue
    localStorage.setItem('isDarkMode', `${isDarkMode.value}`)
    setTheme(currentTheme.value, isDarkMode.value)
}

function setTheme(newTheme: string, darkModeValue: boolean) {
    // ---Remove selected from previous theme
    const selectedTheme = themes.find(theme => theme.isSelected)
    selectedTheme.isSelected = !selectedTheme.isSelected

    // ---Set theme to selected---
    const identifiedTheme = themes.find(theme => theme.themeId === newTheme)

    identifiedTheme.isSelected = !identifiedTheme.isSelected

    document.documentElement.classList.remove(
        'theme-original',
        'theme-coral',
        'theme-violet',
        'theme-original-dark',
        'theme-coral-dark',
        'theme-violet-dark',
        'theme-accessible-high-contrast',
        'theme-accessible-red-green',
        'theme-accessible-high-contrast-dark',
        'theme-accessible-red-green-dark'
    )

    if (!darkModeValue) {
        document.documentElement.classList.add(`theme-${newTheme}`)
    } else {
        document.documentElement.classList.add(`theme-${newTheme}-dark`)
    }
    localStorage.setItem('theme', newTheme)
    localStorage.setItem('isDarkMode', `${darkModeValue}`)
    currentTheme.value = newTheme
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        const savedColorMode = localStorage.getItem('isDarkMode') === 'true'
        isDarkMode.value = savedColorMode
        setTheme(savedTheme, savedColorMode)
    } else {
        setTheme('original', false)
    }
})
</script>
