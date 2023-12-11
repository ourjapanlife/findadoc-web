import { defineStore } from "pinia"
import { Ref, ref, watch } from 'vue'

export const useAdminPanelStore = defineStore('adminPanelStore', () => {
    let selectedComponent = ref('submissions')
    const panelOpen = ref(false)
    const panelItems = {
        "submissions": { "displayText": "Submissions", "component": "submissions" },
        "facilities": { "displayText": "Facilities", "component": "facilities" },
        "healthcareProfessionals": { "displayText": "Healthcare Professionals", "component": "healthcareProfessionals" },
    }


    function setSelectedComponent(component: string) {
        selectedComponent.value = component
    }

    function togglePanel() {
        console.log("menu= ", panelOpen.value)
        panelOpen.value = !panelOpen.value
    }

    return {
        panelItems,
        panelOpen,
        selectedComponent,
        setSelectedComponent,
        togglePanel
    }
})
