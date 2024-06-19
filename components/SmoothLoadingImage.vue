<template>
  
    <SmoothLoadingImageFadeTransition><div v-show="!isVisible"><SVGLoadingIcon /></div></SmoothLoadingImageFadeTransition>
   <SmoothLoadingImageFadeTransition><img v-show="isVisible" :data-testid=testId :class="`object-${objectStyling} rounded-${borderRadius} w-${width} h-${height}`" :src="src" @load="showImg()"/></SmoothLoadingImageFadeTransition>

</template>

<script lang='ts' setup>
  import { reactive, ref, watch, type Ref } from 'vue'
  import SVGLoadingIcon from '~/assets/icons/loading.svg'

  const props = defineProps({
    imgSrc: {
        type: String,
        required: true,
    },
    testId: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    objectStyling:{
        type: String,
        required: true,
    },
    height:{
        type: String,
        required: true,
    },
    width:{
        type: String,
        required: true,
    },
    borderRadius:{
        type: String,
        required: true,
    },
  })
  
  const src:Ref<string | undefined> = ref()
  const isVisible:Ref<boolean> = ref(false)
  const showImg = function () {
    isVisible.value = true
  }
  
  watch(
    () => props.imgSrc,
    () => {
    src.value = props.imgSrc
    isVisible.value = false
  }, {immediate: true})
  

</script>


<style scoped>
  .loader {
    border: 4px solid grey;
    border-top: 4px solid darkGrey;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 5s linear infinite;
    position: absolute;
    left: calc(50% - 15px);
    top: calc(50% - 15px);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>