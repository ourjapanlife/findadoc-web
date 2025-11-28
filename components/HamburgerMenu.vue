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
                    justify-between w-2/3 h-dvh pt-6 pb-2 border-l-2 border-primary/20 rounded-s-2xl bg-primary-bg "
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

                        <!-- Footer Section -->
                        <div
                            data-testid="hamburger-menu-footer-section"
                            class="absolute bg-primary-bg left-0 bottom-0 flex flex-col gap-3 pb-4 w-full"
                        >
                            <!-- Color Changer -->

                            <ThemeManager />
                            <div class="bg-primary-bg z-10 ">
                                <div class="px-4 flex flex-col gap-3">
                                    <!-- Terms and Privacy Policy -->

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

                                    <!-- Github and Netify -->
                                    <div
                                        data-testid="hamburger-menu-footer-dev-links"
                                        class="flex gap-6"
                                    >
                                        <!-- Github -->
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

                                        <!-- Netify -->

                                        <!-- Netlify Icons are available here: https://www.netlify.com/press/#badges -->
                                        <NuxtLink
                                            to="https://www.netlify.com"
                                            target="_blank"
                                            data-testid="hamburger-menu-footer-dev-links-netlify"
                                        >
                                            <img
                                                src="https://www.netlify.com/v3/img/components/netlify-light.svg"
                                                alt="Deploys by Netlify"
                                                class="w-20 h-10"
                                            >
                                        </NuxtLink>
                                    </div>

                                    <!-- Copyright NPO number and Balance Sheet -->

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
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
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
</script>
