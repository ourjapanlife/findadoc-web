<template>
    <div class="h-screen flex flex-col font-['notosans'] theme-coral">
        <div class="flex flex-col">
            <div class="flex flex-1 flex-col items-center mt-14">
                <span class="border-2 border-currentColor text-currentColor rounded-lg px-3 py-0">
                    Coming Soon
                </span>
                <span class="portrait:text-3xl font-extrabold text-5xl mt-8 mb-4 font-['notosans-bold']">
                    Find a Doc, Japan
                </span>
                <span class="text-gray-500 mt-4 mb-14 w-96">
                    Connecting people in Japan to the healthcare services they need, in the languages they need.
                </span>
            </div>

            <div class="bg-[url('/assets/images/doctor-banner-1.png')] bg-no-repeat bg-cover
                h-[36rem] translate-x-[-150px] w-[calc(100vw+150px)]">
            </div>

            <div class="flex flex-col flex-1 max-h-12">
                <span class="self-center text-xs text-gray-500">*Screens are for illustration purposes only</span>
                <img src="@/assets/images/iPhone-showing-map.png" class="hidden md:block h-[550px] w-[400px]
                    relative right-[8%] left-auto top-[-480px] self-end overflow-visible" />
            </div>

            <div class="flex flex-row justify-around h-[300px] mt-28 mb-8 portrait:mx-4 text-center">
                <div class="flex flex-col w-96 items-center">
                    <SVGMagnifyingGlass role="img" alt="MagnifyingGlass" title="MagnifyingGlass"
                        class="h-20 w-20 self-center text-primary" />
                    <span class="landscape:text-2xl portrait:text-xl font-extrabold py-6 font-['notosans-bold']">
                        Search & Find
                    </span>
                    <span class="portrait:text-xs text-gray-700 text-center">
                        Search and find the right doctors and healthcare professionals for your needs in Japan
                    </span>
                </div>
                <div class="flex flex-col w-96 items-center mx-8">
                    <SVGTranslateIcon role="img" alt="translation icon" title="translation icon"
                        class="h-20 w-20 self-center text-primary" />
                    <span class="landscape:text-2xl portrait:text-xl font-extrabold py-6 font-['notosans-bold']">
                        Multiple Languages
                    </span>
                    <span class="portrait:text-xs text-gray-700 text-center">
                        We're here to connect you to the services you need, in the language you're comfortable with
                    </span>
                </div>
                <div class="flex flex-col w-96 items-center">
                    <SVGHeartIcon role="img" alt="heart" title="heart"
                        class="h-20 w-20 self-center text-primary pt-2" />
                    <span class="landscape:text-2xl portrait:text-xl font-extrabold py-6 font-['notosans-bold']">
                        Free & Reliable
                    </span>
                    <span class="portrait:text-xs text-gray-700 text-center">
                        We're dedicated to providing free and reliable healthcare resources so you can stay informed.
                    </span>
                </div>
            </div>

            <div class="my-8 flex items-center justify-center bg-[url('/assets/images/map-background.png')] h-80">
                <button class="rounded-full bg-currentColor/90 text-white px-6 py-3">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSesYIL33Q_qB4ftwmEqRfZBR_tzC8vAgju4fDaV0peEdVZ2bQ/viewform"
                        target="_blank">
                        Get notified when we are ready!
                    </a>
                </button>
            </div>

            <div class="my-8 flex flex-1 justify-center">
                <img src="@/assets/images/heart-circle.png" class="h-[392px] w-[412px]" />
            </div>

            <div class="footer flex grow-1 shrink-0 self-stretch items-stretch">
                <div class="middle-footer section flex flex-1 align-bottom justify-center text-gray-500">
                    <span class="self-center">Powered by</span>
                    <nav class="flex mx-2 self-center">
                        <NuxtLink to="https://www.netlify.com/" target="_blank"
                            class="underline hover:text-primary-hover transition-colors" data-testid="netlify-link">
                            Netlify
                        </NuxtLink>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import SVGMagnifyingGlass from '~/assets/images/magnifying-glass.svg'
import SVGTranslateIcon from '~/assets/images/translate-icon.svg'
import SVGHeartIcon from '~/assets/images/heart-icon.svg'
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
