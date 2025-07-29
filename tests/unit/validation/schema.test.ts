import { createValidationSchema } from "@/validation/schema";
import type { FormData } from "@/types/form";
import * as yup from "yup";

function isErrorWithMessage(e: unknown): e is { message: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (e as any).message === "string"
  );
}

describe("createValidationSchema", () => {
  const mockFormData: FormData[] = [
    {
      id: "form1",
      name: "testForm",
      subFields: [
        {
          name: "testForm_name_1234",
          fieldName: "name",
          type: "text",
          label: "名前",
        },
        {
          name: "testForm_email_5678",
          fieldName: "email",
          type: "email",
          label: "メールアドレス",
        },
      ],
    },
  ];

  describe("schema generation", () => {
    it("should create validation schema for empty forms array", () => {
      const schema = createValidationSchema([]);

      expect(schema).toBeInstanceOf(yup.ObjectSchema);
      expect(Object.keys(schema.fields)).toHaveLength(0);
    });

    it("should create validation schema for single form", () => {
      const schema = createValidationSchema(mockFormData);

      expect(schema).toBeInstanceOf(yup.ObjectSchema);
      expect(schema.fields).toHaveProperty("testForm");
    });

    it("should create array schema for form fields", () => {
      const schema = createValidationSchema(mockFormData);
      const formSchema = schema.fields.testForm;

      expect(formSchema).toBeInstanceOf(yup.ArraySchema);
    });

    it("should handle multiple forms", () => {
      const multipleFormData: FormData[] = [
        mockFormData[0],
        {
          id: "form2",
          name: "secondForm",
          subFields: [
            {
              name: "secondForm_title_9999",
              fieldName: "title",
              type: "text",
              label: "タイトル",
            },
          ],
        },
      ];

      const schema = createValidationSchema(multipleFormData);

      expect(Object.keys(schema.fields)).toHaveLength(2);
      expect(schema.fields).toHaveProperty("testForm");
      expect(schema.fields).toHaveProperty("secondForm");
    });
  });

  describe("field type validation", () => {
    it("should create text field validation", () => {
      const textFormData: FormData[] = [
        {
          id: "form1",
          name: "textForm",
          subFields: [
            {
              name: "textForm_text_1234",
              fieldName: "text",
              type: "text",
              label: "テキスト",
            },
          ],
        },
      ];

      const schema = createValidationSchema(textFormData);

      expect(() => {
        schema.validateSync({
          textForm: [{ text: "valid text" }],
        });
      }).not.toThrow();
    });

    it("should create email field validation", () => {
      const emailFormData: FormData[] = [
        {
          id: "form1",
          name: "emailForm",
          subFields: [
            {
              name: "emailForm_email_1234",
              fieldName: "email",
              type: "email",
              label: "メール",
            },
          ],
        },
      ];

      const schema = createValidationSchema(emailFormData);

      expect(() => {
        schema.validateSync({
          emailForm: [{ email: "test@example.com" }],
        });
      }).not.toThrow();

      expect(() => {
        schema.validateSync({
          emailForm: [{ email: "invalid-email" }],
        });
      }).toThrow();
    });

    it("should create number field validation", () => {
      const numberFormData: FormData[] = [
        {
          id: "form1",
          name: "numberForm",
          subFields: [
            {
              name: "numberForm_age_1234",
              fieldName: "age",
              type: "number",
              label: "年齢",
            },
          ],
        },
      ];

      const schema = createValidationSchema(numberFormData);

      expect(() => {
        schema.validateSync({
          numberForm: [{ age: 25 }],
        });
      }).not.toThrow();

      expect(() => {
        schema.validateSync({
          numberForm: [{ age: "not a number" }],
        });
      }).toThrow();
    });

    it("should handle mixed field types", () => {
      const mixedFormData: FormData[] = [
        {
          id: "form1",
          name: "mixedForm",
          subFields: [
            {
              name: "mixedForm_name_1234",
              fieldName: "name",
              type: "text",
              label: "名前",
            },
            {
              name: "mixedForm_email_5678",
              fieldName: "email",
              type: "email",
              label: "メール",
            },
            {
              name: "mixedForm_age_9999",
              fieldName: "age",
              type: "number",
              label: "年齢",
            },
          ],
        },
      ];

      const schema = createValidationSchema(mixedFormData);

      expect(() => {
        schema.validateSync({
          mixedForm: [
            {
              name: "John Doe",
              email: "john@example.com",
              age: 30,
            },
          ],
        });
      }).not.toThrow();
    });
  });

  describe("validation behavior", () => {
    it("should require all fields", () => {
      const schema = createValidationSchema(mockFormData);

      expect(() => {
        schema.validateSync({
          testForm: [{ name: "" }],
        });
      }).toThrow(/必須項目です/);

      expect(() => {
        schema.validateSync({
          testForm: [{ email: "" }],
        });
      }).toThrow(/必須項目です/);
    });

    it("should validate email format", () => {
      const schema = createValidationSchema(mockFormData);

      const invalidEmailTests = [
        "invalid-email",
        "test@",
        "@example.com",
        "test.example.com",
        "",
      ];

      invalidEmailTests.forEach((email) => {
        expect(() => {
          schema.validateSync({
            testForm: [{ name: "John", email }],
          });
        }).toThrow();
      });
    });

    it("should validate number format", () => {
      const numberFormData: FormData[] = [
        {
          id: "form1",
          name: "numberForm",
          subFields: [
            {
              name: "numberForm_count_1234",
              fieldName: "count",
              type: "number",
              label: "カウント",
            },
          ],
        },
      ];

      const schema = createValidationSchema(numberFormData);

      const invalidNumberTests = ["not a number", "123abc", "", null];

      invalidNumberTests.forEach((count) => {
        expect(() => {
          schema.validateSync({
            numberForm: [{ count }],
          });
        }).toThrow();
      });
    });

    it("should validate array of forms", () => {
      const schema = createValidationSchema(mockFormData);

      expect(() => {
        schema.validateSync({
          testForm: [
            { name: "John", email: "john@example.com" },
            { name: "Jane", email: "jane@example.com" },
          ],
        });
      }).not.toThrow();

      expect(() => {
        schema.validateSync({
          testForm: [
            { name: "John", email: "john@example.com" },
            { name: "", email: "invalid-email" },
          ],
        });
      }).toThrow();
    });
  });

  describe("error messages", () => {
    it("should provide Japanese error messages for required fields", () => {
      const schema = createValidationSchema(mockFormData);

      try {
        schema.validateSync({
          testForm: [{ name: "", email: "test@example.com" }],
        });
      } catch (error) {
        if (!isErrorWithMessage(error)) {
          throw error;
        }
        expect(error.message).toContain("必須項目です");
      }
    });

    it("should provide Japanese error messages for email validation", () => {
      const schema = createValidationSchema(mockFormData);

      try {
        schema.validateSync({
          testForm: [{ name: "John", email: "invalid-email" }],
        });
      } catch (error) {
        if (!isErrorWithMessage(error)) {
          throw error;
        }
        expect(error.message).toContain(
          "有効なメールアドレスを入力してください",
        );
      }
    });

    it("should provide Japanese error messages for number validation", () => {
      const numberFormData: FormData[] = [
        {
          id: "form1",
          name: "numberForm",
          subFields: [
            {
              name: "numberForm_age_1234",
              fieldName: "age",
              type: "number",
              label: "年齢",
            },
          ],
        },
      ];

      const schema = createValidationSchema(numberFormData);

      try {
        schema.validateSync({
          numberForm: [{ age: "not a number" }],
        });
      } catch (error) {
        if (!isErrorWithMessage(error)) {
          throw error;
        }
        expect(error.message).toContain("数値で入力してください");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty subFields array", () => {
      const emptySubFieldsData: FormData[] = [
        {
          id: "form1",
          name: "emptyForm",
          subFields: [],
        },
      ];

      const schema = createValidationSchema(emptySubFieldsData);

      expect(() => {
        schema.validateSync({
          emptyForm: [{}],
        });
      }).not.toThrow();
    });

    it("should handle unknown field types as text", () => {
      const unknownTypeData: FormData[] = [
        {
          id: "form1",
          name: "unknownForm",
          subFields: [
            {
              name: "unknownForm_custom_1234",
              fieldName: "custom",
              type: "unknown-type",
              label: "カスタム",
            },
          ],
        },
      ];

      const schema = createValidationSchema(unknownTypeData);

      expect(() => {
        schema.validateSync({
          unknownForm: [{ custom: "some value" }],
        });
      }).not.toThrow();

      expect(() => {
        schema.validateSync({
          unknownForm: [{ custom: "" }],
        });
      }).toThrow(/必須項目です/);
    });

    it("should handle duplicate form names", () => {
      const duplicateNameData: FormData[] = [
        {
          id: "form1",
          name: "duplicateForm",
          subFields: [
            {
              name: "duplicateForm_field1_1234",
              fieldName: "field1",
              type: "text",
              label: "フィールド1",
            },
          ],
        },
        {
          id: "form2",
          name: "duplicateForm",
          subFields: [
            {
              name: "duplicateForm_field2_5678",
              fieldName: "field2",
              type: "text",
              label: "フィールド2",
            },
          ],
        },
      ];

      const schema = createValidationSchema(duplicateNameData);

      // Last form with same name should override
      expect(Object.keys(schema.fields)).toHaveLength(1);
      expect(schema.fields).toHaveProperty("duplicateForm");
    });
  });
});
