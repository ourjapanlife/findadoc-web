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
                    <input
                        type="file"
                        accept="image/*"
                        @change="onPhotoChange"
                    >
                </div>
            </div>
            <button
                type="submit"
                class="text-primary py-2 px-4 rounded hover:bg-blue-700 transition w-full"
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()
const username = ref('')
const email = ref('')
const profilePhoto = ref('')
const profilePhotoPreview = ref('')
const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
    // Populate fields with current user info
    const user = authStore.userProfileImage?.value
        ? {
            picture: authStore.userProfileImage.value,
            name: authStore.userId?.value || '',
            email: '' // Add logic to get email if available in your store
            // Add other user fields as needed
        }
        : {}

    username.value = user.name || ''
    email.value = user.email || ''
    profilePhoto.value = user.picture || ''
})

function onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = ev => {
            profilePhotoPreview.value = ev.target?.result as string
        }
        reader.readAsDataURL(file)
    }
}

async function submitProfile() {
    successMessage.value = ''
    errorMessage.value = ''
    try {
    // This is a placeholder for demonstration
        successMessage.value = t('profile.updatedSuccessfully')
    } catch (e: unknown) {
        errorMessage.value = (e as Error).message || t('profile.updateFailed')
    }
}
</script>

