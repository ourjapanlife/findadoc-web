<template>
    <div class="border-r border-secondary-bg/40 hover:shadow-inner hover:shadow-secondary-bg/50 transition-shadow">
        <div v-if="activeNavbar === 'modDashboardNavbar' ">if it is modDashboardNavbar</div>
        <div v-else-if="activeNavbar === 'submissionNavbar'">If it is submissionNavbar</div>
        <div v-else>Ahhhhh else</div>
    </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const activeNavbar = ref<String>('modDashboardNavbar')
</script>

