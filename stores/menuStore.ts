import { defineStore } from "pinia"
import { ref } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
    const menuOpen = ref(false)
    const menuItems = {
        "home": { "displayText": "topNav.home", "route": "/" },
        "about": { "displayText": "topNav.about", "route": "/about" },
        "submit": { "displayText": "topNav.submit", "route": "/submit" },
    }

    function toggleMenu() {
        menuOpen.value = !menuOpen.value
    }

    return {
        menuItems,
        menuOpen,
        toggleMenu
    }
})
