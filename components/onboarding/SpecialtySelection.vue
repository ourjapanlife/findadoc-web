<template>
    <div class="relative h-screen w-full bg-primary p-6 overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-grid-white/[0.05]" />
        </div>

        <div class="relative z-10 h-full flex flex-col">
            <h2 class="text-2xl font-bold text-white mb-8 text-center">
                What type of care do you need?
            </h2>
            <div class="grid grid-cols-2 gap-4 mb-8 flex-grow">
                <button
                    v-for="(specialty, index) in specialties"
                    :key="specialty"
                    type="button"
                    class="relative overflow-hidden bg-white/90 hover:bg-white transition-all
                        rounded-xl p-4 text-center shadow-lg transform hover:scale-105
                        hover:shadow-xl"
                    :style="`transition-delay: ${index * 50}ms`"
                    @click="selectSpecialty(specialty)"
                >
                    <div class="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <span class="relative z-10 font-medium text-gray-800">
                        {{ specialty }}
                    </span>
                </button>
            </div>
            <button
                type="button"
                class="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-xl
                    font-medium transition-colors mb-6 border-2 border-white/20
                    hover:border-white/40"
                @click="selectSpecialty('Not Sure')"
            >
                I'm not sure
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const specialties = [
    'Dentist',
    'Dermatologist',
    'Pediatrician',
    'Gynecologist',
    'General Practitioner',
    'Psychologist',
    'Physiotherapist',
    'Optometrist',
    'ENT Specialist',
    'Cardiologist'
] as const

const emit = defineEmits<{
    (e: 'select-specialty', specialty: string): void
}>()

const selectSpecialty = (specialty: string) => {
    emit('select-specialty', specialty)
}
</script>

<style scoped>
.bg-grid-white/\[0\.05\] {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>
