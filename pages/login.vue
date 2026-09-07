<template>
    <section class="page-section">
        <div class="page-container-narrow flex justify-center">
            <LoginForm />
        </div>
    </section>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
    ssr: false
})
</script>
