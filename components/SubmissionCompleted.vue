<template>
    <div
        data-testid="submit-completed"
        class="flex flex-col place-items-center"
    >
        <img
            class="mb-10"
            src="../assets/images/heart-circle.png"
            alt="heart circle icon"
        >
        <p
            class="mb-3.5 text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal"
        >
            {{ $t('thankYouPage.heading') }}
        </p>
        <p
            class="mb-40 text-neutral-600 text-sm font-bold font-['Noto Sans JP']"
        >
            {{ $t('thankYouPage.submission') }}
        </p>
        <NuxtLink
            class="flex"
            to="/"
        >
            <button
                class="px-20 py-3 rounded-full bg-currentColor w-[350px] text-center
        text-white text-base font-medium font-['Noto Sans JP']"
            >{{ $t('thankYouPage.home') }}</button>
        </NuxtLink>
    </div>
</template>
