<template>
    <div class="member flex flex-col items-center text-center">
        <img
            :src="avatarImg"
            class="member-image object-cover rounded-full w-16 h-16"
        />
        <div
            data-testid="member-name"
            class="member-name mt-1 text-xl font-bold"
        >
            {{ name }}
        </div>
        <div
            data-testid="member-title"
            class="member-title text-md text-primary-text-muted"
        >
            {{ title }}
        </div>
        <div class="member-social flex flex-row mt-2">
            <a
                data-testid="member-linkedin"
                v-if="linkedInUrl"
                :href="linkedInUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link">
                <SVGLinkedinIcon role="img"
                    alt="linkedin icon"
                    title="linkedin icon"
                    class="social-icon w-8 h-8" />
            </a>
            <a
                data-testid="member-github"
                v-if="githubUrl"
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link">
                <SVGGithubIcon role="img"
                    alt="github icon"
                    title="github icon"
                    class="social-icon w-8 h-8 ml-1" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGLinkedinIcon from '~/assets/icons/social-linkedin.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'
import { type PropType } from "vue";

defineProps({
    avatarImg: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    linkedInUrl: {
        type: [String, null] as PropType<string | null>,
        required: false,
    },
    githubUrl: {
        type: [String, null] as PropType<string | null>,
        required: false,
    },
});
</script>
