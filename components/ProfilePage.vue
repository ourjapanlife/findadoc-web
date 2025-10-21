<template>
    <div class="container mx-auto p-4 max-w-lg">
        <h1 class="text-2xl font-bold mb-6">
            {{ t('profile.edit') }}
        </h1>

        <form
            class="space-y-6"
            @submit.prevent="submitProfile"
        >
            <div>
                <label
                    for="username"
                    class="block mb-1 font-semibold"
                >{{ t('profile.username') }}</label>
                <input
                    id="username"
                    v-model="username"
                    type="text"
                    class="border rounded px-3 py-2 w-full"
                    required
                    autocomplete="username"
                >
            </div>

            <div>
                <label
                    for="email"
                    class="block mb-1 font-semibold"
                >{{ t('profile.email') }}</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="border rounded px-3 py-2 w-full"
                    required
                >
            </div>

            <div>
                <label class="block mb-1 font-semibold">{{ t('profile.profilePhoto') }}</label>
                <div class="flex items-center gap-4">
                    <img
                        :src="profilePhotoPreview || profilePhoto"
                        alt="Profile Photo"
                        class="w-16 h-16 rounded-full object-cover border"
                    >
                    <template v-if="props.isOwner ?? true">
                        <input
                            type="file"
                            accept="image/*"
                            @change="onPhotoChange"
                        >
                    </template>
                </div>
            </div>

                <button
                    type="submit"
                    class="text-primary py-2 px-4 rounded hover:text-primary-hover transition w-full"
                >
                    {{ t('profile.save') }}
                </button>
        </form>

        <div
            v-if="successMessage"
            class="mt-4 text-success"
        >
            {{ t('profile.updatedSuccessfully') }}
        </div>
        <div
            v-if="errorMessage"
            class="mt-4 text-error"
        >
            {{ t('profile.updateFailed') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/authStore'

const props = defineProps<{ usernameProp?: string, isOwner?: boolean }>()

const authStore = useAuthStore()
const { t } = useI18n()

const username = ref('')
const email = ref('')
const profilePhoto = ref('')
const profilePhotoPreview = ref('')
const successMessage = ref('')
const errorMessage = ref('')

function populateFromStoreOrParam(usernameParam?: string) {
    // If usernameParam is provided, treat this as a public profile view for that username.
    // Replace the placeholder below with an actual API call to fetch public profile data by username when available.
    if (usernameParam) {
        username.value = usernameParam
        email.value = ''
        profilePhoto.value = ''
        return
    }

    // Otherwise populate fields from the authenticated user's store data
    const nameFromStore = authStore.userId?.value ?? ''
    const pictureFromStore = authStore.userProfileImage?.value ?? ''

    username.value = nameFromStore || ''
    email.value = ''
    profilePhoto.value = pictureFromStore || ''
}

onMounted(() => populateFromStoreOrParam(props.usernameProp))

watch(() => props.usernameProp, v => populateFromStoreOrParam(v))

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = ev => { profilePhotoPreview.value = ev.target?.result as string }
        reader.readAsDataURL(file)
    }
}

async function submitProfile() {
    successMessage.value = ''
    errorMessage.value = ''
    try {
    // Only a placeholder here — implement actual update logic restricted to the current authenticated user.
        successMessage.value = t('profile.updatedSuccessfully')
    } catch (e: unknown) {
        errorMessage.value = (e as Error).message || t('profile.updateFailed')
    }
}
</script>

<style scoped>
/* small visual tweaks can go here */
</style>
