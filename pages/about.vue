<template>
    <div class="overflow-y-auto w-full bg-primary-bg">
        <!-- Hero Section  -->
        <div class="flex flex-col items-center p-10">
            <SvgHeartPlus
                role="img"
                alt="pink heart with a white plus in the middle to symbolize health"
                title="heart icon"
                class="my-4 h-32"
            />
            <h1
                data-testid="about-heading"
                class="mb-12 font-bold text-4xl text-primary-text"
            >
                Find a Doc, Japan
            </h1>
            <p
                data-testid="about-subheading"
                class="mb-12 text-2xl text-primary-text"
            >
                {{ t("about.subheading") }}
            </p>
            <div class="flex gap-8">
                <NuxtLink
                    to="/"
                    class="outline outline-1 rounded-xl p-4 bg-primary text-primary-text-inverted
                    text-lg font-bold transition-colors"
                >Get Started
                </NuxtLink>
                <button
                    class="outline outline-1 outline-primary/70 rounded-xl text-primary
                    font-bold text-xl p-4 shadow-lg"
                    @click="scrollTo('about-findadoc-section')"
                >
                    Learn More
                </button>
            </div>
            <img
                src="~/assets/images/find_a_doc_japan_cover.jpg"
                alt="hero banner"
                class="m-8 outline outline-1 rounded-xl shadow-xl opacity-80"
            >
        </div>

        <!-- Our Story section -->
        <div
            id="about-header-container"
            data-testid="about-header-container"
            class="flex justify-center items-center my-4"
        >
            <div
                id="about-header"
                data-testid="about-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    Our Story
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
                class="mb-6 text-md text-primary-text"
            >
                {{ t("about.paragraph1") }}
            </p>
            <p
                data-testid="about-paragraph2"
                class="text-md text-primary-text"
            >
                {{ t("about.paragraph2") }}
            </p>
            <!-- Scroll buttons -->
            <nav
                id="button-section"
                class="w-full flex justify-center my-6 p-10"
            >
                <div class="md:w-4/5 grid grid-cols-2 gap-4 gap-y-8 md:flex md:justify-around mt-10 mr-8">
                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('contributor-header-container')"
                    >
                        Contributors
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('npo-header-container')"
                    >
                        NPO Board
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('mascot-header-container')"
                    >
                        Mascots
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('impact-header-container')"
                    >
                        Impact
                    </button>

                    <button
                        class="outline outline-1 outline-primary/70 rounded-xl text-primary hover:text-primary-text-inverted
                    hover:bg-primary font-bold text-xl p-4 shadow-lg"
                        @click="scrollTo('involve-header-container')"
                    >
                        Get Involved
                    </button>
                </div>
            </nav>
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
                    Contributors
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
                    NPO Board
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
                    Mascots
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 my-0 md:my-12">
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>Awa</h1>
                <SvgAwa
                    role="img"
                    alt="Awa SVG Icon"
                    title="Awa"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>Michael</h1>
                <SvgMichael
                    role="img"
                    alt="Michael SVG Icon"
                    title="Michael"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>Tamika</h1>
                <SvgTamika
                    role="img"
                    alt="Tamika SVG Icon"
                    title="Tamika"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0">
                <h1>Sachi</h1>
                <SvgSachi
                    role="img"
                    alt="Sachi SVG Icon"
                    title="Sachi"
                    class="my-4 h-40"
                />
            </div>
            <div class="flex flex-col items-center my-8 md:my-0 md:mt-10">
                <h1>Chiko</h1>
                <SvgChiko
                    role="img"
                    alt="Chiko SVG Icon"
                    title="Chiko"
                    class="my-4 h-32"
                />
            </div>
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
                    Our Impact
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
                    300+ Doctors Registered
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
                    100+ Monthly Users
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
                    Volunteer and Community Driven
                </p>
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
                    Get Involved
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
                <!-- Submit a new Doctor Link -->
                <NuxtLink
                    to="/submit"
                    class="hover:text-primary-hover text-lg font-bold underline transition-colors"
                >Add a Doctor
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
                >Contribute</a>
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
                >Follow us</a>
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
                >Give feedback</a>
            </div>
        </div>
        <!-- Back to Top Button  -->
        <!-- <Transition
            enter-from-class="opacity-0 translate-y-3"
            enter-active-class="transition ease-out duration-300"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-to-class="opacity-0 translate-y-3"
        >
            <a
                v-show="showArrow"
                class="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 md:bottom-2"
            >
                <SvgArrow
                    role="img"
                    alt="Arrow SVG Icon"
                    title="Arrow Icon"
                    class="my-8 h-24 fill-primary cursor-pointer"
                    @click="scrollTo('button-section')"
                />
            </a>
        </Transition> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import data from '../member_directory/members.json'
import MemberComponent from '~/components/MemberComponent.vue'
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
const contributors = ref<Member[]>(data.members)
const boardMembers = ref<Member[]>(data.board)
const showArrow = ref(false)
const aboutSectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver

function scrollTo(id: string) {
    const target = document.getElementById(id)
    if (!target) return

    const start = window.scrollY
    const end = target.getBoundingClientRect().top + window.scrollY
    const duration = 1000 // ms
    const startTime = performance.now()

    function animateScroll(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const ease = 0.5 * (1 - Math.cos(Math.PI * progress))

        window.scrollTo(0, start + (end - start) * ease)

        if (progress < 1) requestAnimationFrame(animateScroll)
    }

    requestAnimationFrame(animateScroll)
}

onMounted(() => {
    observer = new IntersectionObserver(
        entries => {
            const entry = entries[0]
            // Show button if hero is NOT visible
            showArrow.value = !entry.isIntersecting
        },
        { threshold: 0 } // triggers as soon as it leaves
    )

    if (aboutSectionRef.value) {
        observer.observe(aboutSectionRef.value)
    }
})

onUnmounted(() => {
    if (aboutSectionRef.value) observer.unobserve(aboutSectionRef.value)
})
</script>
