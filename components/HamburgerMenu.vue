<template>
    <div
        v-close-on-outside-click
        data-testid="hamburger-menu-container"
        class="cursor-pointer w-full flex"
    >
        <SVGHamburgerMenuIcon
            data-testid="hamburger-menu-icon"
            alt="hamburger menu"
            class="h-8 w-8"
            @click="openMenu()"
        />
        <Transition
            enter-active-class="transition ease-in-out duration-300 transform: translate(100%, 0)"
            leave-active-class="transition ease-in-out duration-100 transform: translate(-100%, 0)"
            enter-from-class="opacity-0 translate-x-2.5"
            enter-to-class="opacity-100 translate-x-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-2.5"
        >
            <div
                v-show="isMenuOpen"
                data-testid="hamburger-menu"
                class="z-20 absolute top-0 right-0 h-full w-2/3 pt-6 pb-2 rounded bg-primary-bg border-2
                        flex flex-col justify-between "
            >
                <div data-testid="hamburger-upper-section">
                    <div
                        data-testid="hamburger-header"
                        class="flex justify-between px-5"
                    >
                        <div class="flex">
                            <div
                                class="title-text flex flex-col flex-shrink-0"
                                data-testid="logo"
                            >
                                <div class="text-lg text-primary-text group-hover:text-primary-hover font-semibold">
                                    {{ $t('hamburgerMenu.copyright') }}
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
                    <div
                        data-testid="hamburger-menu-language-section"
                        class="flex mt-2 px-5"
                    >
                        <span class="text-primary-text self-center mr-2">{{ $t('hamburgerMenu.languageDropdownTitle')
                        }}</span>
                        <LocaleSelector class="py-1.5 text-primary-text bg-primary-bg" />
                    </div>
                    <div
                        data-testid="hamburger-menu-items"
                        class="mt-10 px-5 flex flex-col gap-6"
                    >
                        <NuxtLink :to="'/'">
                            <div @click="closeMenu()">
                                {{ $t('hamburgerMenu.home') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink :to="'/about'">
                            <div @click="closeMenu()">
                                {{ $t('hamburgerMenu.about') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink
                            :to="'https://forms.gle/4E763qfaq46kEsn99'"
                            target="_blank"
                        >
                            <div @click="closeMenu()">
                                {{ $t('hamburgerMenu.contact') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink :to="'/submit'">
                            <div @click="closeMenu()">
                                {{ $t('hamburgerMenu.submit') }}
                            </div>
                        </NuxtLink>
                        <div
                            v-if="authStore.isLoggedIn"
                            class="text-primary"
                        >
                            <div class="flex">
                                <SVGProfileIcon
                                    role="img"
                                    alt="profile icon"
                                    title="profile icon"
                                    class="profile-icon w-7 stroke-primary stroke-2 inline"
                                />
                                <div class="text-primary font-bold">
                                    {{ authStore.userId }}
                                </div>
                            </div>
                            <NuxtLink :to="'/moderation'">
                                <div @click="closeMenu()">
                                    {{ $t('hamburgerMenu.moderation') }}
                                </div>
                            </NuxtLink>
                            <NuxtLink :to="'/'">
                                <div @click="logout()">
                                    {{ $t('hamburgerMenu.logout') }}
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <div
                    data-testid="hamburger-menu-footer-section"
                    class="flex flex-col gap-5 px-5"
                >
                    <div
                        data-testid="hamburger-menu-footer-legal"
                        class="flex gap-4"
                    >
                        <NuxtLink
                            :to="'/terms'"
                            data-testid="hamburger-menu-footer-legal-terms"
                        >
                            <span @click="closeMenu()">
                                {{ $t('footer.terms') }}
                            </span>
                        </NuxtLink>
                        <NuxtLink
                            :to="'/privacypolicy'"
                            data-testid="hamburger-menu-footer-legal-privacy"
                        >
                            <span @click="closeMenu()">
                                {{ $t('footer.privacy') }}
                            </span>
                        </NuxtLink>
                    </div>
                    <div
                        data-testid="hamburger-menu-footer-dev-links"
                        class="flex gap-6"
                    >
                        <NuxtLink
                            :to="'https://github.com/ourjapanlife'"
                            target="_blank"
                        >
                            <SVGGithubIcon
                                data-testid="hamburger-menu-github-icon"
                                alt="hamburger menu"
                                class="h-10 w-8"
                            />
                        </NuxtLink>
                        <!-- Netlify Icons are available here: https://www.netlify.com/press/#badges -->
                        <NuxtLink
                            :to="'https://www.netlify.com'"
                            target="_blank"
                            data-testid="hamburger-menu-footer-dev-links-netlify"
                        >
                            <img
                                src="https://www.netlify.com/v3/img/components/netlify-light.svg"
                                alt="Deploys by Netlify"
                                class=" h-10 w-20"
                            >
                        </NuxtLink>
                    </div>
                    <div
                        data-testid="hamburger-menu-footer-copyright"
                        class="text-primary-text-muted text-xs"
                    >
                        <div>
                            © {{ new Date().getUTCFullYear() }} {{ $t('hamburgerMenu.copyright') }}
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
                                    :to="'https://www.npo-hiroba.or.jp/search/zoom.php?pk=121289'"
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
                                    :to="'https://docs.google.com/spreadsheets/d/1CafQoHn1NNNoRy35QSt_nUZcgKL8QN2M'"
                                    target="_blank"
                                    class="underline"
                                >{{ $t('hamburgerMenu.balancesheet') }}
                                </NuxtLink>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import SVGHamburgerMenuIcon from '~/assets/icons/hamburger-menu.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()

const isMenuOpen = ref(false)

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

//this is a custom directive to close the menu when clicking outside of the menu
const vCloseOnOutsideClick = {
    mounted: (el: ExtendedHTMLElement) => {
        el.clickOutsideEvent = event => {
            const eventTarget: EventTarget | null = event.target
            const isClickInsideElement = (el == eventTarget || el.contains(eventTarget))
            if (!isClickInsideElement) {
                closeMenu()
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: (el: ExtendedHTMLElement) => {
        document.removeEventListener('click', el.clickOutsideEvent)
    }
}
</script>
