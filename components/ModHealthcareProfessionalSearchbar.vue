<template>
    <div>
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modSubmissionForm.healthcareProfessionalId') }}
        </span>
        <div class="flex flex-col mt-4">
            <div class="justify-start items-start flex">
                <input 
                    type='text'
                    :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalSearchbar')"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                />
                <SVGLookingGlass role="img" title="searching icon" class="relative right-8 top-3 w-6 h-6"/>
            </div>
        </div>
    </div> 
</template>

<script lang="ts" setup>

import SVGLookingGlass from '~/assets/icons/looking-glass.svg'
</script>