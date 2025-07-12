<template>
    <div
        style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Noto Sans', sans-serif;
      text-align: center;
      padding: 20px;
    "
    >
        <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 32px;">
            404 - Diagnosis: Page Not Found
        </h1>
        <h2 style="margin-bottom: 32px;">
            This page didn't pass its wellness exam. Let's get you to a healthy page instead!
        </h2>
        <a
            href="/"
            class="return-home-btn"
            style="
        display: inline-block;
        padding: 10px 24px;
        color: #ffffff;
        border-radius: 6px;
        text-decoration: none;
        font-size: 24px;
        font-family: 'Noto Sans', sans-serif;
        font-weight: 500;
        margin-bottom: 32px;
      "
        >
            Return home
        </a>
        <CharactersTogetherWelcomescreen
            style="margin-top: auto; margin-bottom: 32px; max-width: 800px; width: 100%; height: auto;"
        />
    </div>
</template>

<script>
import CharactersTogetherWelcomescreen from '~/assets/icons/characters-together-welcomescreen.svg'

export default {
    components: {
        CharactersTogetherWelcomescreen
    }
}
</script>

<style>
.return-home-btn {
  background: #0dafbf;
}

.return-home-btn:hover {
  background: #0991a0;
}
</style>
