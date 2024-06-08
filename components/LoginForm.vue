<template>
    <form class="flex flex-col items-center justify-center h-full pb-16">
        <h1 data-testid="login-heading" class="mb-16 text-primary-text text-2xl font-bold leading-normal">{{
            $t('login.heading') }}
        </h1>
        <p data-testid="login-failed-validation" v-show="isFailedLogin" class="text-error text-sm font-bold ml-2 mb-1">
            {{ $t('login.invalidLoginValidation') }}
        </p>
        <div data-testid="login-username-container" class="flex flex-col">
            <span data-testid="login-username-label" class="mb-1 text-primary-text-muted text-sm ml-2">
                {{ $t('login.usernamelabel') }}
            </span>
            <p data-testid="login-username-validation" v-show="!isValidUsername" class="text-error text-xs ml-2 mb-1">
                {{ $t('login.invalidUsernameValidation') }}
            </p>
            <input data-testid="login-username-input" type="text" required @blur="onUsernameBlur"
                class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-secondary-bg rounded-lg border border-primary-text-muted text-primary-text-muted text-sm font-normal"
                v-model="username" />
        </div>
        <div data-testid="login-password-container" class="flex flex-col">
            <span data-testid="login-password-label" class="mb-1 text-primary-text-muted text-sm ml-2">
                {{ $t('login.passwordlabel') }}
            </span>
            <p data-testid="login-password-validation" v-show="!isValidPassword" class="text-error text-xs ml-2 mb-1">
                {{ $t('login.invalidPasswordValidation') }}
            </p>
            <input data-testid="login-password-input" type="password" required @input="onPasswordChange"
                class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-secondary-bg rounded-lg border border-primary-text-muted text-primary-text-muted text-sm font-normal"
                v-model="password" />
        </div>
        <button data-testid="login-submit" type="submit"
            class="disabled:bg-primary/40 h-12 px-20 rounded-full bg-primary w-[350px] text-center text-primary-text-inverted text-base font-medium"
            @click="login" :disabled="loadingStore.isLoading || !password || !isValidPassword">
            <span class="flex justify-center">
                <SVGLoadingIcon role="img" alt="loading animation" title="loading animation" class="w-24"
                    v-if="loadingStore.isLoading" />
            </span>
            <span v-if="!loadingStore.isLoading" class="py-3">{{ $t('login.loginButton') }}</span>
        </button>
    </form>
</template>

<script lang="ts" setup>
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import { useAuthStore } from "~/stores/authStore"
import { useLoadingStore } from "~/stores/loadingStore"
import { useModerationScreenStore } from "~/stores/moderationScreenStore"
import { useRouter } from 'vue-router'
import * as validations from '../utils/formValidations'
import { ref, type Ref } from 'vue'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const store = useModerationScreenStore()
const router = useRouter()

const username: Ref<string> = ref('')
const password: Ref<string> = ref('')
const isValidUsername: Ref<boolean> = ref(true)
const isValidPassword: Ref<boolean> = ref(true)
const isFailedLogin: Ref<boolean> = ref(false)

const onUsernameBlur = () => {
    validateUsername()
}

const onPasswordChange = () => {
    // this is to prevent the password validation from running when the user is typing
    if (isValidPassword.value) {
        return
    }
    validatePassword()
}

const validateUsername = () => {
    isValidUsername.value = validations.validateUsername(username.value)
}

const validatePassword = () => {
    isValidPassword.value = validations.validatePassword(password.value)
}

const validateForm = () => {
    validateUsername()
    validatePassword()

    return isValidUsername.value && isValidPassword.value
}

const login = async (e: Event) => {
    // prevent the form from being submitted more than once
    e.preventDefault()

    if (!validateForm())
        return

    await authStore.login(username.value, password.value)

    if (!authStore.isLoggedIn) {
        isFailedLogin.value = true
        return
    }

    // let's redirect the user to the moderation dashboard
    router.push({ path: '/moderation' })
}

</script>
