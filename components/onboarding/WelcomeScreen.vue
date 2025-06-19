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
                min-h-[60vh] bg-primary relative
                transition-all duration-700 ease-out"
                :class="{ 'h-full min-h-full': isBackgroundExpanding }"
            >
                <!-- Header text -->
                <div
                    class="flex flex-col self-center items-center px-6 transition-opacity duration-500"
                    :class="{ 'opacity-0': isBackgroundExpanding }"
                >
                    <h1 class="landscape:text-7xl text-4xl font-bold mb-6">
                        <span class="block">{{ t('onboarding.welcometo') }}</span>
                        <span class="block mt-2">Find a Doc, Japan!</span>
                    </h1>
                    <p class="landscape:text-2xl text-lg my-8 max-w-md">
                        {{ t('about.subheading') }}
                    </p>
                </div>
                <!-- Background wave svg -->
                <div class="w-full absolute bottom-0">
                    <svg
                        viewBox="0 0 375 56"
                        class="w-full z-10 transition-all duration-500ease-out"
                        :class="{ 'h-0': isBackgroundExpanding }"
                        width="100%"
                        height="56"
                        preserveAspectRatio="none"
                        :style="{ display: 'block' }"
                        @mouseenter="waveHover = true"
                        @mouseleave="waveHover = false"
                    >
                        <!-- Subtly morph the wave path when hovered -->
                        <path
                            :d="waveHover
                                ? 'M375 0V56H0V25C50 33 125 70 187.5 50C250 30 320 -10 375 25Z'
                                : 'M375 0V56H0V18.5C46.5 33 120 59 187.5 45C255 31 328.5 -13.5 375 18.5Z'"
                            class="fill-primary-bg"
                            :style="{ transition: 'd 0.4s cubic-bezier(.6,0,.4,1)' }"
                        />
                    </svg>
                </div>
            </div>
            <!-- Bottom half of screen -->
            <div
                class="h-full flex items-center justify-center transition-opacity duration-500"
                :class="{ 'opacity-0': isBackgroundExpanding }"
            >
                <!-- Bouncing arrow -->
                <button
                    type="button"
                    class="relative group flex items-center justify-center focus:outline-none
                        bg-primary hover:bg-primary/90 transition-colors px-6 py-3
                        rounded-full animate-bounce"
                    :style="{ animationDuration: '1.5s' }"
                    @click="expandBackground"
                >
                    <!-- Button text -->
                    <span class="text-primary-text-inverted mr-3 opacity-100 transition-opacity">
                        Let's Go
                    </span>
                    <!-- Right-pointing Arrow SVG -->
                    <svg
                        class="w-6 h-6 text-primary-text-inverted transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

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
