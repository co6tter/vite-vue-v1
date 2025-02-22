<script setup lang="ts">
import BaseCard from "./components/BaseCard.vue";
</script>

<template>
  <div
    class="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
    <template v-for="n in 10" :key="n">
      <BaseCard :msg="n" />
    </template>
  </div>
</template>

<style scoped></style>
