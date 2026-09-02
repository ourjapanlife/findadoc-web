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
                    :aria-label="t('common.siteName')"
                    @click="handleHomeClick"
                >
                    <SVGSiteLogo
                        role="img"
                        :aria-label="t('common.siteName')"
                        class="mt-1 mr-1 w-10 h-10 shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
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
                        role="img"
                        :aria-label="t('common.siteName')"
                        class="title-text flex flex-col shrink-0"
                        data-testid="landscape-logo"
                    >
                        <div class="text-lg text-primary group-hover:text-primary-hover">
                            {{ t('common.siteNameLine1') }}
                        </div>
                        <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                            {{ t('common.siteNameLine2') }}
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
                        class="flex items-center"
                        to="/"
                        :aria-label="t('common.siteName')"
                        @click="handleHomeClick"
                    >
                        <SVGSiteLogo
                            role="img"
                            :aria-label="t('common.siteName')"
                            class="mr-1 w-10 h-10 shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                        />
                        <!-- Find a Doc, Japan Logo Text -->
                        <!--
                            Nudged up 4.5% of the mark's height. The mark is a circle with
                            a handle running down-right, so centring on its bounding box
                            leaves the wordmark visibly low — the eye reads the circle as
                            the logo. Aligning fully to the circle centre (11.9%) then
                            overshoots, because the handle still carries visual weight.
                            4.5% puts "Find a Doc" level with the lens and "Japan" against
                            the handle; chosen by rendering 0 / 3 / 4.5 / 6 / 8 / 11.9.
                        -->
                        <div
                            role="img"
                            :aria-label="t('common.siteName')"
                            class="title-text flex flex-col shrink-0 -translate-y-[4.5%]"
                            data-testid="landscape-logo"
                        >
                            <div class="text-lg text-primary group-hover:text-primary-hover">
                                {{ t('common.siteNameLine1') }}
                            </div>
                            <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                                {{ t('common.siteNameLine2') }}
                            </div>
                        </div>
                    </NuxtLink>
                </div>
                <!-- Search Bar (hide on moderation/admin-style routes) -->
                <div v-if="showGlobalSearch">
                    <SearchBar />
                </div>
            </div>
            <!-- Desktop Right Section -->
            <div
                id="right-section"
                class="flex items-center"
            >
                <nav
                    id="desktop-menu-items"
                    class="portrait:hidden flex mx-6 items-end whitespace-nowrap border-b border-accent-bg"
                >
                    <NuxtLink
                        to="/"
                        :class="navLinkClass('/')"
                        @click="handleHomeClick"
                    >{{ t('topNav.home') }}
                    </NuxtLink>
                    <NuxtLink
                        to="/about"
                        :class="navLinkClass('/about')"
                    >{{ t('topNav.about') }}
                    </NuxtLink>
                    <NuxtLink
                        to="/submit"
                        :class="navLinkClass('/submit')"
                    >{{ t('topNav.submit') }}
                    </NuxtLink>
                    <!-- My Page menu trigger (if logged in) -->
                    <div
                        v-if="authStore.isLoggedIn"
                        v-close-on-outside-click="{
                            onOutside: closeProfileMenu,
                            when: () => profileMenuIsOpen,
                        }"
                        class="relative"
                    >
                        <button
                            data-testid="topnav-profile-section"
                            class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-text
                            border-b-2 -mb-px border-transparent hover:text-primary-text transition-colors"
                            @click="toggleProfileMenu"
                        >
                            <span class="max-w-44 truncate font-medium">
                                {{ profileMenuLabel }}
                            </span>
                            <SVGAccordionArrow
                                class="w-4 h-4 fill-primary-text transition-transform"
                                :class="profileMenuIsOpen ? 'rotate-180' : ''"
                                aria-hidden="true"
                            />
                        </button>
                        <!-- Profile Dropdown Menu Options -->
                        <div
                            v-if="profileMenuIsOpen"
                            class="absolute right-0 mt-2 border-2 border-primary/60
                            z-10 bg-primary-bg rounded-xl p-2 shadow-xl min-w-56"
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
                                to="/my-page"
                                data-testid="top-nav-mod-link"
                                class="flex mb-1 items-center text-primary-text hover:bg-primary-hover/10
                                rounded-xl p-2 transition-colors"
                            >
                                <SVGUserIcon
                                    role="img"
                                    title="my page icon"
                                    class="w-6 h-6 mr-2 text-user-icon"
                                />
                                <div class="">
                                    {{ t('topNav.myPage') }}
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
                    </div>
                    <NuxtLink
                        v-if="!authStore.isLoggedIn"
                        :to="loginRoute"
                        data-testid="topnav-login"
                        :class="navLinkClass('/login')"
                    >
                        {{ t('topNav.login') }}
                    </NuxtLink>
                </nav>
                <LocaleSelector class="portrait:hidden" />
                <HamburgerMenu class="landscape:hidden justify-end z-20 p-2 bg-primary-bg/20 rounded-2xl" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAppToast } from '~/composables/useAppToast'
import { useRoute, useRouter } from 'vue-router'
import HamburgerMenu from './HamburgerMenu.vue'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import SVGAccordionArrow from '~/assets/icons/accordion-arrow.svg'
import SVGUserIcon from '~/assets/icons/user-icon.svg'
import SVGSignOutIcon from '~/assets/icons/sign-out-icon.svg'
import { useAuthStore } from '~/stores/authStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'
import { useScreenOrientation } from '~/composables/useScreenOrientation'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'
import { buildLoginRoute, resolveAuthReturnPath } from '~/utils/auth0Config'
import { isMyPageFormRoute, leaveToAppHome } from '~/utils/moderationUtils'

const { t } = useI18n()
const toast = useAppToast()
const router = useRouter()
const route = useRoute()

const loginRoute = computed(() => buildLoginRoute(
    route.path === '/login' ? resolveAuthReturnPath(route.fullPath) : route.fullPath
))
const profileMenuIsOpen = ref(false)
const authStore = useAuthStore()
const moderationScreenStore = useModerationScreenStore()
const moderationSubmissionUnsavedStore = useModerationSubmissionUnsavedStore()
const modalStore = useModalStore()
const { isLandscape } = useScreenOrientation()
const showGlobalSearch = computed(() =>
    isLandscape.value
    && !route.path.startsWith('/moderation')
    && !route.path.startsWith('/my-page'))

const showLogoText = ref(false)
const profileMenuLabel = computed(() => authStore.userId || t('topNav.myPage'))

function toggleLogoText() {
    showLogoText.value = true
    setTimeout(() => {
        showLogoText.value = false
    }, 2000)
}

function toggleProfileMenu() {
    profileMenuIsOpen.value = !profileMenuIsOpen.value
}

function closeProfileMenu() {
    profileMenuIsOpen.value = false
}

function handleHomeClick(event: MouseEvent) {
    if (route.path === '/') {
        event.preventDefault()
        toggleLogoText()
        return
    }

    if (!isMyPageFormRoute(route.path)) {
        return
    }

    event.preventDefault()
    moderationSubmissionUnsavedStore.runLeaveOr(() =>
        leaveToAppHome(router, moderationScreenStore, modalStore))
}

function navLinkClass(path: string): string {
    const isActive = path === '/'
        ? route.path === '/'
        : route.path === path || route.path.startsWith(`${path}/`)
    const base = 'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px'

    return isActive
        ? `${base} border-primary text-primary-text`
        : `${base} border-transparent text-primary-text-muted hover:text-primary-text`
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

