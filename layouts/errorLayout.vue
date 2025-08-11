<template>
    <div class="flex flex-col justify-center items-center text-center p-5">
        <h1 class="text-3xl font-bold mt-4 mb-8">
            {{ t("errorPage.title") }}
        </h1>
        <h2 class="mb-8">
            {{ t("errorPage.description") }}
        </h2>
        <a
            href="/"
            class="
        px-6 py-2 bg-primary hover:bg-primary/60
        text-primary-inverted rounded-md no-underline text-2xl my-8
      "
        >
            {{ t("errorPage.returnHome") }}
        </a>
        <SVGCharactersTogetherWelcomeScreen
            v-if="randomCharacter === CharacterOptions.TogetherWelcomeScreen"
            class="mt-16 w-11/12 landscape:w-7/12 landscape:max-w-2xl"
        />
        <SVGCharactersSachiQuestioning
            v-if="randomCharacter === CharacterOptions.SachiQuestioning"
            class="mt-16 w-7/12 landscape:w-72 landscape:max-w-2xl"
        />
        <SVGCharactersChikoTherapyDogPrimary
            v-if="randomCharacter === CharacterOptions.ChikoTherapyDogPrimary"
            class="mt-16 w-11/12 landscape:w-80 landscape:max-w-2xl"
        />
    </div>
</template>

<script lang="ts" setup>
import SVGCharactersTogetherWelcomeScreen from '~/assets/icons/characters-together-welcomescreen.svg'
import SVGCharactersSachiQuestioning from '~/assets/icons/characters-sachi-questioning.svg'
import SVGCharactersChikoTherapyDogPrimary from '~/assets/icons/characters-chiko-therapy-dog-primary.svg'

enum CharacterOptions {
    TogetherWelcomeScreen = 'TOGETHER_WELCOME_SCREEN',
    SachiQuestioning = 'SACHI_QUESTIONING',
    ChikoTherapyDogPrimary = 'CHIKO_THERAPY_DOG_PRIMARY'
}

const { t } = useI18n()

const randomCharacter = computed(() => {
    const characters = Object.values(CharacterOptions)
    return characters[Math.floor(Math.random() * characters.length)]
})
</script>
