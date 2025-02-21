<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);

const increment = () => {
  count.value++;
};
const decrement = () => {
  if (count.value > 0) {
    count.value--;
  }
};
</script>

<template>
  <div class="p-8">
    <div class="max-w-lg mx-auto shadow-sm p-8 rounded-2xl">
      <h1 class="text-xl">{{ msg }}</h1>
      <section class="inline-flex gap-x-2 mt-4">
        <h2>count</h2>
        <p>
          {{ count }}
        </p>
      </section>
      <div class="flex gap-x-2 mt-4">
        <button
          class="bg-blue-200 px-4 py-2 rounded min-w-24"
          @click="increment"
        >
          UP
        </button>
        <button
          class="bg-red-200 px-4 py-2 rounded min-w-24"
          @click="decrement"
        >
          DOWN
        </button>
      </div>
    </div>
  </div>
</template>
