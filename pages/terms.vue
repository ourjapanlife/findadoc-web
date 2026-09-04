<template>
    <section
        data-testid="terms-page"
        class="page-section"
    >
        <div class="page-container-narrow flex flex-col gap-8">
            <header class="flex flex-col gap-3">
                <h1 class="page-title-sm">
                    Terms and Conditions
                </h1>
                <p class="text-lg text-primary-text-muted">
                    How you may use Find a Doc, Japan, and what you can expect from us.
                </p>
            </header>

            <!--
                Copy is hardcoded English for now. Extracting it into the ten locales is a
                separate job; the structure below is what that job should translate.
            -->
            <div class="prose-legal [&>:first-child]:mt-0">
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Find a Doc, Japan, you agree to comply with and be bound by these
                    terms and conditions. If you do not agree with any part of these terms, you should not use
                    the website.
                </p>

                <h2>2. Use of the Website</h2>
                <p>
                    You may use Find a Doc, Japan to look up healthcare providers and, if you choose, to suggest
                    additions or corrections. The following conditions apply to that use.
                </p>
                <h3>a. Eligibility</h3>
                <p>
                    You must be at least 18 years old to use Find a Doc, Japan.
                </p>
                <h3>b. User Accounts</h3>
                <p>
                    In order to access certain features of the website, you may be required to create a user
                    account. You are responsible for maintaining the confidentiality of your account information
                    and for all activities that occur under your account.
                </p>
                <h3>c. Accuracy of Information</h3>
                <p>
                    Users are responsible for the accuracy of the information provided, including adding new
                    hospitals and doctors to the website. Misleading or false information may result in the
                    suspension of your account.
                </p>

                <h2>3. User-Provided Content</h2>
                <h3>a. Hospital and Doctor Information</h3>
                <p>
                    Users can contribute by adding new hospitals and doctors to the website. By submitting such
                    information, you warrant that it is accurate, up-to-date, and complies with all applicable
                    laws.
                </p>
                <h3>b. Rights to User-Provided Content</h3>
                <p>
                    By submitting content to Find a Doc, Japan, you grant the website a non-exclusive,
                    royalty-free, worldwide license to use, reproduce, modify, distribute, and display the
                    content.
                </p>

                <h2>4. Privacy</h2>
                <h3>a. Privacy Policy</h3>
                <p>
                    Your use of Find a Doc, Japan is also governed by our Privacy Policy, which can be found
                    <NuxtLink
                        to="/privacypolicy"
                        data-testid="terms-privacy-link"
                    >here</NuxtLink>. Please review the Privacy Policy to understand our practices.
                </p>

                <h2>5. Limitation of Liability</h2>
                <h3>a. Disclaimer</h3>
                <p>
                    Find a Doc, Japan provides information about hospitals and doctors as a service to users. We
                    do not endorse or guarantee the accuracy of the information provided on the website. Users
                    are encouraged to verify information independently.
                </p>
                <h3>b. No Medical Advice</h3>
                <p>
                    Find a Doc, Japan does not provide medical advice. Users are advised to consult with
                    qualified healthcare professionals for medical advice and assistance.
                </p>

                <h2>6. Termination</h2>
                <p>
                    Find a Doc, Japan reserves the right to terminate or suspend your account and access to the
                    website at any time without notice, for any reason, including a breach of these terms.
                </p>

                <h2>7. Changes to Terms and Conditions</h2>
                <p>
                    Find a Doc, Japan reserves the right to update or modify these terms and conditions at any
                    time without prior notice. Users are encouraged to review the terms regularly.
                </p>

                <h2>8. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of
                    Japan.
                </p>
                <p>
                    If you have any questions or concerns about these terms and conditions, get in touch:
                    <a
                        href="https://forms.gle/4E763qfaq46kEsn99"
                        target="_blank"
                        rel="noopener"
                    >Give Feedback</a>.
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

useHead({ title: 'Terms and Conditions' })
</script>
