<template>
    <div
        v-close-on-outside-click="closeMenu"
        data-testid="hamburger-menu-container"
        class="flex w-full cursor-pointer"
    >
        <SVGHamburgerMenuIcon
            data-testid="hamburger-menu-icon"
            alt="hamburger menu"
            class="w-8 h-8 fill-primary"
            @click="openMenu()"
        />
        <Teleport to="body">
            <Transition
                enter-active-class="transition ease-in-out duration-300 transform: translate(100%, 0)"
                leave-active-class="transition ease-in-out duration-100 transform: translate(-100%, 0)"
                enter-from-class="opacity-0 translate-x-2.5"
                enter-to-class="translate-x-0 opacity-100"
                leave-from-class="translate-x-0 opacity-100"
                leave-to-class="opacity-0 translate-x-2.5"
            >
                <div
                    v-show="isMenuOpen"
                    data-testid="hamburger-menu"
                    class="fixed top-0 right-0 z-30 flex flex-col
                    justify-between w-2/3 h-dvh pt-6 pb-2 border-l-2 border-primary/20 rounded bg-primary-bg "
                    @click.stop
                >
                    <div data-testid="hamburger-upper-section">
                        <div
                            data-testid="hamburger-header"
                            class="flex justify-between px-5"
                        >
                            <div class="flex">
                                <div
                                    class="flex flex-col flex-shrink-0 title-text"
                                    data-testid="logo"
                                >
                                    <div class="text-lg font-semibold text-primary-text group-hover:text-primary-hover">
                                        {{ t('hamburgerMenu.copyright') }}
                                    </div>
                                </div>
                            </div>
                            <button
                                data-testid="hamburger-menu-close-button"
                                class="px-2 py-.5 mr-2"
                                @click="closeMenu()"
                            >
                                <svg
                                    class="stroke-primary"
                                    width="20"
                                    heigh="20"
                                    viewBox="4 0 15 25"
                                >
                                    <path
                                        stroke-width="3"
                                        fill="none"
                                        d="M6.25,6.25,17.75,17.75"
                                    />
                                    <path
                                        stroke-width="3"
                                        fill="none"
                                        d="M6.25,17.75,17.75,6.25"
                                    />
                                </svg>
                            </button>
                        </div>
                        <!-- Language Selector -->
                        <div
                            data-testid="hamburger-menu-language-section"
                            class="flex px-5 mt-2"
                        >
                            <span class="self-center mr-2 text-primary-text">{{ t('hamburgerMenu.languageDropdownTitle')
                            }}</span>
                            <LocaleSelector class="py-1.5 text-primary-text bg-primary-bg" />
                        </div>
                        <!-- Menu Links -->
                        <div
                            data-testid="hamburger-menu-items"
                            class="flex flex-col gap-6 px-5 mt-6 mb-1"
                        >
                            <!-- Home Link -->
                            <NuxtLink to="/">
                                <div
                                    class="text-primary"
                                    @click="closeMenu()"
                                >
                                    {{ t('topNav.home') }}
                                </div>
                            </NuxtLink>
                            <!-- About Link -->
                            <NuxtLink to="/about">
                                <div
                                    class="text-primary"
                                    @click="closeMenu()"
                                >
                                    {{ t('hamburgerMenu.about') }}
                                </div>
                            </NuxtLink>
                            <!-- Contact us Link -->
                            <NuxtLink
                                to="https://forms.gle/4E763qfaq46kEsn99"
                                target="_blank"
                            >
                                <div
                                    class="text-primary"
                                    @click="closeMenu()"
                                >
                                    {{ t('hamburgerMenu.contact') }}
                                </div>
                            </NuxtLink>
                            <!-- Add a doctor Link -->
                            <NuxtLink to="/submit">
                                <div
                                    class="text-primary"
                                    @click="closeMenu()"
                                >
                                    {{ t('hamburgerMenu.submit') }}
                                </div>
                            </NuxtLink>
                            <div
                                v-if="authStore.isLoggedIn"
                                class="text-primary-text"
                            >
                                <div class="flex mb-4 pb-1 border-b-2">
                                    <!-- Profile Image -->
                                    <img
                                        :src="authStore.userProfileImage"
                                        alt="profile icon"
                                        title="profile icon"
                                        class="profile-icon w-7 h-7 stroke-primary inline stroke-2 rounded-full mr-1"
                                    >
                                    <div class="font-bold">
                                        {{ authStore.userId }}
                                    </div>
                                </div>
                                <NuxtLink
                                    to="/settings"
                                    class="flex ml-0.3 mb-4"
                                >
                                    <SVGSettingsIcon
                                        role="img"
                                        title="setting icon"
                                        class="w-6 h-6 mr-2"
                                    />
                                    <div @click="closeMenu()">
                                        {{ t('hamburgerMenu.settings') }}
                                    </div>
                                </NuxtLink>
                                <button
                                    class="flex"
                                    @click="logout()"
                                >
                                    <SVGSignOutIcon
                                        role="img"
                                        title="setting icon"
                                        class="w-6 h-6 mr-2"
                                    />
                                    <div>
                                        {{ t('hamburgerMenu.logout') }}
                                    </div>
                                </button>
                            </div>
                            <div
                                v-if="!authStore.isLoggedIn"
                                class="text-primary"
                            >
                                <NuxtLink
                                    to="/login"
                                    @click="closeMenu()"
                                >
                                    {{ t('hamburgerMenu.login') }}
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Accessible Theme Selector -->

                        <!-- light-dark-toggle should be hasLightDarkToggleEnabled -->

                        <ColorChanger
                            v-for="theme in themes"
                            :id="theme.id"
                            :key="theme.id"
                            :dot-color="theme.dotColor"
                            :name="theme.name"
                            :selected="theme.selected"
                            :light-dark-toggle="theme.lightDarkToggle"
                            :state="lightMode"
                            @click="setTheme(theme.id)"
                            @theme-change="changeLightDark"
                        />

                        <!-- Footer Section -->
                        <div
                            data-testid="hamburger-menu-footer-section"
                            class="flex flex-col gap-5 px-5"
                        >
                            <div
                                data-testid="hamburger-menu-footer-legal"
                                class="flex gap-4"
                            >
                                <NuxtLink
                                    to="/terms"
                                    data-testid="hamburger-menu-footer-legal-terms"
                                >
                                    <span
                                        class="text-primary-text"
                                        @click="closeMenu()"
                                    >
                                        {{ t('footer.terms') }}
                                    </span>
                                </NuxtLink>
                                <NuxtLink
                                    to="/privacypolicy"
                                    data-testid="hamburger-menu-footer-legal-privacy"
                                >
                                    <span
                                        class="text-primary-text"
                                        @click="closeMenu()"
                                    >
                                        {{ t('footer.privacy') }}
                                    </span>
                                </NuxtLink>
                            </div>
                            <div
                                data-testid="hamburger-menu-footer-dev-links"
                                class="flex gap-6"
                            >
                                <NuxtLink
                                    to="https://github.com/ourjapanlife"
                                    target="_blank"
                                >
                                    <SVGGithubIcon
                                        data-testid="hamburger-menu-github-icon"
                                        alt="hamburger menu"
                                        class="w-8 h-10"
                                    />
                                </NuxtLink>
                                <!-- Netlify Icons are available here: https://www.netlify.com/press/#badges -->
                                <NuxtLink
                                    to="https://www.netlify.com"
                                    target="_blank"
                                    data-testid="hamburger-menu-footer-dev-links-netlify"
                                >
                                    <img
                                        src="https://www.netlify.com/v3/img/components/netlify-light.svg"
                                        alt="Deploys by Netlify"
                                        class="w-20 h-10 "
                                    >
                                </NuxtLink>
                            </div>
                            <div
                                data-testid="hamburger-menu-footer-copyright"
                                class="text-xs text-primary-text-muted"
                            >
                                <div>
                                    © {{ new Date().getUTCFullYear() }} {{ t('hamburgerMenu.copyright') }}
                                </div>
                                <div
                                    data-testid="hamburger-menu-footer-legal"
                                    class="flex"
                                >
                                    <span
                                        data-testid="npo-link"
                                        class="mt-0.5"
                                    >
                                        NPO
                                        <NuxtLink
                                            to="https://www.npo-hiroba.or.jp/search/zoom.php?pk=121289"
                                            target="_blank"
                                            class="underline"
                                        >#9011005010215
                                        </NuxtLink>
                                    </span>
                                    <span
                                        data-testid="npo-balance-sheet-link"
                                        class="ml-2 mt-0.5"
                                    >
                                        <NuxtLink
                                            to="https://docs.google.com/spreadsheets/d/1CafQoHn1NNNoRy35QSt_nUZcgKL8QN2M"
                                            target="_blank"
                                            class="underline"
                                        >{{ t('hamburgerMenu.balancesheet') }}
                                        </NuxtLink>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { current } from 'tailwindcss/colors'
import Toggle from './Toggle.vue'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'
import SVGHamburgerMenuIcon from '~/assets/icons/hamburger-menu.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import SVGSettingsIcon from '~/assets/icons/settings-icon.svg'
import SVGSignOutIcon from '~/assets/icons/sign-out-icon.svg'
import { useAuthStore } from '~/stores/authStore'
import { convertStringToTitleCase } from '~/utils/stringUtils'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const isMenuOpen = ref(false)

const currentTheme = ref('original')

const { t } = useI18n()

// const lightDarkMode = ref('LIGHT')

// change to isLightMode
const lightMode = ref(true)

const themes = reactive([
    {
        id: 'original',
        dotColor: '#0EB0C0',
        name: 'Original',
        selected: true,
        lightDarkToggle: true,
        state: lightMode
    },
    {
        id: 'coral',
        dotColor: '#ED6C5A',
        name: 'Coral',
        selected: false,
        lightDarkToggle: true,
        state: lightMode
    },
    {
        id: 'violet',
        dotColor: '#A45D9A',
        name: 'Violet',
        selected: false,
        lightDarkToggle: true,
        state: lightMode
    },
    {
        id: 'accessible-high-contrast',
        dotColor: '#EEFF02FF',
        name: 'High Contrast',
        selected: false,
        lightDarkToggle: false,
        state: lightMode
    },
    {
        id: 'accessible-red-green',
        dotColor: '#FF0000FF',
        name: 'Red-Green Color Blindness',
        selected: false,
        lightDarkToggle: false,
        state: lightMode
    }
])

// const original = {
//     LIGHT: 'theme-original',
//     DARK: 'theme-dark'
// }

// const coral = {
//     LIGHT: 'theme-coral',
//     DARK: 'theme-coral-dark'
// }

// const violet = {
//     LIGHT: 'theme-violet',
//     DARK: 'theme-violet-dark'
// }

// function lightDarkModeSwitcher(passedValue) {
//     document.documentElement.classList.remove(
//         'theme-original',
//         'theme-coral',
//         'theme-violet',
//         'theme-original-dark',
//         'theme-coral-dark',
//         'theme-violet-dark',
//         'theme-accessible-high-contrast',
//         'theme-accessible-red-green'
//     )
//     if (currentTheme.value == 'original') {
//         document.documentElement.classList.add(original[passedValue])
//         const themeMode = original[passedValue]
//         console.log(original[passedValue])
//         console.log(themeMode)
//     } else if (currentTheme.value == 'coral') {
//         document.documentElement.classList.add(coral[passedValue])
//     } else if (currentTheme.value == 'violet') {
//         document.documentElement.classList.add(violet[passedValue])
//     }
//     localStorage.setItem('theme', themeMode)
//     localStorage.setItem('colorMode', lightOrDark)
//     lightDarkMode.value = passedValue
//     console.log(passedValue)
// }

function openMenu() {
    isMenuOpen.value = true
}

function closeMenu() {
    isMenuOpen.value = false
}

async function logout() {
    try {
        await authStore.logout()
        toast.success(t('hamburgerMenu.logoutToast'))
        router.push('/')
    } catch (error) {
        toast.error(error)
    }
}
//change changeLightDark to toggleLightDarkMode
function changeLightDark() {
    lightMode.value = !lightMode.value
    localStorage.setItem('lightMode', `${lightMode.value}`)
    setTheme(currentTheme.value)
}

function setTheme(newTheme: string) {
    // ---Remove selected from previous theme
    const selectedTheme = themes.find(theme => theme.selected)
    console.log(selectedTheme)
    selectedTheme.selected = !selectedTheme.selected
    console.log(selectedTheme)
    // ---Set theme to selected---
    const identifiedTheme = themes.find(theme => theme.id === newTheme)

    identifiedTheme.selected = !identifiedTheme.selected

    const addTheme = function(theme) {
        localStorage.setItem('theme', theme)
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
        'theme-accessible-red-green'
    )

    const isAccessibleTheme = lightMode.value || newTheme === 'accessible-high-contrast' || newTheme === 'accessible-red-green'

    if (isAccessibleTheme) {
        console.log('Light theme!')
        lightMode.value = true
        document.documentElement.classList.add(`theme-${newTheme}`)
        addTheme(newTheme)
    } else {
        document.documentElement.classList.add(`theme-${newTheme}-dark`)
        addTheme(newTheme)
    }
}

// This gives a black border to the currently selected theme
function getSelectedTheme(theme: string) {
    if (currentTheme.value === theme) {
        return 'border-4 border-primary'
    }
    return 'border border-gray-300'
}

// 1. Create themes as objects
// 2. Have toggle call function
// 3. Function will swap one of two options for dark or light
// 4. that option will then get added to to the class list

// function toggleDarkLight() {
//     if (mode.value == colorMode.Light) {
//         mode.value = colorMode.Dark
//         console.log(currentTheme)
//     } else {
//         mode.value = colorMode.Light
//         console.log(currentTheme)
//     }
// }

onMounted(() => {
    const saveTheme = localStorage.getItem('theme')
    if (saveTheme) {
        const saveColorMode = localStorage.getItem('lightMode') === 'true'
        // if (saveColorMode) {
        //     lightDarkMode.value = 'LIGHT'
        // } else {
        //     lightDarkMode.value = 'DARK'
        // }
        currentTheme.value = saveTheme
        lightMode.value = saveColorMode
        setTheme(saveTheme)
        console.log(`Current theme is ${saveTheme} ${saveColorMode}`)
    }
})
</script>
