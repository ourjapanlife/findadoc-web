<template>
  <div class="flex flex-col h-screen">
    <TopNav />
    <div class="flex h-full">
      <Welcome />
      <Testimonial />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IndexPage",
});
</script>
