<script>
</script>

<template>
  <Transition name="fade">
    <slot></slot> 
  </Transition>
</template>

<style>
  .fade-enter-active, 
  .fade-leave-active {
    transition: opacity 1s ease;
  }

  .fade-enter-from, 
  .fade-leave-to {
    opacity: 0;
  }
</style>