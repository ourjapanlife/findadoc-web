<template>
    <div
        data-testid="footer"
        class="footer portrait:hidden flex border-t-4 border-secondary-bg/40 bg-secondary-bg
        text-sm text-primary-text font-semibold py-2 sm:flex-col sm:flex-wrap sm:justify-start"
    >
        <div class="left-footer-section flex flex-0 justify-start sm:self-center">
            <NuxtLink
                to="/"
                class="self-center ml-8 mr-2 hover:text-primary-hover transition-colors"
            >© {{ new
                Date().getUTCFullYear() }} {{ t('footer.copyright') }}</NuxtLink>
            <span class="self-center">·</span>
            <nav class="flex mx-2">
                <NuxtLink
                    to="/privacypolicy"
                    class="self-center hover:text-primary-hover transition-colors"
                    data-testid="privacy-link"
                >{{ t('footer.privacy') }}</NuxtLink>
            </nav>
            <span class="self-center">·</span>
            <nav class="flex mx-2">
                <NuxtLink
                    to="/terms"
                    class="self-center hover:text-primary-hover transition-colors"
                    data-testid="terms-link"
                >{{ t('footer.terms') }}</NuxtLink>
            </nav>
        </div>
        <div class="middle-footer-section flex flex-1 align-middle justify-center sm:self-center">
            <span class="self-center">{{ t('footer.poweredBy') }}</span>
            <nav class="flex mx-2 self-center">
                <NuxtLink
                    to="https://www.netlify.com/"
                    target="_blank"
                    class="underline hover:text-primary-hover transition-colors"
                    data-testid="netlify-link"
                >Netlify
                </NuxtLink>
            </nav>
        </div>
        <div class="right-footer-section flex flex-0 flex-row gap-6 justify-end px-8 text-xs sm:self-center">
            <div class="mx-2 hover:text-primary-hover transition-colors">
                <NuxtLink
                    to="https://github.com/ourjapanlife/findadoc-web/"
                    target="_blank"
                    class="flex flex-col flex-wrap"
                    data-testid="github-link"
                >
                    <div>{{ t('footer.contribute') }}</div>
                    <div class="self-center">
                        GitHub
                    </div>
                </NuxtLink>
            </div>
            <span class="self-center">·</span>
            <div class="flex flex-col flex-wrap hover:text-primary-hover transition-colors">
                <span>{{ t('footer.feedback') }}</span>
                <NuxtLink
                    to="https://forms.gle/4E763qfaq46kEsn99"
                    target="_blank"
                    class="px-2 mx-auto underline font-bold"
                    data-testid="feedback-link"
                >{{ t('footer.clickHere') }}</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
