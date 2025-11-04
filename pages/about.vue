<template>
    <div class="overflow-y-auto w-full bg-primary-bg">
        <div class="flex flex-col items-center px-10 md:px-32">
            <SvgHeartPlus
                role="img"
                alt="pink heart with a white plus in the middle to symbolize health"
                title="heart icon"
                class="my-4 h-32"
            />
            <h1
                data-testid="about-heading"
                class="mb-12 font-bold text-4xl"
            >
                {{ t("about.heading") }}
            </h1>
            <p
                data-testid="about-subheading"
                class="mb-12 text-2xl"
            >
                {{ t("about.subheading") }}
            </p>
            <p
                data-testid="about-paragraph1"
                class="mb-6 text-md text-primary-text-muted"
            >
                {{ t("about.paragraph1") }}
            </p>
            <p
                data-testid="about-paragraph2"
                class="text-md text-primary-text-muted"
            >
                {{ t("about.paragraph2") }}
            </p>
        </div>
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
                <div class="text-primary/80 text-xl font-semibold mx-4 p-2 whitespace-nowrap">
                    {{ t("about.members") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div
            id="members-container"
            data-testid="members-container"
            class="flex justify-center items-center"
        >
            <div
                id="members"
                data-testid="members"
                class="grid grid-cols-2 md:grid-cols-4 mx-4 gap-10 pb-10 md:pb-12"
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
                class="outline rounded-xl bg-primary text-primary-text font-bold p-4 mb-5"
                @click="toggleShowAll"
            >
                {{ showAll ? 'Show Less' : 'Show All' }}
            </button>
        </div>
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
                <div class="text-primary/80 text-xl font-semibold mx-4 p-2 whitespace-nowrap">
                    NPO Board
                </div>
                <div class="flex-1 border-currentColor/70 border self-center" />
            </div>
        </div>
        <div
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import data from '../member_directory/members.json'
import MemberComponent from '~/components/MemberComponent.vue'
import SvgHeartPlus from '~/assets/icons/heart-plus.svg'

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

const visibleContributors = computed(() =>
    showAll.value ? contributors.value : contributors.value.slice(0, 8))

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>
