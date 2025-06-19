<template>
    <div class="relative h-screen w-full overflow-hidden bg-primary-bg">
        <!-- Content -->
        <div class="h-full flex flex-col text-center text-primary-text-inverted">
            <div
                class="flex flex-col justify-between pt-8
                min-h-[60vh] bg-primary"
            >
                <div class="flex flex-col self-center items-center px-6">
                    <h1 class="text-4xl font-bold mb-6">
                        <span class="block">Welcome to</span>
                        <span class="block">Find a Doc, Japan!</span>
                    </h1>
                    <p class="text-lg mb-12 max-w-md">
                        Connecting people in Japan to the healthcare services they need, in the languages they need.
                    </p>
                </div>
                <!-- Background wave transition -->
                <div class="w-full">
                    <svg
                        viewBox="0 0 375 56"
                        class="w-full z-10 transition-all duration-500"
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
            <div class="pt-24">
                <!-- Enhanced bouncing arrow -->
                <button
                    type="button"
                    class="relative group flex flex-col items-center justify-center focus:outline-none animate-bounce"
                    :style="{ animationDuration: '1.5s' }"
                    @click="expandBackground"
                >
                    <span class="text-accent text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Get Started
                    </span>
                    <!-- Arrow SVG -->
                    <svg
                        class="w-12 h-12 text-primary-text transform group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
const emit = defineEmits<{
    (e: 'next'): void
}>()

const expandBackground = () => {
    isExpanded.value = true
    emit('next')
}

const waveHover = ref(false)
</script>

<style scoped>
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 20s linear infinite;
}

.animate-bounce {
  animation: bounce 1.5s infinite;
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
