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
                            <!-- About Link -->
                            <NuxtLink to="/about">
                                <div @click="closeMenu()">
                                    {{ t('hamburgerMenu.about') }}
                                </div>
                            </NuxtLink>
                            <!-- Contact us Link -->
                            <NuxtLink
                                to="https://forms.gle/4E763qfaq46kEsn99"
                                target="_blank"
                            >
                                <div @click="closeMenu()">
                                    {{ t('hamburgerMenu.contact') }}
                                </div>
                            </NuxtLink>
                            <!-- Add a doctor Link -->
                            <NuxtLink to="/submit">
                                <div @click="closeMenu()">
                                    {{ t('hamburgerMenu.submit') }}
                                </div>
                            </NuxtLink>
                            <div
                                v-if="authStore.isLoggedIn"
                                class="text-primary"
                            >
                                <div class="flex">
                                    <!-- Profile Image -->
                                    <img
                                        :src="authStore.userProfileImage || '~/assets/icons/profile-icon.svg'"
                                        alt="profile icon"
                                        title="profile icon"
                                        class="profile-icon w-7 stroke-primary inline stroke-2 rounded-full mr-1"
                                    >
                                    <div class="text-primary font-bold">
                                        {{ authStore.userId }}
                                    </div>
                                </div>
                                <NuxtLink to="/moderation">
                                    <div @click="closeMenu()">
                                        {{ t('hamburgerMenu.moderation') }}
                                    </div>
                                </NuxtLink>
                                <NuxtLink to="/">
                                    <div @click="logout()">
                                        {{ t('hamburgerMenu.logout') }}
                                    </div>
                                </NuxtLink>
                            </div>
                            <div
                                v-if="!authStore.isLoggedIn"
                                class="text-primary"
                            >
                                <NuxtLink to="/login">
                                    <div @click="closeMenu()">
                                        {{ t('hamburgerMenu.login') }}
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>

                    <div
                        data-testid="hamburger-menu-footer-section"
                        class="flex flex-col gap-5 px-5"
                    >
                        <div data-testid="hamburger-menu-theme-switcher">
                            <p class="mb-1">
                                {{ t('hamburgerMenu.theme') }}: {{ convertStringToTitleCase(currentTheme) }}
                            </p>
                            <div class="flex">
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Original Theme"
                                    style="background-color:#EB7100"
                                    :class="getSelectedTheme('original')"
                                    @click="setTheme('original')"
                                />
                                <div
                                    class="w-10 h-10 mr-1 bg-primary"
                                    title="Coral Theme"
                                    style="background-color: #ED6C5A;"
                                    :class="getSelectedTheme('coral')"
                                    @click="setTheme('coral')"
                                />
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Violet Theme"
                                    style="background-color: #A45D9A;"
                                    :class="getSelectedTheme('violet')"
                                    @click="setTheme('violet')"
                                />
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Ocean Theme"
                                    style="background-color: #245A7D;"
                                    :class="getSelectedTheme('ocean')"
                                    @click="setTheme('ocean')"
                                />
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Neon Theme"
                                    style="background-color: #1bdb9b;"
                                    :class="getSelectedTheme('neon')"
                                    @click="setTheme('neon')"
                                />
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Default Theme"
                                    style="background-color: #EEFF02FF;"
                                    :class="getSelectedTheme('accessible-high-contrast')"
                                    alt="Accessible: High Contrast Theme"
                                    @click="setTheme('accessible-high-contrast')"
                                />
                                <div
                                    class="w-10 h-10 mr-1"
                                    title="Accessible: Daltonian Color Blindness"
                                    style="background-color: #FF0000FF;"
                                    :class="getSelectedTheme('accessible-red-green')"
                                    alt="Accessible: Daltonian Color Blindness"
                                    @click="setTheme('accessible-red-green')"
                                />
                            </div>
                        </div>
                        <div
                            data-testid="hamburger-menu-footer-legal"
                            class="flex gap-4"
                        >
                            <NuxtLink
                                to="/terms"
                                data-testid="hamburger-menu-footer-legal-terms"
                            >
                                <span @click="closeMenu()">
                                    {{ t('footer.terms') }}
                                </span>
                            </NuxtLink>
                            <NuxtLink
                                to="/privacypolicy"
                                data-testid="hamburger-menu-footer-legal-privacy"
                            >
                                <span @click="closeMenu()">
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
import { ref, onMounted } from 'vue'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'
import SVGHamburgerMenuIcon from '~/assets/icons/hamburger-menu.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import { useAuthStore } from '~/stores/authStore'
import { convertStringToTitleCase } from '~/utils/stringUtils'

const authStore = useAuthStore()

const isMenuOpen = ref(false)

const currentTheme = ref('orange')

const { t } = useI18n()

function openMenu() {
    isMenuOpen.value = true
}

function closeMenu() {
    isMenuOpen.value = false
}

function logout() {
    authStore.logout()
    closeMenu()
}

function setTheme(newTheme: string) {
    document.documentElement.classList.remove(
        'theme-orange',
        'theme-coral',
        'theme-violet',
        'theme-ocean',
        'theme-neon',
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
        return 'border-4 border-black'
    }
    return 'border border-gray-300'
}

onMounted(() => {
    const saveTheme = localStorage.getItem('theme')
    if (saveTheme) {
        currentTheme.value = saveTheme
        setTheme(saveTheme)
    }
})
</script>
