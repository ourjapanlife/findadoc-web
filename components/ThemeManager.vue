<template>
    <div
        id="color-changer"
        class="transition duration-300 opacity-0 invisible rounded-t-2xl border-t border-primary/20 translate-y-20 overflow-hidden"
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
    <!-- <hr class="mx-auto w-32 border-secondary"> -->
    </div>

    <div class="bg-primary-bg z-10 ">
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
                class="text-secondary w-6 h-6 transition duration-300 fill-primary"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SvgoAccordionArrow } from '#components'

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

let colorThemeAccordionIsClosed = true

function toggleThemeVisibility() {
    const accordion = document.getElementById('accordion')

    const colorChanger = document.getElementById('color-changer')

    accordion.classList.toggle('-rotate-180')

    colorChanger.classList.toggle('opacity-0')

    colorChanger.classList.toggle('translate-y-20')

    colorThemeAccordionIsClosed = !colorThemeAccordionIsClosed

    if (colorThemeAccordionIsClosed) {
        // colorChanger.classList.toggle('delay-300')
        // colorChanger.classList.toggle('invisible')
        setTimeout(() => { colorChanger.classList.toggle('invisible') }, 300)
    } else {
        colorChanger.classList.toggle('invisible')
    }
}

function toggleLightDarkMode(returnedDarkModeValue) {
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

    const addTheme = function(theme) {
        localStorage.setItem('theme', theme)
        localStorage.setItem('isDarkMode', `${darkModeValue}`)
        currentTheme.value = theme
    }

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
        addTheme(newTheme)
    } else {
        document.documentElement.classList.add(`theme-${newTheme}-dark`)
        addTheme(newTheme)
    }
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        const savedColorMode = localStorage.getItem('isDarkMode') === 'true'
        currentTheme.value = savedTheme
        isDarkMode.value = savedColorMode
        setTheme(savedTheme, savedColorMode)
    } else {
        setTheme('original', false)
    }
})
</script>
