<template>
    <div class="p-4 border-b flex justify-between items-center">
        <div class="font-semibold text-xl text-gray-800">
            <NuxtLink class="align-middle" to="/">
                <img class="inline align-middle pr-2"
                    src="../assets/images/logo-32-px-color.svg" />Find a Doc
            </NuxtLink>
        </div>
        <div class="flex gap-4 mx-6 absolute right-20">
            <NuxtLink to="/aboutPage" class="px-2 mx-auto">
                About Us
            </NuxtLink>

            <div class="hidden cursor-pointer md:hidden">
                <img @click="toggleMenu"
                    src="../assets/images/hamburgerMenu.svg"
                    alt="hamburger menu" />
                <div v-if="showMenu">
                    <div>
                        <span class="block">Home</span>
                        <span class="block">About</span>
                    </div>
                </div>
            </div>
        </div>
        <LocaleSelector />
    </div>
</template>

<script setup>
import { ref } from 'vue'

//state
const showMenu = ref(false)

//functions
function toggleMenu() {
    showMenu.value = !showMenu.value
}
</script>
