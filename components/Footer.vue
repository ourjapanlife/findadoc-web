<template>
    <div class="footer flex border-t-4 border-secondary-bg/40 bg-secondary-bg text-sm
        text-primary-text font-semibold py-2">
        <div class="left-footer-section flex flex-0 justify-start">
            <NuxtLink to="/" class="self-center ml-8 mr-2 hover:text-primary-hover transition-colors">
                © {{ new Date().getUTCFullYear() }} Find a Doc, Japan
            </NuxtLink>
            <span class="self-center">·</span>
            <nav class="flex mx-2">
                <NuxtLink to="/privacypolicy" class="self-center hover:text-primary-hover transition-colors"
                    data-testid="privacy-link">
                    Privacy
                </NuxtLink>
            </nav>
            <span class="self-center">·</span>
            <nav class="flex mx-2">
                <NuxtLink to="/terms" class="self-center hover:text-primary-hover transition-colors"
                    data-testid="terms-link">
                    Terms
                </NuxtLink>
            </nav>
        </div>
        <div class="middle-footer section flex flex-1 align-middle justify-center">
            <span class="self-center">Powered by</span>
            <nav class="flex mx-2 self-center">
                <NuxtLink to="https://www.netlify.com/" target="_blank"
                    class="underline hover:text-primary-hover transition-colors" data-testid="netlify-link">
                    Netlify
                </NuxtLink>
            </nav>
        </div>
        <div class="right-footer-section flex flex-0 flex-row gap-6 justify-end px-8 text-xs">
            <div class="mx-2 hover:text-primary-hover transition-colors">
                <NuxtLink to="https://github.com/ourjapanlife/findadoc-web/" target="_blank"
                    class="flex flex-col flex-wrap " data-testid="github-link">
                    <div>Contribute on</div>
                    <div class="self-center">
                        GitHub
                    </div>
                </NuxtLink>
            </div>
            <span class="self-center">·</span>
            <div class="flex flex-col flex-wrap hover:text-primary-hover transition-colors">
                <span>Got feedback?</span>
                <NuxtLink to="https://forms.gle/4E763qfaq46kEsn99" target="_blank" class="px-2 mx-auto underline font-bold"
                    data-testid="feedback-link">
                    Click here
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
