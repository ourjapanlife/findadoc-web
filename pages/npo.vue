<template>
    <section
        data-testid="npo-page"
        class="page-section"
    >
        <div class="page-container-narrow flex flex-col gap-8">
            <header class="flex flex-col gap-3">
                <h1 class="page-title-sm">
                    {{ t('npoPage.heading') }}
                </h1>
                <p class="text-lg text-primary-text-muted">
                    {{ t('npoPage.intro') }}
                </p>
            </header>

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
                <div
                    v-for="row in profileRows"
                    :key="row.key"
                    class="flex flex-col gap-1"
                >
                    <dt class="text-sm font-semibold text-primary-text-muted">
                        {{ row.label }}
                    </dt>
                    <dd
                        :data-testid="`npo-${row.key}`"
                        class="m-0 text-primary-text"
                    >
                        {{ row.value }}
                    </dd>
                </div>
                <div class="flex flex-col gap-1">
                    <dt class="text-sm font-semibold text-primary-text-muted">
                        {{ t('npoPage.contactLabel') }}
                    </dt>
                    <dd class="m-0">
                        <a
                            :href="CONTACT_MAILTO"
                            data-testid="npo-contact-email"
                            class="link inline-flex min-h-11 items-center"
                        >{{ CONTACT_EMAIL }}</a>
                    </dd>
                </div>
            </dl>

            <!-- Statutory documents -->
            <section class="flex flex-col gap-4">
                <h2 class="text-xl font-bold text-primary-text">
                    {{ t('npoPage.documentsHeading') }}
                </h2>
                <ul class="flex flex-col gap-3 list-none p-0 m-0">
                    <li
                        v-for="document in documents"
                        :key="document.key"
                        class="card flex flex-col gap-1 p-5"
                    >
                        <NuxtLink
                            :to="document.url"
                            target="_blank"
                            rel="noopener"
                            :data-testid="`npo-document-${document.key}`"
                            class="link inline-flex min-h-11 items-center w-fit"
                        >
                            {{ document.label }}
                        </NuxtLink>
                        <span class="text-sm text-primary-text-muted">{{ document.note }}</span>
                    </li>
                </ul>
            </section>

            <p class="text-primary-text-muted">
                {{ t('npoPage.contact') }}
                <a
                    :href="CONTACT_MAILTO"
                    class="link"
                >{{ CONTACT_EMAIL }}</a>
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '~/utils/site'

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

/**
 * The 団体概要 a bank or partner checks against the registry (東京都 NPO法人台帳). Keep the
 * representative and activities in step with the 登記 and 定款. The registered office is a
 * virtual office, so the address is offered on request rather than published here.
 */
const NPO_REPRESENTATIVE = 'Russell James Miller'

const profileRows = computed(() => [
    {
        key: 'representative',
        label: t('npoPage.representativeLabel'),
        value: `${NPO_REPRESENTATIVE} (${t('npoPage.representativeRole')})`
    },
    { key: 'certified', label: t('npoPage.certifiedLabel'), value: t('npoPage.certifiedDate') },
    { key: 'address', label: t('npoPage.addressLabel'), value: t('npoPage.addressValue') },
    { key: 'activities', label: t('npoPage.activitiesLabel'), value: t('npoPage.activitiesValue') }
])

const documents = computed(() => [
    {
        key: 'balance-sheet',
        label: t('npoPage.balanceSheet'),
        note: t('npoPage.balanceSheetNote'),
        url: 'https://docs.google.com/spreadsheets/d/1CafQoHn1NNNoRy35QSt_nUZcgKL8QN2M'
    }
])
</script>
