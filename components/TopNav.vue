<template>
    <header
        data-testid="top-nav"
        class="sticky top-0 z-30 w-full border-b border-accent-bg bg-primary-bg/90 backdrop-blur-md"
    >
        <div class="page-container flex h-16 items-center justify-between gap-4 px-6 landscape:px-12">
            <!-- Brand -->
            <NuxtLink
                to="/"
                :aria-label="t('common.siteName')"
                data-testid="site-logo"
                class="group flex shrink-0 items-center gap-2 rounded-lg"
                @click="handleHomeClick"
            >
                <SVGSiteLogo
                    role="img"
                    :aria-label="t('common.siteName')"
                    class="h-9 w-9 shrink-0 fill-primary transition-colors group-hover:fill-primary-hover"
                />
                <!--
                    Nudged up 4.5% of the mark's height. The mark is a circle with a handle
                    running down-right, so centring on its bounding box leaves the wordmark
                    visibly low — the eye reads the circle as the logo. Aligning fully to the
                    circle centre (11.9%) then overshoots, because the handle still carries
                    visual weight. Chosen by rendering 0 / 3 / 4.5 / 6 / 8 / 11.9.
                -->
                <span
                    aria-hidden="true"
                    class="flex -translate-y-[4.5%] flex-col font-semibold leading-none text-primary
                           transition-colors group-hover:text-primary-hover"
                >
                    <span class="text-base">{{ t('common.siteNameLine1') }}</span>
                    <!--
                        Nudged right 2.4px to align the ink, not the boxes. The two lines start
                        at the same x, but "F" at 16px carries a +1.49px left side bearing while
                        "J" at 12px carries -0.91px — its hook overhangs the origin — so the J
                        printed 2.4px to the left of the F and the wordmark read as ragged.
                        Both strings are the Latin brand name in every locale, so the glyphs and
                        therefore this offset are stable.
                    -->
                    <span class="translate-x-[2.4px] text-xs">{{ t('common.siteNameLine2') }}</span>
                </span>
            </NuxtLink>

            <!-- Primary navigation (landscape) -->
            <nav
                id="desktop-menu-items"
                :aria-label="t('common.menu')"
                class="flex items-center gap-1 portrait:hidden"
            >
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    :class="navLinkClass(item.to)"
                    :aria-current="isActive(item.to) ? 'page' : undefined"
                    @click="item.to === '/' ? handleHomeClick($event) : undefined"
                >
                    {{ item.label }}
                </NuxtLink>

                <!-- Signed-in menu -->
                <div
                    v-if="authStore.isLoggedIn"
                    v-close-on-outside-click="{
                        onOutside: closeProfileMenu,
                        when: () => profileMenuIsOpen,
                    }"
                    class="relative ml-1"
                >
                    <button
                        type="button"
                        data-testid="topnav-profile-section"
                        :aria-expanded="profileMenuIsOpen"
                        aria-controls="topnav-profile-menu"
                        class="inline-flex h-10 items-center gap-2 rounded-lg px-3 font-medium text-primary-text
                               transition-colors hover:bg-accent-bg/60"
                        @click="toggleProfileMenu"
                    >
                        <img
                            v-if="authStore.userProfileImage"
                            :src="authStore.userProfileImage"
                            alt=""
                            class="h-7 w-7 rounded-full object-cover"
                        >
                        <SVGUserIcon
                            v-else
                            class="h-6 w-6 text-user-icon"
                            aria-hidden="true"
                        />
                        <span class="max-w-40 truncate">{{ profileMenuLabel }}</span>
                        <SVGAccordionArrow
                            class="h-4 w-4 fill-primary-text transition-transform"
                            :class="profileMenuIsOpen ? 'rotate-180' : ''"
                            aria-hidden="true"
                        />
                    </button>

                    <div
                        v-if="profileMenuIsOpen"
                        id="topnav-profile-menu"
                        role="group"
                        :aria-label="t('topNav.myPage')"
                        class="card absolute right-0 mt-2 min-w-56 p-2 shadow-raised"
                    >
                        <NuxtLink
                            to="/my-page"
                            data-testid="top-nav-mod-link"
                            class="flex h-11 items-center gap-2 rounded-lg px-3 text-primary-text
                                   transition-colors hover:bg-primary/10"
                            @click="closeProfileMenu"
                        >
                            <SVGUserIcon
                                class="h-5 w-5 text-user-icon"
                                aria-hidden="true"
                            />
                            {{ t('topNav.myPage') }}
                        </NuxtLink>
                        <button
                            type="button"
                            class="flex h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-primary-text
                                   transition-colors hover:bg-primary/10"
                            @click="logout"
                        >
                            <SVGSignOutIcon
                                class="h-5 w-5 fill-current"
                                aria-hidden="true"
                            />
                            {{ t('topNav.logout') }}
                        </button>
                    </div>
                </div>

                <NuxtLink
                    v-else
                    :to="loginRoute"
                    data-testid="topnav-login"
                    :class="navLinkClass('/login')"
                >
                    {{ t('topNav.login') }}
                </NuxtLink>
            </nav>

            <div class="flex items-center gap-2">
                <LocaleSelector class="portrait:hidden" />
                <HamburgerMenu class="landscape:hidden" />
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAppToast } from '~/composables/useAppToast'
import HamburgerMenu from './HamburgerMenu.vue'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import SVGAccordionArrow from '~/assets/icons/accordion-arrow.svg'
import SVGUserIcon from '~/assets/icons/user-icon.svg'
import SVGSignOutIcon from '~/assets/icons/sign-out-icon.svg'
import { useAuthStore } from '~/stores/authStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'
import { vCloseOnOutsideClick } from '~/composables/closeOnOutsideClick'
import { buildLoginRoute, resolveAuthReturnPath } from '~/utils/auth0Config'
import { isMyPageFormRoute, leaveToAppHome } from '~/utils/moderationUtils'

const { t } = useI18n()
const toast = useAppToast()
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const moderationScreenStore = useModerationScreenStore()
const moderationSubmissionUnsavedStore = useModerationSubmissionUnsavedStore()
const modalStore = useModalStore()

const profileMenuIsOpen = ref(false)
const profileMenuLabel = computed(() => authStore.userId || t('topNav.myPage'))

const loginRoute = computed(() => buildLoginRoute(
    route.path === '/login' ? resolveAuthReturnPath(route.fullPath) : route.fullPath
))

const navItems = computed(() => [
    { to: '/', label: t('topNav.home') },
    { to: '/search', label: t('topNav.search') },
    { to: '/about', label: t('topNav.about') },
    { to: '/submit', label: t('topNav.submit') }
])

function isActive(path: string): boolean {
    return path === '/'
        ? route.path === '/'
        : route.path === path || route.path.startsWith(`${path}/`)
}

function navLinkClass(path: string): string {
    // whitespace-nowrap: German and Portuguese labels wrap inside the fixed-height link without it.
    const base = 'inline-flex h-10 items-center whitespace-nowrap rounded-lg px-3 font-medium transition-colors'

    return isActive(path)
        ? `${base} bg-primary/10 text-primary-hover`
        : `${base} text-primary-text-muted hover:bg-accent-bg/60 hover:text-primary-text`
}

function toggleProfileMenu() {
    profileMenuIsOpen.value = !profileMenuIsOpen.value
}

function closeProfileMenu() {
    profileMenuIsOpen.value = false
}

/**
 * Leaving a half-edited moderation form goes through the unsaved-changes guard rather
 * than straight to the homepage.
 */
function handleHomeClick(event: MouseEvent) {
    if (!isMyPageFormRoute(route.path)) {
        return
    }

    event.preventDefault()
    moderationSubmissionUnsavedStore.runLeaveOr(() =>
        leaveToAppHome(router, moderationScreenStore, modalStore))
}

async function logout() {
    closeProfileMenu()

    try {
        await authStore.logout()
        toast.success(t('topNav.logoutToast'))
        router.push('/')
    } catch (error) {
        toast.error(error)
    }
}
</script>
