<template>
    <h1 data-testid="login-heading"
        class="mt-16 mb-16 text-primary-text text-2xl font-bold flex self-center justify-items-center justify-center text-center w-full h-full">
        <SVGLoadingIcon role="img" alt="loading animation" title="loading animation" class="h-8" />
        <span>
            Redirecting to login page...
        </span>
    </h1>
</template>

<script lang="ts" setup>
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import { useAuthStore } from "~/stores/authStore"

const authStore = useAuthStore()

// since the login is a redirection, let's go there right away
await authStore.login()

</script>
