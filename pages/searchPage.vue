<template>
  <div class="h-full">
    <TopNav />
    <div class="flex flex-col md:flex-row h-full">
      <Welcome />
      <FeaturedNews />
    </div>
    <div class="w-full">
      <Media />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            name: 'LogRocket',
        }
    }
})
</script>
