<template>
    <div class="flex flex-col items-center gap-2 text-center">
        <img
            :src="avatarImg"
            :alt="name"
            :data-testid="`member-avatar-${dataTestId}`"
            loading="lazy"
            decoding="async"
            width="96"
            height="96"
            class="h-24 w-24 rounded-full bg-accent-bg object-cover"
        >
        <div
            data-testid="member-name"
            class="font-semibold text-primary-text"
        >
            {{ name }}
        </div>
        <div
            data-testid="member-title"
            class="text-sm text-primary-text-muted"
        >
            {{ title }}
        </div>
        <!--
            Both icons ship with hardcoded fills on their paths, so a fill utility on the
            root cannot recolour them; the first-path rule targets the GitHub mark and the
            LinkedIn box. LinkedIn's "in" takes the surface colour rather than its hardcoded
            white, which would vanish on the light grey box in dark mode.
        -->
        <div class="flex gap-1">
            <a
                v-if="linkedInUrl"
                data-testid="member-linkedin"
                :href="linkedInUrl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary-text-muted
                       transition-colors hover:bg-accent-bg/60 hover:text-primary"
            >
                <SVGLinkedinIcon
                    class="h-5 w-5 [&_path:first-child]:fill-current [&_path:last-child]:fill-secondary-bg"
                    aria-hidden="true"
                />
            </a>
            <a
                v-if="githubUrl"
                data-testid="member-github"
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary-text-muted
                       transition-colors hover:bg-accent-bg/60 hover:text-primary"
            >
                <SVGGithubIcon
                    class="h-5 w-5 [&_path:first-child]:fill-current"
                    aria-hidden="true"
                />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import SVGLinkedinIcon from '~/assets/icons/social-linkedin.svg'
import SVGGithubIcon from '~/assets/icons/social-github.svg'

defineProps({
    avatarImg: {
        type: String,
        required: true
    },
    githubUrl: {
        type: [String, null] as PropType<string | null>,
        required: false
    },
    linkedInUrl: {
        type: [String, null] as PropType<string | null>,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    dataTestId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})
</script>
