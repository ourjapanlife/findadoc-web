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
                Color Themes
            </p>
            <!-- <svg
                id="accordion"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                class="text-primary transition duration-300"
            >
                <path d="M13.354,5.146c0.094,0.094 0.147,0.221 0.147,0.354c0,0.133 -0.053,0.26 -0.147,0.354l-5,5c-0.094,0.094 -0.221,0.147 -0.354,0.147c-0.133,0 -0.26,-0.053 -0.354,-0.147l-5,-5c-0.094,-0.094 -0.147,-0.221 -0.147,-0.354c0,-0.275 0.226,-0.501 0.501,-0.501c0.133,0 0.26,0.053 0.354,0.147l4.646,4.647l4.646,-4.647c0.094,-0.094 0.221,-0.147 0.354,-0.147c0.133,0 0.26,0.053 0.354,0.147Z" />
            </svg> -->
            <img
                id="accordion"
                class="text-secondary transition duration-300"
                src="../assets/icons/accordion-arrow.svg"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
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
