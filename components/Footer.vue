<template>
    <footer
        role="contentinfo"
        data-testid="footer"
        class="footer flex flex-col landscape:flex-row landscape:items-center gap-3 landscape:gap-6
               border-t border-accent-bg bg-secondary-bg
               px-6 landscape:px-8 py-4 landscape:py-3
               text-sm text-primary-text"
    >
        <!-- Identity and legal -->
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 landscape:flex-none">
            <NuxtLink
                to="/"
                class="font-semibold hover:text-primary-hover transition-colors"
            >© {{ currentYear }} {{ t('footer.copyright') }}</NuxtLink>
            <span
                class="text-primary-text-muted"
                aria-hidden="true"
            >·</span>
            <NuxtLink
                to="/privacypolicy"
                class="hover:text-primary-hover transition-colors"
                data-testid="privacy-link"
            >{{ t('footer.privacy') }}</NuxtLink>
            <span
                class="text-primary-text-muted"
                aria-hidden="true"
            >·</span>
            <NuxtLink
                to="/terms"
                class="hover:text-primary-hover transition-colors"
                data-testid="terms-link"
            >{{ t('footer.terms') }}</NuxtLink>
            <span
                class="text-primary-text-muted"
                aria-hidden="true"
            >·</span>
            <NuxtLink
                to="/npo"
                class="hover:text-primary-hover transition-colors"
                data-testid="npo-link"
            >{{ t('footer.npo') }}</NuxtLink>
        </div>

        <!-- Community links -->
        <nav class="flex flex-wrap items-center gap-x-4 gap-y-1 landscape:flex-1 landscape:justify-end">
            <NuxtLink
                to="https://docs.findadoc.jp"
                target="_blank"
                rel="noopener"
                class="hover:text-primary-hover transition-colors"
                data-testid="contribute-link"
            >{{ t('footer.contribute') }}</NuxtLink>
            <NuxtLink
                to="https://forms.gle/4E763qfaq46kEsn99"
                target="_blank"
                rel="noopener"
                class="underline hover:text-primary-hover transition-colors"
                data-testid="feedback-link"
            >{{ t('footer.feedback') }} {{ t('footer.clickHere') }}</NuxtLink>
            <ThemeManager />
        </nav>

        <!-- Hosting credit, deliberately the quietest thing here -->
        <p class="text-xs text-primary-text-muted landscape:flex-none m-0">
            {{ t('footer.poweredBy') }}
            <NuxtLink
                to="https://www.netlify.com/"
                target="_blank"
                rel="noopener"
                class="underline hover:text-primary-hover transition-colors"
                data-testid="netlify-link"
            >Netlify</NuxtLink>
        </p>
    </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = new Date().getUTCFullYear()
</script>
