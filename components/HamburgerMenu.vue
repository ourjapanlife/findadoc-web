<template>
    <div class="cursor-pointer w-full flex" v-close-on-outside-click>
        <img id="hamburger-menu-icon" @click="menuStore.toggleMenu()" src="../assets/images/hamburger-menu.svg"
            alt="hamburger menu" />
        <div id="hamburger-menu" v-show="menuStore.isMenuOpen"
            class="z-20 absolute top-0 left-0 h-full w-2/3 py-8 rounded bg-primary-bg border-2 flex flex-col justify-between">
            <div id="upper-section">
                <div id="header" class="flex flex-row pt-3 px-2">
                    <button id="close-button" @click="menuStore.closeMenu()" class="bg-primary-inverted rounded-lg px-2 py-.5 mr-2
                group hover:bg-primary-hover transition-all duration-200">
                        <span class="close-icon">
                            <svg class="stroke-primary group-hover:stroke-primary-inverted" width="20" heigh="20"
                                viewBox="4 0 15 25">
                                <path stroke-width="3" fill="none" d="M6.25,6.25,17.75,17.75" />
                                <path stroke-width="3" fill="none" d="M6.25,17.75,17.75,6.25" />
                            </svg>
                        </span>
                    </button>
                    <div class="flex">
                        <div class="title-text flex flex-col flex-shrink-0" data-testid="logo">
                            <div class="text-lg text-primary group-hover:text-primary-hover">
                                Find a Doc, Japan
                            </div>
                        </div>
                    </div>
                </div>
                <div id="menu-items" class="mt-10 px-5">
                    <div id="menu-item" class="my-8" v-for="(item, index) in menuStore.hamburgerMenuItems" :key="index">
                        <NuxtLink :to="item.route">
                            <span @click="menuStore.toggleMenu()"
                                class="block hover:-translate-y-1 hover:scale-110 duration-300">
                                {{ $t(item.displayText) }}
                            </span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div id="language-section" class="flex flex-col justify-between mt-4 px-5">
                <span class="text-primary-text pl-1 my-1">{{ $t('hamburgerMenu.languageDropdownTitle') }}</span>
                <LocaleSelector class="w-full py-1.5 text-primary-text bg-primary-bg transition-all" />
                <!-- <select v-model="selectedLanguage"
                    class="rounded-r-md rounded-l-md w-full px-1 border-2 border-primary/60 py-1.5
                                drop-shadow-md text-primary-text bg-primary-bg hover:bg-primary-hover/10 transition-all"
                    data-testid="search-bar-language">
                    <option value="" class="text-primary-text-muted hidden" disabled selected>
                        {{ $t('searchBar.selectLanguage') }}
                    </option>
                    <option :key="language.code" :value="language.code"
                        v-for="(language, index) in languageDropdownOptions">
                        {{ language.simpleText }}
                    </option>
                </select> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import { ref, Ref } from 'vue'
// import { LocaleDisplay, useLocaleStore } from '~/stores/localeStore'
import { useMenuStore } from "~/stores/menuStore"
// import { Locale } from "~/typedefs/gqlTypes"

const menuStore = useMenuStore()
// const localeStore = useLocaleStore()

// const selectedLanguage: Ref<Locale | String> = ref('')
// const languageOptions = [{
//     code: '',
//     simpleText: '----Any----',
//     displayText: '----Any----'
// }, ...localeStore.mvpLocaleDisplayOptions]
// const languageDropdownOptions: Ref<LocaleDisplay[]> = ref(languageOptions)

//this is a custom directive to close the menu when clicking outside of the menu
const vCloseOnOutsideClick = {
    mounted: (el: any) => {
        el.clickOutsideEvent = (event: any) => {
            const isClickInsideElement = (el == event.target || el.contains(event.target))
            if (!isClickInsideElement) {
                menuStore.closeMenu()
            }
        };
        document.addEventListener("click", el.clickOutsideEvent)
    },
    unmounted: (el: any) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    }
}

</script>
