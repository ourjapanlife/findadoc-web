<template>
    <ProfilePage
        :username-prop="username"
        :is-owner="isOwner"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfilePage from '~/components/ProfilePage.vue'
import { useAuthStore } from '~/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

// reactive computed username (handles client-side param changes)
const username = computed(() => {
    const p = route.params.username
    const raw = Array.isArray(p) ? p[0] : (p ?? '')
    try {
        return decodeURIComponent(raw as string).trim()
    } catch {
        return (raw as string).trim()
    }
})

// whether the currently authenticated user owns this profile
const isOwner = computed(() => {
    // if the auth store has a userId, compare to the username param
    const myId = authStore.userId?.value ?? ''
    return myId !== '' && myId === username.value
})
</script>
