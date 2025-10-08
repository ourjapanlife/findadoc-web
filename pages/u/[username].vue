<template>
    <ProfilePage :username-prop="username" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProfilePage from '~/components/ProfilePage.vue'

const route = useRoute()
const username = (route.params.username as string) || ''
</script>
