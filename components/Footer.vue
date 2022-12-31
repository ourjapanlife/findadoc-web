<template>
    <div class="footer flex bg-orange-100 text-sm text-current py-2">
        <div class="left-footer-section flex flex-0 justify-start">
            <span class="self-center px-2">© 2023 Find a doc JP</span>
            <nav class="flex mx-2">
                <NuxtLink to="/privacy" class="px-2 mx-auto self-center">
                    Privacy
                </NuxtLink>
            </nav>
            <span class="self-center">·</span>
            <nav class="flex mx-2">
                <NuxtLink to="/terms" class="px-2 mx-auto self-center">
                    Terms
                </NuxtLink>
            </nav>
        </div>
        <div class="middle-footer section flex flex-1 align-middle justify-center">
            <nav class="flex mx-2 self-center">
                <NuxtLink to="https://www.netlify.com/" target="_blank" class="px-2 mx-auto">
                    Deployed on Netlify
                </NuxtLink>
            </nav>
        </div>
        <div class="right-footer-section flex flex-0 flex-col gap-1 justify-end">
            <div class="flex flex-row flex-wrap">
                <span>Contribute on </span>
                <NuxtLink to="https://github.com/ourjapanlife/findadoc-web.com/" target="_blank" class="px-2 mx-auto">
                    <img alt="github icon" class="github-icon" src="@/assets/images/profileIcon.svg" width="25"
                        height="25" />
                </NuxtLink>
            </div>
            <div class="flex flex-row flex-wrap">
                <span>Got feedback?</span>
                <NuxtLink to="https://forms.gle/4E763qfaq46kEsn99" target="_blank" class="px-2 mx-auto underline">
                    Click here
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
