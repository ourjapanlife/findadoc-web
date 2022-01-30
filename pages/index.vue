<template>
  <div class="">
    <TopNav />
    <div class="flex flex-col md:flex-row min-h-fit">
      <Welcome />
      <FeaturedNews />
    </div>
    <div class="w-full h-full">
      <Media />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage",
});
</script>
