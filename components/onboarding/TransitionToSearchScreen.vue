<template>
    <div class="h-screen w-full bg-primary flex items-center justify-center overflow-hidden">
        <div class="relative w-full max-w-md px-6 text-center">
            <!-- Main Content -->
            <div class="relative z-10">
                <div class="relative inline-block mb-8">
                    <svg
                        class="w-24 h-24 mx-auto mb-6"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <!-- Animated checkmark -->
                        <path
                            d="M20,50 L40,70 L80,30"
                            fill="none"
                            stroke="white"
                            stroke-width="8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="draw"
                        />
                        <!-- Drawn circle around checkmark -->
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="white"
                            stroke-width="2"
                            stroke-dasharray="283"
                            class="circle-draw opacity-30"
                        />
                    </svg>
                </div>

                <h2 class="text-4xl font-bold text-white mb-4">
                    <span class="inline-block">
                        <span
                            v-for="(word, index) in t('onboarding.searchloading').split(' ')"
                            :key="index"
                            class="inline-block opacity-0 animate-fade-in-up"
                            :style="`animation-delay: ${index * 0.15}s`"
                        >
                            {{ word }}<span v-if="index < t('onboarding.searchloading').split(' ').length - 1">&nbsp;</span>
                        </span>
                    </span>
                </h2>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
/* Fade in up animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* SVG animations */
.draw {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw .8s ease-in-out forwards;
    animation-delay: 0.5s;
}

@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}

.circle-draw {
    stroke-dashoffset: 283;
    animation: circle-draw 1.2s ease-in-out forwards;
    animation-delay: 0.1s;
}

@keyframes circle-draw {
    to {
        stroke-dashoffset: 0;
    }
}

/* Fade in animation */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}
</style>
