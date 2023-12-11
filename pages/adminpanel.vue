import AdminPanelDesktopSidebar from
'~/components/AdminPanelDesktopSidebar.vue';
<template>
    <div>
        <AdminPanelDesktopSidebar />
        <AdminPanelSubmissions
            v-show="adminStore.selectedComponent == 'submissions'"
        />
        <AdminPanelFacilities
            v-show="adminStore.selectedComponent == 'facilities'"
        />
        <AdminPanelHealthcareProfessionals
            v-show="adminStore.selectedComponent == 'healthcareProfessionals'"
        />
    </div>
</template>

<script setup lang="ts">
import { useAdminPanelStore } from "../stores/adminPanelStore";

const adminStore = useAdminPanelStore();
</script>
