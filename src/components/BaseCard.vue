<script setup lang="ts">
interface Props {
  msg: string | number;
}
defineProps<Props>();
</script>

<template>
  <div class="bg-fuchsia-50 size-50">
    <span class="text-2xl text-stone-400">{{ msg }}</span>
  </div>
</template>
