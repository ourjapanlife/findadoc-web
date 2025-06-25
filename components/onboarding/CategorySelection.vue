<template>
    <div class="h-screen w-full bg-primary-bg p-2 pt-6 overflow-hidden">
        <div class="flex flex-col">
            <!-- Header text -->
            <h1 class="landscape:text-4xl landscape:my-12 landscape:mb-20 text-4xl font-bold text-primary-text mb-8 text-center">
                {{ t('onboarding.selectcategory') }}
            </h1>
            <!-- Category selection grid -->
            <div
                class="grid grid-cols-[.18fr,.18fr,.18fr] gap-x-2 gap-y-4 mx-1 justify-content-center
                    portrait:mb-8 landscape:mb-8"
            >
                <!-- Category buttons -->
                <button
                    v-for="category in categories"
                    :key="category.code"
                    type="button"
                    class="bg-secondary-bg/90 hover:bg-secondary-bg transition-all
                        rounded-xl pt-3 pb-4 px-2 text-center shadow hover:shadow-xl
                        transform hover:scale-105 w-24 landscape:w-64 whitespace-pre-line text-sm"
                    @click="selectCategory(category.code)"
                >
                    <div class="flex justify-center items-start">
                        <span class="inline-block w-8 h-8">
                            <component
                                :is="categoryIconMap[category.code]"
                                class="w-8 h-8 fill-currentColor"
                                aria-hidden="true"
                            />
                        </span>
                    </div>
                    <span class="relative font-medium text-primary-text">
                        {{ category.displayText }}
                    </span>
                </button>
            </div>
            <!-- "Something else" button -->
            <button
                id="something-else-category-button"
                type="button"
                class="text-primary-text-inverted py-4 mt-10 mx-8 mb-6 rounded-xl
                    font-medium bg-accent/70 hover:bg-accent/90 border-2 border-primary-bg/20 hover:border-primary-bg/40
                    shadow-lg hover:shadow-xl transition-colors transform hover:scale-105
                         self-center max-w-md w-full flex items-center justify-center gap-2"
                @click="selectCategory(undefined)"
            >
                <span>{{ t('onboarding.notsurebutton') }}</span>
                <span class="inline-block w-6 h-6">
                    <component
                        :is="HealthIconQuestionCircleOutline"
                        class="w-6 h-6"
                        aria-hidden="true"
                    />
                </span>
            </button>
            <SVGCharactersSachiQuestioning
                role="img"
                alt="Find a Doc, Japan character sachi questioning"
                title="Find a Doc, Japan character sachi questioning"
                class="absolute left-0 bottom-0 landscape:left-12 landscape:w-96 w-64
                    max-w-xs opacity-50 pointer-events-none select-none z-0"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SpecialtyCategory } from '~/typedefs/gqlTypes'

import HealthIconBabyOutline from '@/assets/icons/category-childrens.svg'
import HealthIconCosmeticSurgeryOutline from '@/assets/icons/category-cosmetic.svg'
import HealthIconDentistOutline from '@/assets/icons/category-dentist.svg'
import HealthIconSkinOutline from '@/assets/icons/category-dermatology.svg'
import HealthIconEarOutline from '@/assets/icons/category-ent.svg'
import HealthIconVisionOutline from '@/assets/icons/category-eye.svg'
import HealthIconMaleOutline from '@/assets/icons/category-mens-health.svg'
import HealthIconMentalHealthOutline from '@/assets/icons/category-mental-health.svg'
import HealthIconPhysicalTherapyOutline from '@/assets/icons/category-rehab.svg'
import HealthIconFamilyPracticeOutline from '@/assets/icons/category-primary-care.svg'
import HealthIconSportsInjuryOutline from '@/assets/icons/category-sports.svg'
import HealthIconFemaleOutline from '@/assets/icons/category-womens-health.svg'
import HealthIconQuestionCircleOutline from '@/assets/icons/question.svg' // for something else button
import SVGCharactersSachiQuestioning from '@/assets/icons/characters-sachi-questioning.svg'

const { t } = useI18n()

const specialtyStore = useSpecialtiesStore()

const categories = computed(() => specialtyStore.specialtyCategories)

const categoryIconMap: Record<SpecialtyCategory, string> = {
    CHILDRENS_HEALTH: HealthIconBabyOutline,
    COSMETIC_AND_PLASTIC_SURGERY: HealthIconCosmeticSurgeryOutline,
    DENTAL: HealthIconDentistOutline,
    DERMATOLOGY: HealthIconSkinOutline,
    ENT: HealthIconEarOutline,
    EYE_AND_VISION: HealthIconVisionOutline,
    MENS_HEALTH: HealthIconMaleOutline,
    MENTAL_HEALTH: HealthIconMentalHealthOutline,
    PHYSICAL_THERAPY: HealthIconPhysicalTherapyOutline,
    PRIMARY_CARE: HealthIconFamilyPracticeOutline,
    SPORTS_AND_REHAB: HealthIconSportsInjuryOutline,
    WOMENS_HEALTH: HealthIconFemaleOutline
}

const emit = defineEmits<{
    (e: 'select-category', category: SpecialtyCategory | undefined): void
}>()

const selectCategory = (category: SpecialtyCategory | undefined) => {
    emit('select-category', category)
}
</script>
