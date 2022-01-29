<template>
  <div class="flex flex-col h-screen">
    <TopNav />
    <div class="flex flex-col md:flex-row h-full">
      <Welcome />
      <FeaturedNews />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage",
});
</script>
