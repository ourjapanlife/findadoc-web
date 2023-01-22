<template>
    <div class="cursor-pointer md:hidden">
        <img @click="toggleMenu" src="../assets/images/hamburger-menu.svg" alt="hamburger menu" />
        <div v-if="showMenu">
            <div>
                <span class="block hover:-translate-y-1 hover:scale-110 duration-300">Home</span>
                <span class="block hover:-translate-y-1 hover:scale-110 duration-300">About</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

//state
const showMenu = ref(false)

//functions
function toggleMenu() {
    showMenu.value = !showMenu.value
}
</script>
