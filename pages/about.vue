<template>
    <div class="w-full">
        <div class="flex flex-col items-center px-10 md:px-32">
            <SvgHeartPlus role="img" alt="pink heart with a white plus in the middle to symbolize health" title="heart icon"
                class="my-4 h-32" />
            <h1 data-testid="about-heading" class="mb-12 font-bold text-4xl">
                {{ $t("about.heading") }}
            </h1>
            <p data-testid="about-subheading" class="mb-12 text-2xl">
                {{ $t("about.subheading") }}
            </p>
            <p data-testid="about-paragraph1" class="mb-6 text-md text-primary-text-muted">
                {{ $t("about.paragraph1") }}
            </p>
            <p data-testid="about-paragraph2" class="text-md text-primary-text-muted">
                {{ $t("about.paragraph2") }}
            </p>
        </div>
        <div data-testid="members-header-container" id="members-header-container"
            class="flex justify-center items-center">
            <div data-testid="members-header" id="members-header" class="flex w-4/5 my-14">
                <div class="flex-1 border-currentColor/70 border self-center"></div>
                <div class="text-primary/80 text-xl font-semibold mx-4 p-2 whitespace-nowrap">
                    {{ $t("about.members") }}
                </div>
                <div class="flex-1 border-currentColor/70 border self-center"></div>
            </div>
        </div>
        <div data-testid="members-container" id="members-container" class="flex justify-center items-center">
            <div data-testid="members" id="members"
                class="grid grid-cols-2 md:grid-cols-3 mx-4 gap-8 pb-12 md:pb-32">
                <div data-testid="member" class="members-list grid"
                    :key="index" v-for="(member, index) in data.members">
                    <MemberComponent :avatarImg="member.avatarImg" :name="member.name" :title="member.title"
                        :linkedInUrl="member.linkedInUrl" :githubUrl="member.githubUrl" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import data from "../member_directory/members.json"
import MemberComponent from "~/components/MemberComponent.vue"
import SvgHeartPlus from '~/assets/icons/heart-plus.svg'
</script>
