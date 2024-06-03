<template>
    <div class="cursor-pointer w-full flex" v-close-on-outside-click>
        <SVGHamburgerMenuIcon id="hamburger-menu-icon" @click="toggleMenu()" alt="hamburger menu" class="h-8 w-8" />
        <Transition enter-active-class="transition ease-in-out duration-300"
            leave-active-class="transition ease-in-out duration-300" enter-from-class="opacity-0 translate-x-2.5"
            enter-to-class="opacity-100 translate-x-0" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-2.5">
            <div id=" hamburger-menu" v-show="isMenuOpen"
                class="z-20 absolute top-0 right-0 h-full w-2/3 pt-6 pb-8 rounded bg-primary-bg border-2 flex flex-col justify-between ">
                <div id="upper-section">
                    <div id="header" class="flex justify-between px-5">
                        <div class="flex">
                            <div class="title-text flex flex-col flex-shrink-0" data-testid="logo">
                                <div class="text-lg text-primary-text group-hover:text-primary-hover font-semibold">
                                    Find a Doc, Japan
                                </div>
                            </div>
                        </div>
                        <button id="close-button" @click="closeMenu()" class="px-2 py-.5 mr-2">
                            <svg class="stroke-primary" width="20" heigh="20" viewBox="4 0 15 25">
                                <path stroke-width="3" fill="none" d="M6.25,6.25,17.75,17.75" />
                                <path stroke-width="3" fill="none" d="M6.25,17.75,17.75,6.25" />
                            </svg>
                        </button>
                    </div>
                    <div id="language-section" class="flex mt-2 px-5">
                        <span class="text-primary-text self-center mr-2">{{ $t('hamburgerMenu.languageDropdownTitle')
                            }}</span>
                        <LocaleSelector class="py-1.5 text-primary-text bg-primary-bg" />
                    </div>
                    <div id="menu-items" class="mt-10 px-5 flex flex-col gap-6">
                        <NuxtLink :to="'/'">
                            <div @click="toggleMenu()">
                                {{ $t('hamburgerMenu.home') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink :to="'/about'">
                            <div @click="toggleMenu()">
                                {{ $t('hamburgerMenu.about') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink :to="'https://forms.gle/4E763qfaq46kEsn99'" target="_blank">
                            <div @click="toggleMenu()">
                                {{ $t('hamburgerMenu.contact') }}
                            </div>
                        </NuxtLink>
                        <NuxtLink :to="'/submit'">
                            <div @click="toggleMenu()">
                                {{ $t('hamburgerMenu.submit') }}
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div id="footer-section" class="flex flex-col gap-5 px-5">
                    <div id="row-1" class="flex gap-4">
                        <NuxtLink :to="'/terms'">
                            <span @click="toggleMenu()">
                                {{ $t('footer.terms') }}
                            </span>
                        </NuxtLink>
                        <NuxtLink :to="'/privacypolicy'">
                            <span @click="toggleMenu()">
                                {{ $t('footer.privacy') }}
                            </span>
                        </NuxtLink>
                    </div>
                    <div id="row-2" class="flex gap-6">
                        <NuxtLink :to="'https://github.com/ourjapanlife'" target="_blank">
                            <SVGGithubIcon id="github-icon" alt="hamburger menu" class="h-10 w-8" />
                        </NuxtLink>
                        <!-- Netlify Icons are available here: https://www.netlify.com/press/#badges -->
                        <NuxtLink :to="'https://www.netlify.com'" target="_blank">
                            <img src="https://www.netlify.com/v3/img/components/netlify-light.svg"
                                alt="Deploys by Netlify" class=" h-10 w-20" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import SVGHamburgerMenuIcon from '~/assets/icons/hamburger-menu.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
    isMenuOpen.value = false
}

//this is a custom directive to close the menu when clicking outside of the menu
const vCloseOnOutsideClick = {
    mounted: (el: any) => {
        el.clickOutsideEvent = (event: any) => {
            const isClickInsideElement = (el == event.target || el.contains(event.target))
            if (!isClickInsideElement) {
                closeMenu()
            }
        };
        document.addEventListener("click", el.clickOutsideEvent)
    },
    unmounted: (el: any) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    }
}

</script>
