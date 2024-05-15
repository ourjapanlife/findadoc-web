import { defineStore } from "pinia"
import { ref } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
    const isMenuOpen = ref(false)

    const menuItems = {
        "about": { "displayText": "topNav.about", "route": "/about" },
        "home": { "displayText": "topNav.home", "route": "/" },
        "submit": { "displayText": "topNav.submit", "route": "/submit" },
    }

    const hamburgerMenuItems = {
        "about": { "displayText": "hamburgerMenu.about", "route": "/about" },
        "home": { "displayText": "hamburgerMenu.home", "route": "/" },
        "submit": { "displayText": "hamburgerMenu.submit", "route": "/submit" },
    }

    function toggleMenu() {
        isMenuOpen.value = !isMenuOpen.value
    }

    function closeMenu() {
        isMenuOpen.value = false
    }

    return {
        hamburgerMenuItems,
        menuItems,
        hamburgerMenuItems,
        isMenuOpen,
        toggleMenu,
        closeMenu
    }
})
