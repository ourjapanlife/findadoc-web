<template>
    <div
        data-testid="npo-page"
        class="w-full px-6 landscape:px-12 py-12"
    >
        <div class="max-w-3xl mx-auto flex flex-col gap-8">
            <div class="flex flex-col gap-3">
                <h1 class="text-primary-text font-bold text-3xl landscape:text-4xl">
                    {{ t('npoPage.heading') }}
                </h1>
                <p class="text-primary-text-muted text-lg">
                    {{ t('npoPage.intro') }}
                </p>
            </div>

            <!-- Entity identity -->
            <dl class="flex flex-col gap-5 m-0">
                <div class="flex flex-col gap-1">
                    <dt class="text-sm font-semibold text-primary-text-muted">
                        {{ t('npoPage.entityLabel') }}
                    </dt>
                    <dd
                        data-testid="npo-entity-name"
                        class="m-0 text-primary-text text-lg font-semibold"
                    >
                        {{ t('footer.copyright') }}
                    </dd>
                </div>
                <div class="flex flex-col gap-1">
                    <dt class="text-sm font-semibold text-primary-text-muted">
                        {{ t('npoPage.numberLabel') }}
                    </dt>
                    <dd
                        data-testid="npo-registration-number"
                        class="m-0 text-primary-text text-lg font-mono tabular-nums"
                    >
                        {{ NPO_REGISTRATION_NUMBER }}
                    </dd>
                </div>
            </dl>

            <!-- Statutory documents -->
            <section class="flex flex-col gap-4">
                <h2 class="text-primary-text font-bold text-xl">
                    {{ t('npoPage.documentsHeading') }}
                </h2>
                <ul class="flex flex-col gap-3 list-none p-0 m-0">
                    <li
                        v-for="document in documents"
                        :key="document.key"
                        class="flex flex-col gap-1 p-4 rounded-xl border border-accent-bg bg-secondary-bg"
                    >
                        <NuxtLink
                            :to="document.url"
                            target="_blank"
                            rel="noopener"
                            :data-testid="`npo-document-${document.key}`"
                            class="text-primary font-semibold underline w-fit
                                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            {{ document.label }}
                        </NuxtLink>
                        <span class="text-sm text-primary-text-muted">{{ document.note }}</span>
                    </li>
                </ul>
            </section>

            <p class="text-sm text-primary-text-muted">
                {{ t('npoPage.contact') }}
                <NuxtLink
                    to="https://forms.gle/4E763qfaq46kEsn99"
                    target="_blank"
                    rel="noopener"
                    class="text-primary underline"
                >{{ t('footer.clickHere') }}</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/**
 * Statutory disclosure for a 特定非営利活動法人.
 *
 * NPO法 requires the balance sheet to be publicly announced and the other filed
 * documents to be available for inspection. This page is that public location, so its
 * URL should stay stable — previously these lived only in the mobile hamburger menu,
 * where desktop visitors could not reach them at all.
 *
 * The registration number is shown as plain text rather than linked: it is a fact about
 * the entity, and the directory that used to be linked is a third party, not a registry.
 */
const NPO_REGISTRATION_NUMBER = '9011005010215'

const documents = computed(() => [
    {
        key: 'balance-sheet',
        label: t('npoPage.balanceSheet'),
        note: t('npoPage.balanceSheetNote'),
        url: 'https://docs.google.com/spreadsheets/d/1CafQoHn1NNNoRy35QSt_nUZcgKL8QN2M'
    }
])
</script>
