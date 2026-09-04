<template>
    <footer
        role="contentinfo"
        data-testid="footer"
        class="w-full border-t border-accent-bg bg-secondary-bg text-primary-text"
    >
        <div
            class="page-container grid gap-10 px-6 py-12 landscape:grid-cols-[1.6fr_1fr_1fr_1fr] landscape:px-12"
        >
            <!-- Brand -->
            <div class="flex flex-col gap-3">
                <NuxtLink
                    to="/"
                    class="flex w-fit items-center gap-2 font-semibold text-primary"
                >
                    <SVGSiteLogo
                        class="h-8 w-8 fill-primary"
                        aria-hidden="true"
                    />
                    <span>{{ t('common.siteName') }}</span>
                </NuxtLink>
                <p class="max-w-xs text-primary-text-muted">
                    {{ t('about.heroSubheading') }}
                </p>
            </div>

            <!-- Explore -->
            <nav :aria-label="t('footer.exploreHeading')">
                <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                    {{ t('footer.exploreHeading') }}
                </h3>
                <ul class="m-0 flex list-none flex-col gap-2 p-0">
                    <li>
                        <NuxtLink
                            to="/search"
                            :class="footerLink"
                        >{{ t('topNav.search') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/about"
                            :class="footerLink"
                        >{{ t('topNav.about') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/submit"
                            :class="footerLink"
                        >{{ t('topNav.submit') }}</NuxtLink>
                    </li>
                </ul>
            </nav>

            <!-- Community -->
            <nav :aria-label="t('footer.communityHeading')">
                <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                    {{ t('footer.communityHeading') }}
                </h3>
                <ul class="m-0 flex list-none flex-col gap-2 p-0">
                    <li>
                        <NuxtLink
                            to="https://docs.findadoc.jp"
                            target="_blank"
                            rel="noopener"
                            :class="footerLink"
                            data-testid="contribute-link"
                        >{{ t('footer.contribute') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="https://forms.gle/4E763qfaq46kEsn99"
                            target="_blank"
                            rel="noopener"
                            :class="footerLink"
                            data-testid="feedback-link"
                        >{{ t('about.involveFeedback') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="https://github.com/ourjapanlife"
                            target="_blank"
                            rel="noopener"
                            :class="footerLink"
                        >GitHub</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="https://www.linkedin.com/company/find-a-doc-japan/"
                            target="_blank"
                            rel="noopener"
                            :class="footerLink"
                        >LinkedIn</NuxtLink>
                    </li>
                </ul>
            </nav>

            <!-- Legal -->
            <nav :aria-label="t('footer.legalHeading')">
                <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-text-muted">
                    {{ t('footer.legalHeading') }}
                </h3>
                <ul class="m-0 flex list-none flex-col gap-2 p-0">
                    <li>
                        <NuxtLink
                            to="/privacypolicy"
                            :class="footerLink"
                            data-testid="privacy-link"
                        >{{ t('footer.privacy') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/terms"
                            :class="footerLink"
                            data-testid="terms-link"
                        >{{ t('footer.terms') }}</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/npo"
                            :class="footerLink"
                            data-testid="npo-link"
                        >{{ t('footer.npo') }}</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="border-t border-accent-bg">
            <div
                class="page-container flex flex-col gap-4 px-6 py-4 text-sm text-primary-text-muted
                       landscape:flex-row landscape:items-center landscape:justify-between landscape:px-12"
            >
                <p class="m-0">
                    © {{ currentYear }} {{ t('footer.copyright') }}
                </p>
                <ThemeManager />
                <!-- Hosting credit, deliberately the quietest thing here -->
                <p class="m-0 text-xs">
                    {{ t('footer.poweredBy') }}
                    <NuxtLink
                        to="https://www.netlify.com/"
                        target="_blank"
                        rel="noopener"
                        class="underline underline-offset-4 transition-colors hover:text-primary"
                        data-testid="netlify-link"
                    >Netlify</NuxtLink>
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'

const { t } = useI18n()

const currentYear = new Date().getUTCFullYear()

// One place for the link treatment rather than a scoped stylesheet, which Tailwind v4 cannot @apply into.
const footerLink = 'inline-flex min-h-11 items-center text-primary-text transition-colors hover:text-primary'
</script>

