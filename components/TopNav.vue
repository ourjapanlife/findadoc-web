<template>
    <div class="flex flex-col mt-2 landscape:p-4 portrait:px-5 portrait:py-1  bg-primary-bg/90 rounded-lg">
        <div
            class="flex justify-between items-center"
        >
            <!-- Mobile Site Icon -->
            <div
                id="mobile-site-icon"
                class="landscape:hidden flex justify-between items-start font-semibold text-xl
                group transition-colors pr-2 rounded-2xl"
            >
                <SVGSiteLogo
                    role="img"
                    title="site icon"
                    class="mt-1 mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                    @click="toggleLogoText()"
                />
                <Transition
                    name="slide-left"
                    mode="out-in"
                >
                    <!-- Find a Doc, Japan Logo Text -->
                    <div
                        v-show="showLogoText"
                        class="title-text flex flex-col flex-shrink-0"
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
            <!-- Desktop Site Icon -->
            <div
                id="desktop-site-icon"
                class="portrait:hidden w-52 font-semibold text-xl
                group transition-colors items-start p-2 bg-primary-bg/60 rounded-2xl"
            >
                <NuxtLink
                    class="flex"
                    to="/"
                >
                    <SVGSiteLogo
                        role="img"
                        title="site icon"
                        class="mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                    />
                    <!-- Find a Doc, Japan Logo Text -->
                    <div
                        class="title-text flex flex-col flex-shrink-0"
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
            <div v-if="useScreenOrientation().isLandscape.value">
                <SearchBar class="mx-4" />
            </div>
            <!-- Right Section -->
            <div
                id="right-section"
                class="flex"
            >
                <nav
                    id="desktop-menu-items"
                    class="portrait:hidden flex gap-4 mx-6 self-center whitespace-nowrap"
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
                    <!-- Profile Section -->
                    <div
                        v-if="authStore.isLoggedIn"
                        data-testid="topnav-profile-section"
                        class="flex text-primary"
                    >
                        <!-- Moderation Link -->
                        <NuxtLink
                            to="/moderation"
                            class="hover:text-primary-hover transition-colors text-wrap mr-4"
                            data-testid="top-nav-mod-link"
                        >{{
                            t('topNav.moderation') }}
                        </NuxtLink>
                        <!-- Logout Link -->
                        <NuxtLink
                            to="/"
                            class="mr-4"
                        >
                            <div
                                class="text-primary"
                                @click="logout()"
                            >
                                {{ t('topNav.logout') }}
                            </div>
                        </NuxtLink>
                        <div class="flex">
                            <!-- Profile Icon -->
                            <img
                                :src="authStore.userProfileImage || '~/assets/icons/profile-icon.svg'"
                                alt="profile icon"
                                title="profile icon"
                                class="profile-icon w-7 stroke-primary inline stroke-2 rounded-full mx-1"
                            >
                            <!-- User ID -->
                            <div class="text-primary font-bold">
                                {{ authStore.userId }}
                            </div>
                        </div>
                    </div>
                </nav>
                <LocaleSelector class="portrait:hidden" />
                <HamburgerMenu class="landscape:hidden justify-end z-20 p-2 bg-primary-bg/20 rounded-2xl" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import HamburgerMenu from './HamburgerMenu.vue'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import { useAuthStore } from '~/stores/authStore'

const { t } = useI18n()

const authStore = useAuthStore()

const showLogoText = ref(false)

function toggleLogoText() {
    showLogoText.value = true
    setTimeout(() => {
        showLogoText.value = false
    }, 2000)
}

async function logout() {
    await authStore.logout()
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(0);
  opacity: 0;
}
</style>
