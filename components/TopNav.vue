<template>
    <div class="flex flex-col landscape:p-4 portrait:px-4 mx-2 bg-primary-bg/95 rounded-b-lg">
        <div
            class="flex justify-between items-center"
        >
            <!-- Mobile Site Icon -->
            <div
                id="mobile-site-icon"
                class="landscape:hidden font-semibold text-xl group transition-colors flex justify-between items-start"
            >
                <SVGSiteLogo
                    role="img"
                    title="site icon"
                    class="mt-1 mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                />
                <!-- Find a Doc, Japan Logo Text -->
                <div
                    v-show="!isSearchPage"
                    class="title-text flex flex-col flex-shrink-0"
                    data-testid="portrait-logo"
                >
                    <div class="text-lg text-primary group-hover:text-primary-hover">
                        Find a Doc,
                    </div>
                    <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                        Japan
                    </div>
                </div>
            </div>
            <!-- Desktop Site Icon -->
            <div
                id="desktop-site-icon"
                class="portrait:hidden font-semibold text-xl group transition-colors items-start w-52"
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
                        <!-- Profile Icon -->
                        <SVGProfileIcon
                            role="img"
                            alt="profile icon"
                            title="profile icon"
                            class="profile-icon w-7 stroke-primary inline stroke-2"
                        />
                        <!-- User ID -->
                        <div class="text-primary font-bold">
                            {{ authStore.userId }}
                        </div>
                    </div>
                </nav>
                <LocaleSelector class="portrait:hidden" />
                <HamburgerMenu class="landscape:hidden justify-end z-20" />
            </div>
        </div>
        <!-- Second row -->
        <div
            v-show="isSearchPage"
            data-testid="searchbar"
            class="flex justify-center grow"
        >
            <SearchBar />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import HamburgerMenu from './HamburgerMenu.vue'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import { useAuthStore } from '~/stores/authStore'

const { t } = useI18n()

const authStore = useAuthStore()
const route = useRoute()
const isSearchPage = computed(() => route.path === '/')

async function logout() {
    await authStore.logout()
}
</script>
