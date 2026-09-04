<template>
    <div
        data-testid="hamburger-menu-container"
        class="flex items-center"
    >
        <button
            ref="triggerRef"
            type="button"
            :aria-label="t('common.menu')"
            :aria-expanded="isMenuOpen"
            aria-controls="hamburger-menu-panel"
            class="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-accent-bg/60"
            data-testid="hamburger-menu-icon"
            @click="openMenu"
        >
            <SVGHamburgerMenuIcon
                class="h-7 w-7 fill-primary"
                aria-hidden="true"
            />
        </button>

        <Teleport to="body">
            <!-- Backdrop -->
            <Transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                leave-active-class="transition-opacity duration-150"
                leave-to-class="opacity-0"
            >
                <div
                    v-show="isMenuOpen"
                    class="fixed inset-0 z-40 bg-scrim/50"
                    aria-hidden="true"
                    @click="closeMenu"
                />
            </Transition>

            <!-- Panel -->
            <Transition
                enter-active-class="transition-transform duration-250 ease-out"
                enter-from-class="translate-x-full"
                leave-active-class="transition-transform duration-200 ease-in"
                leave-to-class="translate-x-full"
            >
                <div
                    v-show="isMenuOpen"
                    id="hamburger-menu-panel"
                    ref="panelRef"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="t('common.menu')"
                    data-testid="hamburger-menu"
                    class="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col
                           border-l border-accent-bg bg-primary-bg shadow-overlay"
                >
                    <!-- Header -->
                    <div
                        data-testid="hamburger-header"
                        class="flex h-16 shrink-0 items-center justify-between border-b border-accent-bg px-4"
                    >
                        <span
                            class="font-semibold text-primary"
                            data-testid="logo"
                        >{{ t('common.siteName') }}</span>
                        <button
                            ref="closeButtonRef"
                            type="button"
                            data-testid="hamburger-menu-close-button"
                            :aria-label="t('common.close')"
                            class="inline-flex h-11 w-11 items-center justify-center rounded-lg
                                   transition-colors hover:bg-accent-bg/60"
                            @click="closeMenu"
                        >
                            <svg
                                class="h-5 w-5 stroke-primary"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                aria-hidden="true"
                            >
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                        <!-- Language -->
                        <div
                            data-testid="hamburger-menu-language-section"
                            class="flex items-center justify-between gap-3 border-b border-accent-bg px-4 py-3"
                        >
                            <span class="text-sm font-semibold text-primary-text-muted">
                                {{ t('hamburgerMenu.languageDropdownTitle') }}
                            </span>
                            <LocaleSelector />
                        </div>

                        <!-- Links -->
                        <nav
                            data-testid="hamburger-menu-items"
                            :aria-label="t('common.menu')"
                            class="flex flex-col gap-1 px-2 py-3"
                        >
                            <NuxtLink
                                v-for="item in navItems"
                                :key="item.to"
                                :to="item.to"
                                :target="item.external ? '_blank' : undefined"
                                :rel="item.external ? 'noopener' : undefined"
                                :class="menuLinkClass(item.to)"
                                @click="item.to === '/' ? handleHomeClick($event) : closeMenu()"
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </nav>

                        <!-- Account -->
                        <div class="border-t border-accent-bg px-2 py-3">
                            <template v-if="authStore.isLoggedIn">
                                <div class="flex items-center gap-2 px-3 py-2 text-primary-text">
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
                                    <span class="truncate font-semibold">{{ authStore.userId }}</span>
                                </div>
                                <NuxtLink
                                    to="/my-page"
                                    :class="menuLinkClass('/my-page')"
                                    @click="closeMenu"
                                >
                                    {{ t('topNav.myPage') }}
                                </NuxtLink>
                                <button
                                    type="button"
                                    :class="menuLinkClass('')"
                                    class="w-full text-left"
                                    @click="logout"
                                >
                                    {{ t('hamburgerMenu.logout') }}
                                </button>
                            </template>
                            <NuxtLink
                                v-else
                                :to="loginRoute"
                                :class="menuLinkClass('/login')"
                                @click="closeMenu"
                            >
                                {{ t('hamburgerMenu.login') }}
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        data-testid="hamburger-menu-footer-section"
                        class="shrink-0 border-t border-accent-bg px-4 py-4"
                    >
                        <ThemeManager class="mb-4" />

                        <div
                            data-testid="hamburger-menu-footer-legal"
                            class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                        >
                            <NuxtLink
                                to="/terms"
                                data-testid="hamburger-menu-footer-legal-terms"
                                class="inline-flex min-h-11 items-center text-primary-text-muted
                                       transition-colors hover:text-primary"
                                @click="closeMenu"
                            >{{ t('footer.terms') }}</NuxtLink>
                            <NuxtLink
                                to="/privacypolicy"
                                data-testid="hamburger-menu-footer-legal-privacy"
                                class="inline-flex min-h-11 items-center text-primary-text-muted
                                       transition-colors hover:text-primary"
                                @click="closeMenu"
                            >{{ t('footer.privacy') }}</NuxtLink>
                            <NuxtLink
                                to="/npo"
                                data-testid="hamburger-menu-footer-legal-npo"
                                class="inline-flex min-h-11 items-center text-primary-text-muted
                                       transition-colors hover:text-primary"
                                @click="closeMenu"
                            >{{ t('footer.npo') }}</NuxtLink>
                            <NuxtLink
                                to="https://github.com/ourjapanlife"
                                target="_blank"
                                rel="noopener"
                                aria-label="GitHub"
                                class="inline-flex min-h-11 min-w-11 items-center justify-center
                                       text-primary-text-muted transition-colors hover:text-primary"
                            >
                                <!-- The mark carries a hardcoded dark fill, invisible on the dark ground. -->
                                <SVGGithubIcon
                                    data-testid="hamburger-menu-github-icon"
                                    class="h-5 w-5 [&_path]:fill-current"
                                    aria-hidden="true"
                                />
                            </NuxtLink>
                        </div>

                        <p
                            data-testid="hamburger-menu-footer-copyright"
                            class="m-0 mt-3 text-xs text-primary-text-muted"
                        >
                            © {{ currentYear }} {{ t('hamburgerMenu.copyright') }}
                        </p>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAppToast } from '~/composables/useAppToast'
import { useScrollLock } from '~/composables/useScrollLock'
import { useFocusTrap } from '~/composables/useFocusTrap'
import SVGHamburgerMenuIcon from '~/assets/icons/hamburger-menu.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import SVGUserIcon from '~/assets/icons/user-icon.svg'
import { useAuthStore } from '~/stores/authStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'
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

const isMenuOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const currentYear = new Date().getUTCFullYear()

const loginRoute = computed(() => buildLoginRoute(
    route.path === '/login' ? resolveAuthReturnPath(route.fullPath) : route.fullPath
))

const navItems = computed(() => [
    { to: '/', label: t('topNav.home') },
    { to: '/search', label: t('topNav.search') },
    { to: '/about', label: t('topNav.about') },
    { to: '/submit', label: t('topNav.submit') },
    { to: 'https://forms.gle/4E763qfaq46kEsn99', label: t('about.involveFeedback'), external: true }
])

function isActive(path: string): boolean {
    if (!path) return false
    return path === '/'
        ? route.path === '/'
        : route.path === path || route.path.startsWith(`${path}/`)
}

function menuLinkClass(path: string): string {
    const base = 'flex min-h-11 items-center rounded-lg px-3 font-medium transition-colors'

    return isActive(path)
        ? `${base} bg-primary/10 text-primary`
        : `${base} text-primary-text hover:bg-accent-bg/60`
}

function openMenu() {
    isMenuOpen.value = true
}

function closeMenu() {
    isMenuOpen.value = false
}

/*
 * Tab cycles inside the panel and Escape is bound to the document, so the dialog honours the
 * aria-modal it declares. Focus moves to the close button on open and back to the trigger on
 * close, both handled by the trap.
 */
useFocusTrap(panelRef, isMenuOpen, { onEscape: closeMenu, initialFocus: closeButtonRef })

// Released on unmount as well as on close, and reference-counted so closing this sheet cannot
// unlock the page while the search details panel is still open.
useScrollLock(isMenuOpen)

function handleHomeClick(event: MouseEvent) {
    closeMenu()

    if (!isMyPageFormRoute(route.path)) {
        return
    }

    event.preventDefault()
    moderationSubmissionUnsavedStore.runLeaveOr(() =>
        leaveToAppHome(router, moderationScreenStore, modalStore))
}

async function logout() {
    closeMenu()

    try {
        await authStore.logout()
        toast.success(t('hamburgerMenu.logoutToast'))
        router.push('/')
    } catch (error) {
        toast.error(error)
    }
}
</script>
