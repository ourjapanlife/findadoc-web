<template>
    <div
        id="about"
        data-testid="about-page"
        class="w-full bg-primary-bg"
    >
        <!-- Hero -->
        <section class="page-section py-12 landscape:py-16">
            <div
                class="page-container flex flex-col gap-8 landscape:flex-row landscape:items-center landscape:gap-12"
            >
                <div class="flex flex-col gap-5 landscape:max-w-xl landscape:flex-1">
                    <h1
                        data-testid="about-hero-heading"
                        class="page-title"
                    >
                        {{ t('about.heroHeading') }}
                    </h1>
                    <p
                        data-testid="about-hero-subheading"
                        class="text-lg text-primary-text-muted landscape:text-xl"
                    >
                        {{ t('about.heroSubheading') }}
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <NuxtLink
                            to="/search"
                            class="btn btn-primary"
                        >
                            {{ t('about.heroGetStarted') }}
                        </NuxtLink>
                        <NuxtLink
                            to="/submit"
                            class="btn btn-secondary"
                        >
                            {{ t('about.involveAdd') }}
                        </NuxtLink>
                    </div>
                </div>
                <!--
                    An <img>, not an inline SVG component, as on the homepage: the illustration
                    is 127 KB even after svgo, and inlining it puts that in the prerendered HTML
                    on the critical path. Bound rather than static so the compiler leaves the
                    public URL alone.
                -->
                <img
                    :src="heroIllustration"
                    :alt="t('home.heroImageAlt')"
                    width="1536"
                    height="1024"
                    decoding="async"
                    class="h-auto w-full self-center landscape:max-w-sm landscape:flex-1"
                >
            </div>

            <!-- Section navigation: plain anchors, the sticky header is 64px so targets carry scroll-mt-20 -->
            <nav
                :aria-label="t('about.sectionNavLabel')"
                class="page-container mt-10"
            >
                <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                    <li
                        v-for="section in sectionLinks"
                        :key="section.id"
                    >
                        <a
                            :href="`#${section.id}`"
                            class="chip h-11 px-4 transition-colors hover:border-primary hover:bg-primary/5"
                        >
                            {{ section.label }}
                        </a>
                    </li>
                </ul>
            </nav>
        </section>

        <!-- Our story -->
        <section
            id="story"
            data-testid="about-header-container"
            class="page-section scroll-mt-20 border-y border-accent-bg bg-secondary-bg"
        >
            <div class="page-container flex flex-col gap-6">
                <h2 class="section-heading">
                    {{ t('about.storyHeader') }}
                </h2>
                <div class="flex max-w-3xl flex-col gap-4 text-primary-text">
                    <p data-testid="about-paragraph1">
                        {{ t('about.storyParagraph1') }}
                    </p>
                    <p data-testid="about-paragraph2">
                        {{ t('about.storyParagraph2') }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Impact -->
        <section
            id="impact"
            class="page-section scroll-mt-20"
        >
            <div class="page-container flex flex-col gap-6">
                <h2 class="section-heading">
                    {{ t('about.impactHeader') }}
                </h2>
                <ul class="m-0 grid list-none grid-cols-1 gap-4 p-0 landscape:grid-cols-3">
                    <li
                        v-for="stat in stats"
                        :key="stat"
                        class="card px-5 py-6 text-lg font-semibold text-primary-text"
                    >
                        {{ stat }}
                    </li>
                </ul>
            </div>
        </section>

        <!-- Contributors -->
        <section
            id="contributors"
            class="page-section scroll-mt-20 border-y border-accent-bg bg-secondary-bg"
        >
            <div class="page-container flex flex-col gap-8">
                <h2 class="section-heading">
                    {{ t('about.contributorsHeader') }}
                </h2>
                <ul
                    data-testid="contributors"
                    class="m-0 grid list-none grid-cols-2 gap-8 p-0 landscape:grid-cols-4"
                >
                    <li
                        v-for="(member, index) in contributors"
                        :key="member.avatarImg"
                        data-testid="member"
                    >
                        <MemberComponent
                            :avatar-img="member.avatarImg"
                            :github-url="member.githubUrl"
                            :linked-in-url="member.linkedInUrl"
                            :name="member.name"
                            :data-test-id="index"
                            :title="member.title"
                        />
                    </li>
                </ul>
            </div>
        </section>

        <!-- NPO board -->
        <section
            id="board"
            class="page-section scroll-mt-20"
        >
            <div class="page-container flex flex-col gap-8">
                <h2 class="section-heading">
                    {{ t('about.boardHeader') }}
                </h2>
                <ul
                    data-testid="npo"
                    class="m-0 grid list-none grid-cols-2 gap-8 p-0 landscape:grid-cols-4"
                >
                    <li
                        v-for="(member, index) in boardMembers"
                        :key="member.avatarImg"
                        data-testid="member"
                    >
                        <MemberComponent
                            :avatar-img="member.avatarImg"
                            :github-url="member.githubUrl"
                            :linked-in-url="member.linkedInUrl"
                            :name="member.name"
                            :data-test-id="index"
                            :title="member.title"
                        />
                    </li>
                </ul>
            </div>
        </section>

        <!-- Co-founders -->
        <section
            id="cofounders"
            class="page-section scroll-mt-20 border-y border-accent-bg bg-secondary-bg"
        >
            <div class="page-container flex flex-col gap-8">
                <h2 class="section-heading">
                    {{ t('about.cofoundersHeader') }}
                </h2>
                <ul
                    data-testid="cofounders"
                    class="m-0 grid list-none grid-cols-2 gap-8 p-0 landscape:grid-cols-4"
                >
                    <li
                        v-for="(member, index) in cofounders"
                        :key="member.avatarImg"
                        data-testid="member"
                    >
                        <MemberComponent
                            :avatar-img="member.avatarImg"
                            :github-url="member.githubUrl"
                            :linked-in-url="member.linkedInUrl"
                            :name="member.name"
                            :data-test-id="index"
                            :title="member.title"
                        />
                    </li>
                </ul>
            </div>
        </section>

        <!-- Mascots -->
        <section
            id="mascots"
            class="page-section scroll-mt-20"
        >
            <div class="page-container flex flex-col gap-8">
                <h2 class="section-heading">
                    {{ t('about.mascotsHeader') }}
                </h2>
                <ul class="m-0 grid list-none grid-cols-2 gap-6 p-0 landscape:grid-cols-5">
                    <li
                        v-for="mascot in mascots"
                        :key="mascot.name"
                        class="card flex flex-col items-center gap-3 p-4"
                    >
                        <img
                            :src="mascot.src"
                            :alt="mascot.name"
                            :width="mascot.width"
                            :height="mascot.height"
                            loading="lazy"
                            decoding="async"
                            class="h-28 w-auto"
                        >
                        <h3 class="text-base font-semibold text-primary-text">
                            {{ mascot.name }}
                        </h3>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Get involved -->
        <section
            id="involve"
            class="page-section scroll-mt-20 border-y border-accent-bg bg-secondary-bg"
        >
            <div class="page-container flex flex-col gap-8">
                <h2 class="section-heading">
                    {{ t('about.involveHeader') }}
                </h2>
                <ul class="m-0 grid list-none grid-cols-1 gap-4 p-0 landscape:grid-cols-4">
                    <li
                        v-for="link in involveLinks"
                        :key="link.to"
                    >
                        <NuxtLink
                            :to="link.to"
                            :target="link.external ? '_blank' : undefined"
                            :rel="link.external ? 'noopener' : undefined"
                            class="card flex items-center gap-4 p-5 transition-colors hover:border-primary hover:bg-primary/5"
                        >
                            <component
                                :is="link.icon"
                                class="h-8 w-8 shrink-0 fill-primary"
                                :class="link.iconClass"
                                aria-hidden="true"
                            />
                            <span class="font-semibold text-primary-text">{{ link.label }}</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead, useState } from '#imports'
import data from '../member_directory/members.json'
import MemberComponent from '~/components/MemberComponent.vue'
import { shuffleArray } from '~/utils/arrayUtils'
import { DIRECTORY_STATS } from '~/utils/homeDirectory'
import SvgNotes from '~/assets/icons/note-stack-add.svg'
import SvgLinkedin from '~/assets/icons/social-linkedin.svg'
import SvgFeedback from '~/assets/icons/feedback-icon.svg'
import SvgAdd from '~/assets/icons/add-square-icon.svg'

interface Member {
    avatarImg: string
    name: string
    title: string
    linkedInUrl?: string | null
    githubUrl?: string | null
    personalWebsite?: string | null
}

const { t } = useI18n()

useHead({ title: computed(() => t('topNav.about')) })

const heroIllustration = '/illustrations/characters-together-welcomescreen.svg'

const cofounders: Member[] = data.cofounders
const boardMembers: Member[] = data.board

/*
 * Contributors are shown in a random order so nobody is always last. The shuffle runs
 * once, on the server, and the resulting order travels in the payload: shuffling at
 * setup on both sides gave the server one order and the client another, and hydration
 * then paired each name with the previous member's avatar and links.
 */
const contributorOrder = useState<number[]>('about-contributor-order',
                                            () => shuffleArray(data.members.map((_, index) => index)))
const contributors = computed<Member[]>(() =>
    contributorOrder.value.flatMap(index => data.members[index] ?? []))

const sectionLinks = computed(() => [
    { id: 'story', label: t('about.storyHeader') },
    { id: 'impact', label: t('about.impactHeader') },
    { id: 'contributors', label: t('about.contributorsHeader') },
    { id: 'board', label: t('about.boardHeader') },
    { id: 'cofounders', label: t('about.cofoundersHeader') },
    { id: 'mascots', label: t('about.mascotsHeader') },
    { id: 'involve', label: t('about.involveHeader') }
])

// Framed as approximate so they do not read as a live counter; see DIRECTORY_STATS.
const stats = computed(() => [
    t('home.statFacilities', { n: DIRECTORY_STATS.facilities }),
    t('home.statProfessionals', { n: DIRECTORY_STATS.professionals }),
    t('home.statLanguages', { n: DIRECTORY_STATS.languages })
])

/*
 * Served from /public rather than inlined: together the five files are ~236 KB of SVG,
 * which would otherwise land in the prerendered HTML. Width and height are each file's
 * viewBox, so the browser reserves the right aspect ratio before the lazy load completes.
 */
const mascots = computed(() => [
    { name: t('about.mascotsAwa'), src: '/illustrations/characters-awa.svg', width: 341, height: 605 },
    { name: t('about.mascotsMichael'), src: '/illustrations/characters-michael.svg', width: 330, height: 637 },
    { name: t('about.mascotsTamika'), src: '/illustrations/characters-tamika.svg', width: 330, height: 636 },
    { name: t('about.mascotsSachi'), src: '/illustrations/characters-sachi.svg', width: 355, height: 638 },
    { name: t('about.mascotsChiko'), src: '/illustrations/characters-chiko-therapy-dog-primary.svg', width: 1024, height: 1024 }
])

/*
 * These icons carry hardcoded fills on their paths, which a fill utility on the root
 * cannot override, so each item names the descendant rule that recolours it. LinkedIn
 * recolours its box and gives the "in" the surface colour, so the glyph stays legible
 * on the teal box in both themes instead of keeping the icon's hardcoded white.
 */
const involveLinks = computed(() => [
    {
        label: t('about.involveAdd'),
        to: '/submit',
        icon: SvgAdd,
        iconClass: '**:fill-primary',
        external: false
    },
    /*
     * "Contribute" is the one entry point for getting involved, and it always goes to the docs
     * site — which is where every kind of contribution starts, code included. It used to link
     * straight to the repository, so the same word pointed at two different places depending on
     * whether you read it here or in the footer.
     */
    {
        label: t('about.involveContribute'),
        to: 'https://docs.findadoc.jp',
        icon: SvgNotes,
        iconClass: '**:fill-primary',
        external: true
    },
    {
        label: t('about.involveLinkedin'),
        to: 'https://www.linkedin.com/company/find-a-doc-japan/',
        icon: SvgLinkedin,
        iconClass: '[&_path:first-child]:fill-primary [&_path:last-child]:fill-secondary-bg',
        external: true
    },
    {
        label: t('about.involveFeedback'),
        to: 'https://forms.gle/4E763qfaq46kEsn99',
        icon: SvgFeedback,
        iconClass: '**:fill-primary',
        external: true
    }
])
</script>
