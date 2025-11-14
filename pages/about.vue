<template>
    <div class="overflow-y-auto w-full bg-primary-bg">
        <!-- Hero Section  -->
        <div
            ref="heroSectionRef"
            class="relative flex flex-col items-center p-10 md:p-14"
        >
            <!-- <div class="absolute inset-0 bg-black/30"></div> -->
            <SvgHeartPlus
                role="img"
                alt="pink heart with a white plus in the middle to symbolize health"
                title="heart icon"
                class="my-4 h-32 z-10"
            />
            <h1
                data-testid="about-hero-heading"
                class="mb-12 font-bold text-4xl text-primary-text text-center z-10"
            >
                {{ t("about.heroHeading") }}
            </h1>
            <p
                data-testid="about-hero-subheading"
                class="mb-12 text-2xl text-primary-text text-center z-10"
            >
                {{ t("about.heroSubheading") }}
            </p>
            <div class="flex gap-8 mb-4 z-10">
                <NuxtLink
                    to="/"
                    class="outline outline-1 rounded-xl p-4 bg-primary text-primary-text-inverted
                    text-lg font-bold transition-colors text-center"
                >{{ t("about.heroGetStarted") }}
                </NuxtLink>
                <button
                    class="outline outline-1 outline-primary/70 rounded-xl text-primary
                    font-bold text-xl p-4 shadow-lg text-center"
                    @click="scrollTo('about-header-container')"
                >
                    {{ t("about.heroLearnMore") }}
                </button>
            </div>
            <SvgCharactersTogether
                role="img"
                alt="Characters Together SVG Icon"
                title="Characters Together"
                class="md:w-1/3 md:mr-4"
            />
        </div>
        <!-- Our Story section -->
        <div
            id="about-header-container"
            data-testid="about-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="about-header"
                data-testid="about-header"
                class="flex w-4/5 my-12"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.storyHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div
            id="about-findadoc-section"
            ref="aboutSectionRef"
            class="flex flex-col items-center px-10 md:px-32"
        >
            <p
                data-testid="about-paragraph1"
                class="mb-6 text-md text-primary-text text-center"
            >
                {{ t("about.storyParagraph1") }}
            </p>
            <p
                data-testid="about-paragraph2"
                class="text-md text-primary-text text-center"
            >
                {{ t("about.storyParagraph2") }}
            </p>
            <!-- Scroll buttons -->
            <nav
                id="button-section"
                class="w-full flex justify-center my-6 md:p-10"
            >
                <div class="grid grid-cols-1 gap-4 gap-y-8 mt-10 md:grid-cols-5 md:mr-8 md:w-4/5 md:flex md:justify-around">
                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg text-center"
                        @click="scrollTo('impact-header-container')"
                    >
                        {{ t("about.btnImpact") }}
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('contributor-header-container')"
                    >
                        {{ t("about.btnContributors") }}
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('npo-header-container')"
                    >
                        {{ t("about.btnBoard") }}
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('mascot-header-container')"
                    >
                        {{ t("about.btnMascots") }}
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('involve-header-container')"
                    >
                        {{ t("about.btnInvolve") }}
                    </button>
                </div>
            </nav>
        </div>
        <!-- Impact Section  -->
        <div
            id="impact-header-container"
            data-testid="impact-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="impact-header"
                data-testid="impact-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.impactHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 my-0 md:my-12">
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgDoctor
                    role="img"
                    alt="Doctor SVG Icon"
                    title="Doctor Icon"
                    class="my-4 h-32 fill-primary"
                />
                <p class="font-semibold text-xl text-primary-text">
                    {{ t("about.impactDoctors") }}
                </p>
            </div>

            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgUser
                    role="img"
                    alt="User SVG Icon"
                    title="User Icon"
                    class="my-4 h-32 fill-primary"
                />
                <p class="font-semibold text-xl text-primary-text">
                    {{ t("about.impactUsers") }}
                </p>
            </div>

            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgVolunteer
                    role="img"
                    alt="Volunteer SVG Icon"
                    title="Volunteer Icon"
                    class="my-4 h-32 fill-primary"
                />
                <p class="font-semibold text-xl text-primary-text">
                    {{ t("about.impactVolunteer") }}
                </p>
            </div>
        </div>

        <!-- Contributor Section -->
        <div
            id="contributor-header-container"
            data-testid="contributor-header-container"
            class="flex justify-center items-center my-4"
        >
            <div
                id="contributor-header"
                data-testid="members-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.contributorsHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div
            id="contributor-container"
            data-testid="contributor-container"
            class="flex justify-center items-center"
        >
            <div
                id="contributors"
                data-testid="contributors"
                class="grid grid-cols-2 md:grid-cols-5 mx-4 gap-16 pb-10 md:pb-12"
            >
                <div
                    v-for="(member, index) in contributors"
                    :key="member.avatarImg"
                    data-testid="member"
                    class="members-list grid"
                >
                    <MemberComponent
                        :avatar-img="member.avatarImg"
                        :github-url="member.githubUrl"
                        :linked-in-url="member.linkedInUrl"
                        :name="member.name"
                        :data-test-id="index"
                        :title="member.title"
                    />
                </div>
            </div>
        </div>
        <!-- NPO Board Section  -->
        <div
            id="npo-header-container"
            data-testid="npo-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="npo-header"
                data-testid="npo-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.boardHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div
            id="npo-container"
            data-testid="npo-container"
            class="flex justify-center items-center"
        >
            <div
                id="npo"
                data-testid="npo"
                class="grid grid-cols-2 md:grid-cols-4 mx-4 gap-16 pb-10 md:pb-12"
            >
                <div
                    v-for="(member, index) in boardMembers"
                    :key="member.avatarImg"
                    data-testid="member"
                    class="members-list grid"
                >
                    <MemberComponent
                        :avatar-img="member.avatarImg"
                        :github-url="member.githubUrl"
                        :linked-in-url="member.linkedInUrl"
                        :name="member.name"
                        :data-test-id="index"
                        :title="member.title"
                    />
                </div>
            </div>
        </div>
        <!-- Mascot Section  -->
        <div
            id="mascot-header-container"
            data-testid="mascot-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="mascot-header"
                data-testid="mascot-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.mascotsHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 my-0 md:my-12">
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>{{ t("about.mascotsAwa") }}</h1>
                <SvgAwa
                    role="img"
                    alt="Awa SVG Icon"
                    title="Awa"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>{{ t("about.mascotsMichael") }}</h1>
                <SvgMichael
                    role="img"
                    alt="Michael SVG Icon"
                    title="Michael"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>{{ t("about.mascotsTamika") }}</h1>
                <SvgTamika
                    role="img"
                    alt="Tamika SVG Icon"
                    title="Tamika"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>{{ t("about.mascotsSachi") }}</h1>
                <SvgSachi
                    role="img"
                    alt="Sachi SVG Icon"
                    title="Sachi"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0 md:mt-10">
                <h1>{{ t("about.mascotsChiko") }}</h1>
                <SvgChiko
                    role="img"
                    alt="Chiko SVG Icon"
                    title="Chiko"
                    class="my-4 h-32"
                />
            </div>
        </div>
        <!-- Get Involved section  -->
        <div
            id="involve-header-container"
            data-testid="involve-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="involve-header"
                data-testid="involve-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.involveHeader") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div class="mb-14 grid grid-cols-2 pb-32 md:grid-cols-4 md:gap-0 md:pb-16">
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgAdd
                    role="img"
                    alt="Add Doctor SVG Icon"
                    title="Add Doctor Icon"
                    class="my-4 w-20"
                />
                <NuxtLink
                    to="/submit"
                    class="hover:text-primary-hover text-lg font-bold underline transition-colors"
                >{{ t("about.involveAdd") }}
                </NuxtLink>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgGithub
                    role="img"
                    alt="GitHub SVG Icon"
                    title="Github Icon"
                    class="my-4 w-20"
                />
                <a
                    href="https://github.com/ourjapanlife"
                    class="underline font-bold hover:text-primary-hover text-lg transition-colors"
                    target="_blank"
                >{{ t("about.involveGit") }}</a>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgLinkedin
                    role="img"
                    alt="LinkedIn SVG Icon"
                    title="LinkedIn Icon"
                    class="my-4 w-20"
                />
                <a
                    href="https://www.linkedin.com/company/find-a-doc-japan/"
                    class="underline font-bold hover:text-primary-hover text-lg transition-colors"
                    target="_blank"
                >{{ t("about.involveLinkedin") }}</a>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgFeedback
                    role="img"
                    alt="LinkedIn SVG Icon"
                    title="LinkedIn Icon"
                    class="ml-4 my-4 w-20"
                />
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScx9cXurA6BhbBPUFH2nFAVWPP6Pm3yqXQj-NvJiaI2CUhh0Q/viewform"
                    class="underline font-bold hover:text-primary-hover text-lg transition-colors"
                    target="_blank"
                >{{ t("about.involveFeedback") }}</a>
            </div>
        </div>
        <!-- Back to Top Button  -->
        <Transition
            enter-from-class="opacity-0 translate-y-3"
            enter-active-class="transition ease-out duration-300"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-to-class="opacity-0 translate-y-3"
        >
            <a
                v-show="showScrollUpButton"
                class="fixed bottom-4 left-1/2 -translate-x-1/2
                    md:bottom-4 md:left-auto md:right-6
                     z-50"
            >
                <SvgArrow
                    role="img"
                    alt="Arrow SVG Icon"
                    title="Arrow Icon"
                    class="my-8 h-24 fill-primary cursor-pointer"
                    @click="scrollTo('about-header-container')"
                />
            </a>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import data from '../member_directory/members.json'
import MemberComponent from '~/components/MemberComponent.vue'
import { useSmoothScroll } from '~/composables/useSmoothScroll'
import { shuffleArray } from '~/utils/arrayUtils'
import SvgHeartPlus from '~/assets/icons/heart-plus.svg'
import SvgDoctor from '~/assets/icons/doctor-icon.svg'
import SvgUser from '~/assets/icons/user-icon.svg'
import SvgVolunteer from '~/assets/icons/volunteer-icon.svg'
import SvgGithub from '~/assets/icons/social-github.svg'
import SvgLinkedin from '~/assets/icons/social-linkedin.svg'
import SvgFeedback from '~/assets/icons/feedback-icon.svg'
import SvgAdd from '~/assets/icons/add-square-icon.svg'
import SvgChiko from '~/assets/icons/characters-chiko-therapy-dog-primary.svg'
import SvgAwa from '~/assets/icons/characters-awa.svg'
import SvgMichael from '~/assets/icons/characters-michael.svg'
import SvgSachi from '~/assets/icons/characters-sachi.svg'
import SvgTamika from '~/assets/icons/characters-tamika.svg'
import SvgCharactersTogether from '~/assets/icons/characters-together-welcomescreen.svg'
import SvgArrow from '~/assets/icons/arrow-icon.svg'

interface Member {
    avatarImg: string
    name: string
    title: string
    linkedInUrl?: string | null
    githubUrl?: string | null
    personalWebsite?: string | null
}

const { t } = useI18n()
const { scrollTo } = useSmoothScroll()
const contributors = ref<Member[]>(shuffleArray(data.members))
const boardMembers = ref<Member[]>(data.board)
const showScrollUpButton = ref(false)
const aboutSectionRef = ref<HTMLElement | null>(null)
const heroSectionRef = ref<HTMLElement | null>(null)
const aboutVisible = ref(true)
const heroVisible = ref(true)
let scrollUpButtonObserver: IntersectionObserver

onMounted(() => {
    scrollUpButtonObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.target === aboutSectionRef.value) {
                aboutVisible.value = entry.isIntersecting
            }
            if (entry.target === heroSectionRef.value) {
                heroVisible.value = entry.isIntersecting
            }
        }

        showScrollUpButton.value = !aboutVisible.value && !heroVisible.value
    })

    if (aboutSectionRef.value) scrollUpButtonObserver.observe(aboutSectionRef.value)
    if (heroSectionRef.value) scrollUpButtonObserver.observe(heroSectionRef.value)
})

onUnmounted(() => {
    if (aboutSectionRef.value) scrollUpButtonObserver.unobserve(aboutSectionRef.value)
    if (heroSectionRef.value) scrollUpButtonObserver.unobserve(heroSectionRef.value)
})
</script>
