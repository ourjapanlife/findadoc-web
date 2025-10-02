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
                            class="flex flex-col gap-6 px-5 mt-10 mb-1"
                        >
                            <div data-testid="hamburger-menu-theme-switcher">
                                <p class="mb-1 text-primary-text">
                                    {{ t('hamburgerMenu.theme') }}: {{ convertStringToTitleCase(currentTheme) }}
                                </p>
                                <div class="flex">
                                    <div
                                        v-if="lightDarkMode == 'LIGHT'"
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Original Theme"
                                        style="background-color:#0EB0C0"
                                        :class="getSelectedTheme('original')"
                                        @click="setTheme('original')"
                                    />
                                    <div
                                        v-if="lightDarkMode == 'DARK'"
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Original Theme Dark"
                                        style="background-color:#00FFFF"
                                        :class="getSelectedTheme('dark')"
                                        @click="setTheme('dark')"
                                    />
                                    <div
                                        v-if="lightDarkMode == 'LIGHT'"
                                        class="w-7 h-7 mr-1 bg-primary rounded-full"
                                        title="Coral Theme"
                                        style="background-color: #ED6C5A;"
                                        :class="getSelectedTheme('coral')"
                                        @click="setTheme('coral')"
                                    />
                                    <div
                                        v-if="lightDarkMode == 'DARK'"
                                        class="w-7 h-7 mr-1 bg-primary rounded-full"
                                        title="Coral Theme Dark"
                                        style="background-color: #FF1F00;"
                                        :class="getSelectedTheme('coral')"
                                        @click="setTheme('coral-dark')"
                                    />
                                    <div
                                        v-if="lightDarkMode == 'LIGHT'"
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Violet Theme"
                                        style="background-color: #A45D9A;"
                                        :class="getSelectedTheme('violet')"
                                        @click="setTheme('violet')"
                                    />
                                    <div
                                        v-if="lightDarkMode == 'DARK'"
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Violet Theme Dark"
                                        style="background-color: #FF00DB;"
                                        :class="getSelectedTheme('violet')"
                                        @click="setTheme('violet-dark')"
                                    />

                                <!-- <div
                                    class="w-7 h-7 mr-1 rounded-md"
                                    title="Ocean Theme"
                                    style="background-color: #245A7D;"
                                    :class="getSelectedTheme('ocean')"
                                    @click="setTheme('ocean')"
                                /> -->
                                </div>
                            </div>
                            <div data-testid="hamburger-menu-theme-switcher">
                                <p class="mb-1 text-primary-text">
                                    Accessible colors
                                </p>
                                <div class="flex">
                                    <div
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Default Theme"
                                        style="background-color: #EEFF02FF;"
                                        :class="getSelectedTheme('accessible-high-contrast')"
                                        alt="Accessible: High Contrast Theme"
                                        @click="setTheme('accessible-high-contrast')"
                                    />
                                    <div
                                        class="w-7 h-7 mr-1 rounded-full"
                                        title="Accessible: Daltonian Color Blindness"
                                        style="background-color: #FF0000FF;"
                                        :class="getSelectedTheme('accessible-red-green')"
                                        alt="Accessible: Daltonian Color Blindness"
                                        @click="setTheme('accessible-red-green')"
                                    />
                                </div>
                            </div>
                            <div
                                data-testid="hamburger-menu-theme-switcher"
                            >
                                <p
                                    class="mb-1 text-primary-text"
                                >
                                    Dark Mode
                                </p>
                                <!-- <Toggle @theme-change="(i) => (lightDarkMode = i)" /> -->
                                <Toggle @theme-change="lightDarkModeSwitcher" />
                            </div>
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
                    </div>

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
            </Transition>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
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

const lightDarkMode = ref('LIGHT')

const original = {
    LIGHT: 'theme-original',
    DARK: 'theme-dark'
}

const coral = {
    LIGHT: 'theme-coral',
    DARK: 'theme-coral-dark'
}

const violet = {
    LIGHT: 'theme-violet',
    DARK: 'theme-violet-dark'
}

function lightDarkModeSwitcher(passedValue) {
    document.documentElement.classList.remove(
        'theme-original',
        'theme-coral',
        'theme-violet',
        'theme-dark',
        'theme-coral-dark',
        'theme-violet-dark',
        'theme-accessible-high-contrast',
        'theme-accessible-red-green'
    )
    if (currentTheme.value == 'original') {
        document.documentElement.classList.add(original[passedValue])
        const themeMode = original[passedValue]
        console.log(original[passedValue])
        console.log(themeMode)
    } else if (currentTheme.value == 'coral') {
        document.documentElement.classList.add(coral[passedValue])
    } else if (currentTheme.value == 'violet') {
        document.documentElement.classList.add(violet[passedValue])
    }
    localStorage.setItem('theme', themeMode)
    lightDarkMode.value = passedValue
}

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

function setTheme(newTheme: string) {
    document.documentElement.classList.remove(
        'theme-original',
        'theme-coral',
        'theme-violet',
        'theme-dark',
        'theme-coral-dark',
        'theme-violet-dark',
        'theme-accessible-high-contrast',
        'theme-accessible-red-green'
    )
    document.documentElement.classList.add(`theme-${newTheme}`)
    localStorage.setItem('theme', newTheme)
    currentTheme.value = newTheme
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
        currentTheme.value = saveTheme
        setTheme(saveTheme)
    }
    console.log('Current theme is ' + saveTheme)
})
</script>
