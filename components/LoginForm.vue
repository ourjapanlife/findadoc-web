<template>
    <h1
        data-testid="login-heading"
        class="mt-16 mb-16 text-primary-text text-2xl font-bold
                flex self-center justify-items-center justify-center text-center w-full h-full"
    >
        <SVGLoadingIcon
            role="img"
            alt="loading animation"
            title="loading animation"
            class="h-8"
        />
        <span>
            {{ statusMessage }}...
        </span>
    </h1>
</template>

<script lang="ts" setup>
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import { useAuthStore } from '~/stores/authStore'
import { resolveAuthReturnPath } from '~/utils/auth0Config'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const statusMessage = ref(t('login.checkingauth'))

await authStore.waitForAuth0ToLoad()

if (authStore.isLoggedIn) {
    statusMessage.value = t('login.checkingauth')
    await router.replace(resolveAuthReturnPath(route.fullPath))
} else {
    statusMessage.value = t('login.redirectingtoauth0')
    await authStore.login()
}
</script>
