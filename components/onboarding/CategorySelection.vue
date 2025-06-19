<template>
    <div class="h-screen w-full bg-primary-bg p-2 pt-6 overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-grid-white/[0.05]" />
        </div>

        <div class="flex flex-col">
            <h1 class="landscape:text-4xl landscape:my-12 landscape:mb-20 text-4xl font-bold text-primary-text mb-8 text-center">
                {{ t('onboarding.selectcategory') }}
            </h1>
            <div
                class="grid grid-cols-3 gap-x-2 gap-y-4 mx-1
                    portrait:flex-grow portrait:mb-8
                    landscape:mb-8 landscape:justify-items-center"
            >
                <button
                    v-for="category in categories"
                    :key="category.code"
                    type="button"
                    class="bg-secondary-bg/90 hover:bg-secondary-bg transition-all
                        rounded-xl pt-1 pb-2 px-2 landscape:p-4 text-center shadow transform hover:scale-105
                        hover:shadow-xl landscape:min-w-64 min-w-24 whitespace-pre-line text-sm"
                    @click="selectCategory(category.code)"
                >
                    <div class="flex justify-center items-start">
                        <span class="inline-block w-8 h-8">
                            <component
                                :is="categoryIconMap[category.code]"
                                class="w-8 h-8"
                                aria-hidden="true"
                            />
                        </span>
                    </div>
                    <span class="relative font-medium text-primary-text">
                        {{ category.displayText }}
                    </span>
                </button>
            </div>
            <button
                type="button"
                class="bg-accent/70 hover:bg-accent/90 text-primary-text-inverted py-4 my-10 rounded-xl
                    font-medium transition-colors mb-6 border-2 border-primary-bg/20
                    hover:border-primary-bg/40 shadow-lg transform hover:scale-105
                        hover:shadow-xl self-center max-w-md w-full flex items-center justify-center gap-2"
                @click="selectCategory(undefined)"
            >
                <span class="inline-block w-6 h-6">
                    <component :is="HealthiconQuestionCircleOutline" class="w-6 h-6" aria-hidden="true" />
                </span>
                <span>{{ t('onboarding.notsurebutton') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes'

import HealthiconBabyOutline from '~/assets/icons/category-childrens.svg'
import HealthiconCosmeticSurgeryOutline from '~/assets/icons/category-cosmetic.svg'
import HealthiconDentistOutline from '~/assets/icons/category-dentist.svg'
import HealthiconSkinOutline from '~/assets/icons/category-dermatology.svg'
import HealthiconEarOutline from '~/assets/icons/category-ent.svg'
import HealthiconVisionOutline from '~/assets/icons/category-eye.svg'
import HealthiconMaleOutline from '~/assets/icons/category-mens-health.svg'
import HealthiconMentalHealthOutline from '~/assets/icons/category-mental-health.svg'
import HealthiconPhysicalTherapyOutline from '~/assets/icons/category-rehab.svg'
import HealthiconFamilyPracticeOutline from '~/assets/icons/category-primary-care.svg'
import HealthiconSportsInjuryOutline from '~/assets/icons/category-sports.svg'
import HealthiconFemaleOutline from '~/assets/icons/category-womens-health.svg'
import HealthiconQuestionCircleOutline from '~/assets/icons/question.svg' // for something else button

const { t } = useI18n()

const specialtyStore = useSpecialtiesStore()

const categories = computed(() => specialtyStore.specialtyCategories)

const categoryIconMap: Record<SpecialtyCategory, string> = {
    CHILDRENS_HEALTH: HealthiconBabyOutline,
    COSMETIC_AND_PLASTIC_SURGERY: HealthiconCosmeticSurgeryOutline,
    DENTAL: HealthiconDentistOutline,
    DERMATOLOGY: HealthiconSkinOutline,
    ENT: HealthiconEarOutline,
    EYE_AND_VISION: HealthiconVisionOutline,
    MENS_HEALTH: HealthiconMaleOutline,
    MENTAL_HEALTH: HealthiconMentalHealthOutline,
    PHYSICAL_THERAPY: HealthiconPhysicalTherapyOutline,
    PRIMARY_CARE: HealthiconFamilyPracticeOutline,
    SPORTS_AND_REHAB: HealthiconSportsInjuryOutline,
    WOMENS_HEALTH: HealthiconFemaleOutline
}

const emit = defineEmits<{
    (e: 'select-category', category: SpecialtyCategory | undefined): void
}>()

const selectCategory = (category: SpecialtyCategory | undefined) => {
    emit('select-category', category)
}
</script>
