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
                            class="flex justify-between px-4"
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
                                class="px-4 py-.5 mr-2"
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
                            class="flex px-4 mt-2"
                        >
                            <span class="self-center mr-2 text-primary-text">{{ t('hamburgerMenu.languageDropdownTitle')
                            }}</span>
                            <LocaleSelector class="py-1.5 text-primary-text bg-primary-bg" />
                        </div>
                        <!-- Menu Links -->
                        <div
                            data-testid="hamburger-menu-items"
                            class="flex flex-col gap-6 px-4 mt-6 mb-1"
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

                        <!-- Footer Section -->
                        <div
                            data-testid="hamburger-menu-footer-section"
                            class="absolute left-0 bottom-0 flex flex-col gap-3 pb-4 w-full"
                        >
                            <div
                                id="color-changer"
                                v-close-on-outside-click="closeMenu"
                                class="transition duration-300 opacity-0 invisible rounded border border-primary translate-y-20 drop-shadow-xl overflow-hidden"
                            >
                                <ColorChanger
                                    v-for="theme in themes"
                                    :id="theme.id"
                                    :key="theme.id"
                                    :dot-color="theme.dotColor"
                                    :name="theme.name"
                                    :selected="theme.selected"
                                    :state="isDarkMode"
                                    @click="setTheme(theme.id, isDarkMode)"
                                    @theme-change="toggleLightDarkMode"
                                />
                                <!-- <hr class="mx-auto w-32 border-secondary"> -->
                            </div>
                            <div
                                class="flex flex-row px-4 py-1 gap-3 items-center"
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
                                <svg
                                    id="accordion"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    class="text-primary transition duration-300"
                                >
                                    <path d="M13.354,5.146c0.094,0.094 0.147,0.221 0.147,0.354c0,0.133 -0.053,0.26 -0.147,0.354l-5,5c-0.094,0.094 -0.221,0.147 -0.354,0.147c-0.133,0 -0.26,-0.053 -0.354,-0.147l-5,-5c-0.094,-0.094 -0.147,-0.221 -0.147,-0.354c0,-0.275 0.226,-0.501 0.501,-0.501c0.133,0 0.26,0.053 0.354,0.147l4.646,4.647l4.646,-4.647c0.094,-0.094 0.221,-0.147 0.354,-0.147c0.133,0 0.26,0.053 0.354,0.147Z" />
                                </svg>
                            </div>
                            <div class="px-4 flex flex-col gap-3">
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
import ColorChanger from './ColorChanger.vue'
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
const { t } = useI18n()

const isMenuOpen = ref(false)

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

// Theme Changer

const currentTheme = ref('original')

const isDarkMode = ref(false)

const themes = reactive([
    {
        id: 'original',
        dotColor: '#0EB0C0',
        name: 'Original',
        selected: true,
        state: isDarkMode
    },
    {
        id: 'coral',
        dotColor: '#ED6C5A',
        name: 'Coral',
        selected: false,
        state: isDarkMode
    },
    {
        id: 'violet',
        dotColor: '#A45D9A',
        name: 'Violet',
        selected: false,
        state: isDarkMode
    },
    {
        id: 'accessible-high-contrast',
        dotColor: '#EEFF02FF',
        name: 'High Contrast',
        selected: false,
        state: isDarkMode
    },
    {
        id: 'accessible-red-green',
        dotColor: '#FF0000FF',
        name: 'Red-Green Color Blindness',
        selected: false,
        state: isDarkMode
    }
])

let colorThemesAreClosed = true

function toggleThemeVisibility() {
    document.getElementById('accordion').classList.toggle('-rotate-180')
    document.getElementById('color-changer').classList.toggle('opacity-0')
    document.getElementById('color-changer').classList.toggle('translate-y-20')
    colorThemesAreClosed = !colorThemesAreClosed
    if (colorThemesAreClosed) {
        setTimeout(() => { document.getElementById('color-changer').classList.toggle('invisible') }, 300)
    } else {
        document.getElementById('color-changer').classList.toggle('invisible')
    }
}

function toggleLightDarkMode(returnedDarkModeValue) {
    console.log(`returnedDarkModeValue on HamburgerMenu is ${returnedDarkModeValue}`)
    isDarkMode.value = returnedDarkModeValue
    console.log(`isDarkMode on HamburgerMenu is ${isDarkMode.value}`)
    localStorage.setItem('isDarkMode', `${isDarkMode.value}`)
    setTheme(currentTheme.value, isDarkMode.value)
}

function setTheme(newTheme: string, darkModeValue: boolean) {
    console.log(`darkModeValue on HamburgerMenu is ${darkModeValue}`)
    // ---Remove selected from previous theme
    const selectedTheme = themes.find(theme => theme.selected)
    selectedTheme.selected = !selectedTheme.selected

    // ---Set theme to selected---
    const identifiedTheme = themes.find(theme => theme.id === newTheme)

    identifiedTheme.selected = !identifiedTheme.selected

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

    if (darkModeValue === false) {
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
        console.log(`Current theme is ${savedTheme} ${savedColorMode}`)
    } else {
        setTheme('original', false)
    }
})
</script>
