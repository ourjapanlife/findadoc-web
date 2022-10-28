<template>
   <div class="cursor-pointer md:hidden">
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
