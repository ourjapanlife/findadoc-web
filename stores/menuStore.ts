import { defineStore } from "pinia"
import { ref } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
    const menuOpen = ref(false)
    const hamburgerMenuItems = {
        "about": { "displayText": "hamburgerMenu.about", "route": "/about" },
        "home": { "displayText": "hamburgerMenu.home", "route": "/" },
        "contact": {
            "displayText": "hamburgerMenu.contact", "route": "https://forms.gle/4E763qfaq46kEsn99"
        },
        "submit": { "displayText": "hamburgerMenu.submit", "route": "/submit" },
        "privacy": {
            "displayText": "hamburgerMenu.privacy", "route": "/privacypolicy"

        },
        "terms": {
            "displayText": "hamburgerMenu.terms", "route": "/terms"

        },
        "github": {
            "displayText": "hamburgerMenu.github", "route": "https://github.com/ourjapanlife/findadoc-web/"

        },
        "netlify": {
            "displayText": "hamburgerMenu.netlify", "route": "https://www.netlify.com/"

        },
    }

    const menuItems = {
        "about": { "displayText": "topNav.about", "route": "/about" },
        "home": { "displayText": "topNav.home", "route": "/" },
        "submit": { "displayText": "topNav.submit", "route": "/submit" },
    }

    function toggleMenu() {
        menuOpen.value = !menuOpen.value
    }

    return {
        hamburgerMenuItems,
        menuItems,
        menuOpen,
        toggleMenu
    }
})
