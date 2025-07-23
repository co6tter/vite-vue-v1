import { defineStore } from "pinia";
import type { FormValue } from "@/types/form";

export const useFormStore = defineStore("form", {
  state: (): {
    formValues: FormValue[];
  } => ({
    formValues: [],
  }),
  actions: {
    addForm() {
      const formValue: FormValue = {
        name: "",
        email: "",
      };
      this.formValues.push(formValue);
    },
    removeForm(index: number) {
      this.formValues.splice(index, 1);
    },
    resetStore() {
      this.formValues = [];
    },
  },
});
