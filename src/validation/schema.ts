import * as yup from "yup";
import type { FormData } from "@/types/form";

export const createValidationSchema = (forms: FormData[]) => {
  const schemaShape: Record<string, yup.AnySchema> = {};

  forms.forEach((form) => {
    const subFieldSchemas: Record<string, yup.AnySchema> = {};

    form.subFields.forEach((field) => {
      if (field.type === "email") {
        subFieldSchemas[field.fieldName] = yup
          .string()
          .email("有効なメールアドレスを入力してください")
          .required("必須項目です");
      } else if (field.type === "number") {
        subFieldSchemas[field.fieldName] = yup
          .number()
          .typeError("数値で入力してください")
          .required("必須項目です");
      } else {
        subFieldSchemas[field.fieldName] = yup
          .string()
          .required("必須項目です");
      }
    });

    schemaShape[form.name] = yup
      .array()
      .of(yup.object().shape(subFieldSchemas));
  });

  return yup.object().shape(schemaShape);
};
