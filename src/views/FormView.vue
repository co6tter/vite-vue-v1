<script setup lang="ts">
import { DynamicForm } from "@/utils/DynamicForm";
import type { FormData } from "@/types/form";
import { createValidationSchema } from "@/validation/schema";
import { useForm } from "vee-validate";
import { computed, reactive } from "vue";
import { useFormStore } from "@/stores/formStore";
import CustomInput from "@/components/CustomInput.vue";

const template: FormData = {
  id: "",
  name: "form",
  subFields: [
    {
      name: "name",
      fieldName: "name",
      type: "text",
      label: "名前",
    },
    {
      name: "email",
      fieldName: "email",
      type: "email",
      label: "メールアドレス",
    },
  ],
};
const dynamicForm = reactive(new DynamicForm([], 1, 3));

const formStore = useFormStore();

const schema = computed(() => {
  return createValidationSchema(dynamicForm.fields);
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  console.log("フォーム送信:", values);
  alert("フォームが正常に送信されました！");
});

const addForm = () => {
  dynamicForm.addField(template);
  formStore.addForm();
};

const removeForm = (index: number) => {
  dynamicForm.removeField(index);
  formStore.removeForm(index);
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12"
  >
    <div class="max-w-5xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
        >
          動的フォーム
        </h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          最大3個のフォームを作成・管理できます
        </p>
        <div
          class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"
        ></div>
      </header>

      <div class="space-y-8">
        <div
          v-for="(form, formIndex) in dynamicForm.fields"
          :key="form.id"
          class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-500 group"
        >
          <div class="flex justify-between items-start mb-8">
            <div class="flex items-center gap-4">
              <div class="relative group/badge">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover/badge:scale-110 transition-all duration-300"
                >
                  {{ formIndex + 1 }}
                </div>
                <div
                  class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg animate-bounce"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl opacity-30 scale-110 animate-pulse"
                ></div>
              </div>
              <div>
                <h2
                  class="text-3xl font-black text-gray-800 mb-1 tracking-tight"
                >
                  {{ form.name }}
                </h2>
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <p class="text-sm text-gray-500 font-medium">
                    フォーム {{ formIndex + 1 }} - アクティブ
                  </p>
                </div>
              </div>
            </div>
            <button
              v-if="dynamicForm.fieldLength > dynamicForm.fieldMin"
              class="group/del relative overflow-hidden bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold px-4 py-2 rounded-xl shadow-xl hover:shadow-red-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border border-red-400/50"
              @click="removeForm(formIndex)"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/del:translate-x-full transition-transform duration-700"
              ></div>
              <div class="relative flex items-center gap-2">
                <div
                  class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover/del:rotate-180 transition-all duration-500"
                >
                  <svg
                    class="w-4 h-4 font-bold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <span class="tracking-wide font-semibold">削除</span>
              </div>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="field in form.subFields"
              :key="field.fieldName"
              class="space-y-2"
            >
              <CustomInput
                :id="`${form.name}_${field.fieldName}_${formIndex}`"
                v-model="
                  formStore.formValues[formIndex][
                    field.fieldName as keyof (typeof formStore.formValues)[0]
                  ]
                "
                :name="`${form.name}[${formIndex}].${field.fieldName}`"
                :type="field.type"
                :label="field.label"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center py-8">
          <button
            v-if="dynamicForm.fieldLength < dynamicForm.fieldMax"
            class="group/add relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 text-white font-black py-4 px-8 rounded-full shadow-xl hover:shadow-blue-500/40 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 border-2 border-white/30"
            @click="addForm"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 -translate-x-full group-hover/add:translate-x-full transition-transform duration-1000"
            ></div>
            <div class="relative flex items-center gap-3">
              <div
                class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover/add:rotate-180 transition-all duration-700"
              >
                <svg
                  class="w-5 h-5 font-bold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span class="text-base tracking-wider font-bold"
                >フォームを追加</span
              >
            </div>
            <div
              class="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-full opacity-20 group-hover/add:opacity-40 transition-opacity duration-500 animate-pulse"
            ></div>
          </button>
        </div>

        <div
          class="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl mb-6"
        >
          <div
            class="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <div class="text-center lg:text-left">
              <div
                class="flex items-center justify-center lg:justify-start gap-2 mt-3"
              >
                <div class="flex gap-1">
                  <div
                    v-for="i in dynamicForm.fieldLength"
                    :key="i"
                    class="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"
                  ></div>
                </div>
                <span class="text-xs text-gray-600 font-medium"
                  >{{ dynamicForm.fieldLength }} フォーム作成済み</span
                >
              </div>
            </div>

            <form @submit.prevent="onSubmit">
              <button
                type="submit"
                class="group/submit relative overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 hover:from-orange-500 hover:via-red-600 hover:to-pink-700 text-white font-black py-5 px-10 rounded-full shadow-xl hover:shadow-red-500/50 transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 border-2 border-white/40"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -skew-x-12 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1200"
                ></div>
                <div class="relative flex items-center gap-4">
                  <div
                    class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover/submit:rotate-12 transition-all duration-500"
                  >
                    <svg
                      class="w-6 h-6 group-hover/submit:translate-x-2 transition-all duration-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="text-xl font-black tracking-wider">
                      送信する
                    </div>
                  </div>
                </div>
                <div
                  class="absolute -inset-1 bg-gradient-to-br from-orange-400 to-pink-600 rounded-full opacity-20 group-hover/submit:opacity-30 transition-opacity duration-700 animate-pulse"
                ></div>
              </button>
            </form>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 rounded-3xl shadow-2xl border border-gray-700"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  class="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                >
                  フォームデータ
                </h3>
                <p class="text-gray-400 text-sm">リアルタイムプレビュー</p>
              </div>
            </div>
            <div class="flex gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div
                class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                style="animation-delay: 0.5s"
              ></div>
              <div
                class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                style="animation-delay: 1s"
              ></div>
            </div>
          </div>
          <div
            class="bg-black/50 border border-gray-700 rounded-2xl p-6 font-mono"
          >
            <pre
              class="text-green-400 text-sm leading-relaxed overflow-x-auto"
              >{{ JSON.stringify(formStore.formValues, null, 2) }}</pre
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
