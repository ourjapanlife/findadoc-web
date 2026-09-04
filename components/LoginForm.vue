<template>
    <div class="card flex flex-col items-center gap-4 p-8 text-center max-w-md w-full">
        <SVGLoadingIcon
            aria-hidden="true"
            class="h-10 w-10 text-primary"
        />
        <h1
            data-testid="login-heading"
            class="page-title-sm"
        >
            {{ displayMessage }}
        </h1>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import { useAuthStore } from '~/stores/authStore'
import { resolveAuthReturnPath } from '~/utils/auth0Config'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const statusMessage = ref(t('login.checkingauth'))

// Every locale's checkingauth string already ends in "...": strip any trailing dots so the ellipsis renders once.
const displayMessage = computed(() => `${statusMessage.value.replace(/[.…]+$/u, '')}…`)

await authStore.waitForAuth0ToLoad()

if (authStore.isLoggedIn) {
    statusMessage.value = t('login.checkingauth')
    await router.replace(resolveAuthReturnPath(route.fullPath))
} else {
    statusMessage.value = t('login.redirectingtoauth0')
    await authStore.login()
}
</script>
