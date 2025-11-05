<template>
    <div class="overflow-y-auto w-full bg-primary-bg">
        <!-- About findadoc section -->
        <div class="flex flex-col items-center px-10 md:px-32">
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
                {{ t("about.heading") }}
            </h1>
            <p
                data-testid="about-subheading"
                class="mb-12 text-2xl text-primary-text"
            >
                {{ t("about.subheading") }}
            </p>
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
        </div>
        <!-- Member Section -->
        <!-- Member Heading -->
        <div
            id="members-header-container"
            data-testid="members-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="members-header"
                data-testid="members-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    Our Team
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <!-- Member Tabs -->
        <div class="w-full flex justify-center mb-10">
            <div class="inline-flex gap-4 border-b mr-8">
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    class="pb-2 px-1 text-md font-medium transition"
                    :class="activeTab === tab.key
                        ? 'text-primary-text underline'
                        : 'text-primary-text-muted hover:text-primary-hover'"
                    @click="selectTab(tab.key)"
                >
                    {{ tab.label }}
                </button>
            </div>
        </div>
        <!-- Member Contributor Content -->
        <div v-show="activeTab === 'contributors'">
            <div
                id="members-container"
                data-testid="members-container"
                class="flex justify-center items-center"
            >
                <div
                    id="members"
                    data-testid="members"
                    class="grid grid-cols-2 md:grid-cols-5 mx-4 gap-16 pb-10 md:pb-12"
                >
                    <div
                        v-for="(member, index) in visibleContributors"
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
            <div class="flex flex-col items-center">
                <button
                    class="outline rounded-xl bg-primary text-primary-text hover:bg-primary-hover font-bold p-4 mb-5"
                    @click="toggleShowAll"
                >
                    {{ showAll ? 'Show Less' : 'Show All' }}
                </button>
            </div>
        </div>
        <!-- Member NPO Board Content  -->
        <div
            v-show="activeTab === 'board'"
            id="members-container"
            data-testid="members-container"
            class="flex justify-center items-center"
        >
            <div
                id="members"
                data-testid="members"
                class="grid grid-cols-2 md:grid-cols-4 mx-4 gap-8 pb-10 md:pb-12"
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
            v-show="activeTab === 'mascots'"
            class="grid grid-cols-1 md:grid-cols-5"
        >
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
            id="members-header-container"
            data-testid="members-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="members-header"
                data-testid="members-header"
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
        <!-- Join us section  -->
        <div
            id="members-header-container"
            data-testid="members-header-container"
            class="flex justify-center items-center"
        >
            <div
                id="members-header"
                data-testid="members-header"
                class="flex w-4/5 my-14"
            >
                <div class="flex-1 border-currentColor/70 border self-center" />
                <div class="text-primary-text text-2xl font-bold mx-4 p-2 whitespace-nowrap">
                    Get Involved
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div class="mb-12 grid grid-cols-1 md:grid-cols-4">
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgAdd
                    role="img"
                    alt="Add Doctor SVG Icon"
                    title="Add Doctor Icon"
                    class="my-4 h-32"
                />
                <!-- Submit a new Doctor Link -->
                <NuxtLink
                    to="/submit"
                    class="hover:text-primary-hover text-xl font-bold underline transition-colors"
                >Add a Doctor
                </NuxtLink>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgGithub
                    role="img"
                    alt="GitHub SVG Icon"
                    title="Github Icon"
                    class="my-4 h-32"
                />
                <a
                    href="https://github.com/ourjapanlife"
                    class="underline font-bold hover:text-primary-hover text-xl transition-colors"
                    target="_blank"
                >Contribute on Github</a>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgLinkedin
                    role="img"
                    alt="LinkedIn SVG Icon"
                    title="LinkedIn Icon"
                    class="my-4 h-32"
                />
                <a
                    href="https://www.linkedin.com/company/find-a-doc-japan/"
                    class="underline font-bold hover:text-primary-hover text-xl transition-colors"
                    target="_blank"
                >Follow us on LinkedIn</a>
            </div>
            <div class="flex flex-col items-center my-6 md:my-0">
                <SvgFeedback
                    role="img"
                    alt="LinkedIn SVG Icon"
                    title="LinkedIn Icon"
                    class="ml-4 my-4 h-32"
                />
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScx9cXurA6BhbBPUFH2nFAVWPP6Pm3yqXQj-NvJiaI2CUhh0Q/viewform"
                    class="underline font-bold hover:text-primary-hover text-xl transition-colors"
                    target="_blank"
                >Give us feedback</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

interface Member {
    avatarImg: string
    name: string
    title: string
    linkedInUrl?: string | null
    githubUrl?: string | null
    personalWebsite?: string | null
}

const { t } = useI18n()
const showAll = ref(false)
const contributors = ref<Member[]>(data.members)
const boardMembers = ref<Member[]>(data.board)
const tabs = [
    { key: 'contributors', label: 'Contributors' },
    { key: 'board', label: 'NPO Board' },
    { key: 'mascots', label: 'Mascots' }
]
const activeTab = ref<string>('contributors')

const selectTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
    if (showAll.value) {
        toggleShowAll()
    }
}

const visibleContributors = computed(() =>
    showAll.value ? contributors.value : contributors.value.slice(0, 10))

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>
