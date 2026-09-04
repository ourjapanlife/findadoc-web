<template>
    <section class="page-section">
        <div class="page-container-narrow flex justify-center">
            <LoginForm />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { definePageMeta, useHead } from '#imports'

definePageMeta({
    ssr: false
})

const { t } = useI18n()

useHead({ title: computed(() => t('topNav.login')) })
</script>
