<script setup lang="ts">
import { useField } from "vee-validate";
import { toRef } from "vue";

interface Props {
  id: string;
  name: string;
  type: string;
  label: string;
  modelValue: string;
}
const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const { errorMessage } = useField(toRef(props, "name"));
const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="relative group">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :class="[
        'peer w-full px-4 py-3 text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 transition-all duration-300',
        errorMessage
          ? 'border-red-500 focus:border-red-600'
          : 'border-gray-300 focus:border-blue-600 hover:border-gray-400',
      ]"
      @input="handleInput"
    />
    <label
      :for="id"
      :class="[
        'absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 left-4 capitalize font-medium',
        errorMessage ? 'peer-focus:text-red-600' : 'peer-focus:text-blue-600',
      ]"
    >
      {{ label }}
    </label>
    <div
      v-if="errorMessage"
      class="flex items-center mt-2 text-red-600 text-sm animate-pulse"
    >
      <svg
        class="w-4 h-4 mr-2 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ errorMessage }}
    </div>
  </div>
</template>
