<template>
    <div
        data-testid="top-nav"
        class="flex flex-col mt-2 landscape:px-3 landscape:py-1 portrait:px-5 portrait:py-1  bg-primary-bg/90 rounded-lg"
    >
        <div
            class="flex justify-between items-center"
        >
            <!-- Mobile Site Icon -->
            <div
                id="mobile-site-icon"
                data-testid="portrait-logo"
                class="landscape:hidden flex justify-between items-start font-semibold text-xl
                group transition-colors pr-2 rounded-2xl"
            >
                <NuxtLink
                    to="/"
                    @click="handleMobileLogoClick"
                >
                    <SVGSiteLogo
                        role="img"
                        title="site icon"
                        class="mt-1 mr-1 w-10 h-10 shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                        @click="toggleLogoText()"
                    />
                </NuxtLink>
                <Transition
                    mode="out-in"
                    enter-active-class="transition-transform transition-opacity duration-[400ms] ease-in-out"
                    enter-from-class="-translate-x-10 opacity-0"
                    enter-to-class="translate-x-0 opacity-100"
                    leave-active-class="transition-opacity duration-[400ms] ease-in-out"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <!-- Find a Doc, Japan Logo Text -->
                    <div
                        v-show="showLogoText"
                        class="title-text flex flex-col shrink-0"
                        data-testid="landscape-logo"
                    >
                        <div class="text-lg text-primary group-hover:text-primary-hover">
                            Find a Doc
                        </div>
                        <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                            Japan
                        </div>
                    </div>
                </Transition>
            </div>
            <!-- Desktop Left Section -->
            <div class="flex">
                <!-- Desktop Site Icon -->
                <div
                    id="desktop-site-icon"
                    class="portrait:hidden mr-5 w-50 font-semibold text-xl
                group transition-colors items-start p-2 rounded-2xl"
                >
                    <NuxtLink
                        class="flex"
                        to="/"
                    >
                        <SVGSiteLogo
                            role="img"
                            title="site icon"
                            class="mr-1 w-10 h-10 shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                        />
                        <!-- Find a Doc, Japan Logo Text -->
                        <div
                            class="title-text flex flex-col shrink-0"
                            data-testid="landscape-logo"
                        >
                            <div class="text-lg text-primary group-hover:text-primary-hover">
                                Find a Doc
                            </div>
                            <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                                Japan
                            </div>
                        </div>
                    </NuxtLink>
                </div>
                <!-- Search Bar -->
                <div v-if="isLandscape">
                    <SearchBar />
                </div>
            </div>
            <!-- Desktop Right Section -->
            <div
                id="right-section"
                class="flex"
            >
                <nav
                    id="desktop-menu-items"
                    class="portrait:hidden flex gap-3 mx-6 self-center items-center whitespace-nowrap"
                >
                    <!-- About Link -->
                    <NuxtLink
                        to="/about"
                        class="hover:text-primary-hover transition-colors"
                    >{{ t('topNav.about') }}
                    </NuxtLink>
                    <!-- Home Link -->
                    <NuxtLink
                        to="/"
                        class="hover:text-primary-hover transition-colors"
                    >{{ t('topNav.home') }}
                    </NuxtLink>
                    <!-- Submit a new Doctor Link -->
                    <NuxtLink
                        to="/submit"
                        class="hover:text-primary-hover transition-colors"
                    >{{ t('topNav.submit') }}
                    </NuxtLink>
                    <!-- Profile Picture (if logged in) -->
                    <button
                        v-if="authStore.isLoggedIn"
                        data-testid="topnav-profile-section"
                        class="flex text-primary"
                        @click="toggleProfileMenu"
                    >
                        <img
                            :src="authStore.userProfileImage"
                            alt="profile icon"
                            title="profile icon"
                            class="w-8 h-8 stroke-primary inline stroke-2 rounded-full mx-1 hover:scale-105"
                        >
                    </button>
                    <!-- Login Button (if logged out)  -->
                    <div
                        v-if="!authStore.isLoggedIn"
                        data-testid="topnav-login"
                        class="flex text-primary"
                    >
                        <NuxtLink to="/login">
                            {{ t('topNav.login') }}
                        </NuxtLink>
                    </div>
                    <!-- Profile Dropdown Menu Options (if profile pic clicked) -->
                    <div
                        v-if="profileMenuIsOpen"
                        v-close-on-outside-click="toggleProfileMenu"
                        class="absolute border-2 border-primary/60 top-20 right-24
                        z-10 bg-primary-bg rounded-xl p-2 shadow-xl"
                    >
                        <div class="flex mb-3 border-b-2 p-1 pb-1 items-center">
                            <img
                                :src="authStore.userProfileImage"
                                alt="profile icon"
                                title="profile icon"
                                class="w-7 h-7 stroke-primary inline stroke-2 rounded-full"
                            >
                            <div class="ml-2 text-primary-text font-bold mb-1 text-wrap">
                                {{ authStore.userId }}
                            </div>
                        </div>
                        <NuxtLink
                            to="/settings"
                            data-testid="top-nav-mod-link"
                            class="flex mb-1 items-center text-primary-text hover:bg-primary-hover/10
                            rounded-xl p-2 transition-colors"
                        >
                            <SVGSettingsIcon
                                role="img"
                                title="moderation icon"
                                class="w-6 h-6 mr-2"
                            />
                            <div class="">
                                {{ t('topNav.settings') }}
                            </div>
                        </NuxtLink>

                        <button
                            class="flex items-center text-primary-text hover:bg-primary-hover/10
                            rounded-xl p-2"
                            @click="logout()"
                        >
                            <SVGSignOutIcon
                                role="img"
                                title="log out icon"
                                class="w-6 h-6 mr-2"
                            />
                            <div>
                                {{ t('topNav.logout') }}
                            </div>
                        </button>
                    </div>
                </nav>
                <LocaleSelector class="portrait:hidden" />
                <HamburgerMenu class="landscape:hidden justify-end z-20 p-2 bg-primary-bg/20 rounded-2xl" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import HamburgerMenu from './HamburgerMenu.vue'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import SVGSettingsIcon from '~/assets/icons/settings-icon.svg'
import SVGSignOutIcon from '~/assets/icons/sign-out-icon.svg'
import { useAuthStore } from '~/stores/authStore'
import { useScreenOrientation } from '~/composables/useScreenOrientation'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

const profileMenuIsOpen = ref(false)
const authStore = useAuthStore()
const { isLandscape } = useScreenOrientation()

const showLogoText = ref(false)

function toggleLogoText() {
    showLogoText.value = true
    setTimeout(() => {
        showLogoText.value = false
    }, 2000)
}

function toggleProfileMenu() {
    profileMenuIsOpen.value = !profileMenuIsOpen.value
}

function handleMobileLogoClick(e: Event) {
    if (router.currentRoute.value.path === '/') {
        e.preventDefault()
        toggleLogoText()
    }
}
async function logout() {
    try {
        await authStore.logout()
        toast.success(t('topNav.logoutToast'))
        router.push('/')
    } catch (error) {
        toast.error(error)
    }
}
</script>

