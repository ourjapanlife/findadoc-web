<template>
    <section
        data-testid="contact-page"
        class="page-section"
    >
        <div class="page-container-narrow flex flex-col gap-8">
            <header class="flex flex-col gap-3">
                <h1
                    data-testid="contact-heading"
                    class="page-title-sm"
                >
                    {{ t('contactPage.heading') }}
                </h1>
                <p class="text-lg text-primary-text-muted">
                    {{ t('contactPage.intro') }}
                </p>
            </header>

            <div class="flex flex-col gap-2">
                <h2 class="text-sm font-semibold text-primary-text-muted">
                    {{ t('contactPage.emailLabel') }}
                </h2>
                <a
                    :href="CONTACT_MAILTO"
                    class="link w-fit text-lg"
                    data-testid="contact-email"
                >{{ CONTACT_EMAIL }}</a>
            </div>

            <div class="flex flex-col gap-3">
                <h2 class="text-xl font-semibold">
                    {{ t('contactPage.whatHeading') }}
                </h2>
                <p>{{ t('contactPage.whatBody') }}</p>
            </div>

            <div class="flex flex-col gap-3">
                <h2 class="text-xl font-semibold">
                    {{ t('contactPage.npoHeading') }}
                </h2>
                <p>{{ t('contactPage.npoBody') }}</p>
                <p class="text-primary-text-muted">
                    {{ t('contactPage.addressNote') }}
                </p>
                <NuxtLink
                    to="/npo"
                    class="link w-fit"
                >
                    {{ t('npoPage.heading') }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '~/utils/site'

const { t } = useI18n()
</script>
