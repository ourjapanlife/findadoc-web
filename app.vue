<template>
    <div class="h-screen flex flex-col font-['notosans'] theme-coral">
        <div class="h-full">
            <div class="flex flex-1 flex-col items-center mt-8">
                <span class="border-2 border-currentColor text-currentColor rounded-lg px-3 py-0">
                    Coming Soon
                </span>
                <span class="font-extrabold text-5xl mt-8 mb-4">
                    Find a Doc, Japan
                </span>
                <span class="text-secondary mt-4 mb-8 w-96">
                    Connecting people in Japan to the healthcare services they need, in the languages they need.
                </span>
            </div>
            <div>
                <img href="./assets/images/doctor-banner-1.png" height="200" class="h-48" />
            </div>
            <div class="flex flex-col">
                <img href="./assets/images/iPhone-showing-map.png" />
                <span class="self-center text-sm text-secondary">*Screens are for illustration purposes only</span>
            </div>
            <div class="flex flex-row my-8">
                <div class="flex flex-col">
                    <svg role="img" alt="MagnifyingGlass" title="MagnifyingGlass" class="h-20 w-20 self-center">
                        <use xlink:href=" ../assets/images/magnifying-glass.svg" />
                    </svg>
                    <span class="text-2xl font-extrabold">Search & Find</span>
                    <span> Search and find the right doctors and healthcare professionals for your needs in Japan</span>
                </div>
                <div class="flex flex-col">
                    <svg role="img" alt="translation icon" title="translation icon" class="h-20 w-20 self-center">
                        <use xlink:href=" ../assets/images/translate-icon.svg" />
                    </svg>
                    <span class="text-2xl font-extrabold">Multiple Languages</span>
                    <span> We're here to connect you to the services you need, in the language you're comfortable
                        with.</span>
                </div>
                <div class="flex flex-col">
                    <svg role="img" alt="vector" title="vector" class="h-20 w-20 self-center">
                        <use xlink:href=" ../assets/images/vector-icon.svg" />
                    </svg>
                    <span class="text-2xl font-extrabold">Free & Reliable</span>
                    <span> We're dedicated to providing free and reliable healthcare resources so you can stay
                        informed.</span>
                </div>
            </div>
            <div class="my-8">
                <img href="./assets/images/map-background.png" height="200" class="h-48" />
            </div>
            <div class="my-8">
                <svg role="img" alt="heart circle icon" title="heart circle icon" class="h-20 w-20 self-center">
                    <use xlink:href=" ../assets/images/heart-circle.svg" />
                </svg>
            </div>
            <div class="footer flex flex-1 items-stretch">
                <div class="middle-footer section flex flex-1 align-bottom justify-center">
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
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
