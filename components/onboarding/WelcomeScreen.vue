<template>
    <div
        class="relative h-screen w-full overflow-hidden bg-primary-bg"
        :style="{ opacity: isFadingIn ? 1 : 0, transition: 'opacity 0.5s ease' }"
    >
        <!-- Content -->
        <div class="h-full flex flex-col text-center text-primary-text-inverted">
            <!-- Top half of screen -->
            <div
                class="flex flex-col justify-center pt-8
                min-h-[70vh] bg-primary relative
                transition-all duration-700 ease-out"
                :class="{ 'min-h-svh': isBackgroundExpanding }"
            >
                <!-- Header text -->
                <div
                    class="flex flex-col self-center items-center px-6 transition-opacity duration-500"
                    :class="{ 'opacity-0': isBackgroundExpanding }"
                >
                    <h1 class="landscape:text-7xl text-4xl font-bold mb-6 mt-12">
                        <span class="block">{{ t('onboarding.welcometo') }}</span>
                        <span class="block mt-2">Find a Doc, Japan!</span>
                    </h1>
                    <p class="landscape:text-2xl text-lg mt-3 max-w-md">
                        {{ t('about.subheading') }}
                    </p>
                </div>
                <!-- Bouncing arrow button -->
                <div
                    class="h-full flex items-center justify-center transition-opacity duration-500"
                    :class="{ 'opacity-0': isBackgroundExpanding }"
                >
                    <button
                        id="welcome-screen-arrow-button"
                        type="button"
                        class="relative group flex items-center self-start focus:outline-none
                        bg-secondary hover:bg-secondary/90 transition-colors
                        px-6 py-3 landscape:mt-24 mt-14
                        rounded-full animate-bounce z-10"
                        :style="{ animationDuration: '1.5s' }"
                        @click="expandBackground"
                    >
                        <!-- Button text -->
                        <span class="text-xl font-bold text-primary-text-inverted">
                            {{ t('onboarding.letsGoButtonText') }}
                        </span>
                        <!-- Right-pointing Arrow SVG -->
                        <svg
                            class="w-6 h-6 pt-1 text-primary-text-inverted transform
                                group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="3"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
                <!-- Background wave svg -->
                <div class="w-full absolute bottom-0 -mb-1">
                    <svg
                        viewBox="0 0 375 56"
                        class="w-full transition-all duration-500 ease-out block"
                        :class="{ 'h-0': isBackgroundExpanding }"
                        width="100%"
                        height="56"
                        preserveAspectRatio="none"
                        @mouseenter="waveHover = true"
                        @mouseleave="waveHover = false"
                    >
                        <!-- Subtly morph the wave path when hovered -->
                        <path
                            :d="waveHover
                                ? 'M375 0V56H0V30C56 13 123 8 195 27C263 42 322 40 375 11 Z'
                                : 'M375 0V56H0V18.5C46.5 33 120 59 187.5 45C255 31 328.5 -13.5 375 18.5Z'"
                            class="fill-primary-bg"
                            :style="{ transition: 'd 0.8s cubic-bezier(.6,0,.4,1)' }"
                        />
                    </svg>
                </div>
            </div>
            <!-- Bottom half of screen -->
            <div
                class="h-full flex items-center justify-center transition-opacity duration-500"
                :class="{ 'opacity-0': isBackgroundExpanding }"
            >
                <!-- Faded background Find a Doc, Japan character team -->
                <SVGCharactersTogetherWelcomeScreen
                    role="img"
                    alt="Find a Doc, Japan character team"
                    title="Find a Doc, Japan character team"
                    class="absolute right-0 bottom-0 landscape:right-12 landscape:w-[416px] w-[300px]
                        opacity-70 pointer-events-none select-none z-0"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SVGCharactersTogetherWelcomeScreen from '@/assets/icons/characters-together-welcomescreen.svg'

const { t } = useI18n()

const isFadingIn = ref(false)
onMounted(() => {
    setTimeout(() => { isFadingIn.value = true }, 10)
})

const isBackgroundExpanding = ref(false)
const waveHover = ref(false)

const emit = defineEmits<{
    (e: 'next'): void
}>()

const expandBackground = () => {
    isBackgroundExpanding.value = true
    setTimeout(() => {
        emit('next')
    }, 300)
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1.5s infinite;
}

.animate-bounce:hover {
  animation-play-state: paused;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
