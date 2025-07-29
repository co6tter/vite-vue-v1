import { DynamicForm } from "@/utils/DynamicForm";
import type { FormData } from "@/types/form";

describe("DynamicForm", () => {
  let dynamicForm: DynamicForm;
  const mockTemplate: FormData = {
    id: "",
    name: "testForm",
    subFields: [
      {
        name: "testField",
        fieldName: "testField",
        type: "text",
        label: "テストフィールド",
      },
    ],
  };

  beforeEach(() => {
    dynamicForm = new DynamicForm([], 1, 3);
  });

  describe("initialization", () => {
    it("should initialize with empty array", () => {
      expect(dynamicForm.fields).toEqual([]);
      expect(dynamicForm.fieldLength).toBe(0);
    });

    it("should set min and max values correctly", () => {
      expect(dynamicForm.fieldMin).toBe(1);
      expect(dynamicForm.fieldMax).toBe(3);
    });

    it("should initialize with custom parameters", () => {
      const customForm = new DynamicForm([mockTemplate], 2, 5);
      expect(customForm.fields).toHaveLength(1);
      expect(customForm.fieldMin).toBe(2);
      expect(customForm.fieldMax).toBe(5);
    });
  });

  describe("addField", () => {
    it("should add field successfully", () => {
      dynamicForm.addField(mockTemplate);

      expect(dynamicForm.fieldLength).toBe(1);
      expect(dynamicForm.fields[0].name).toBe("testForm");
      expect(dynamicForm.fields[0].id).toMatch(/^testForm_/);
    });

    it("should generate unique name for subFields", () => {
      dynamicForm.addField(mockTemplate);

      const addedField = dynamicForm.fields[0];
      expect(addedField.subFields[0].name).toMatch(/^testForm_testField_/);
      expect(addedField.subFields[0].fieldName).toBe("testField");
    });

    it("should generate unique IDs when adding multiple fields", () => {
      dynamicForm.addField(mockTemplate);
      dynamicForm.addField(mockTemplate);

      const firstId = dynamicForm.fields[0].id;
      const secondId = dynamicForm.fields[1].id;
      expect(firstId).not.toBe(secondId);
    });

    it("should not add field when exceeding maximum limit", () => {
      for (let i = 0; i < 5; i++) {
        dynamicForm.addField(mockTemplate);
      }

      expect(dynamicForm.fieldLength).toBe(3);
    });

    it("should handle multiple subFields correctly", () => {
      const multiFieldTemplate: FormData = {
        id: "",
        name: "multiForm",
        subFields: [
          {
            name: "field1",
            fieldName: "field1",
            type: "text",
            label: "フィールド1",
          },
          {
            name: "field2",
            fieldName: "field2",
            type: "email",
            label: "フィールド2",
          },
        ],
      };

      dynamicForm.addField(multiFieldTemplate);

      const addedField = dynamicForm.fields[0];
      expect(addedField.subFields).toHaveLength(2);
      expect(addedField.subFields[0].name).toMatch(/^multiForm_field1_/);
      expect(addedField.subFields[1].name).toMatch(/^multiForm_field2_/);
    });
  });

  describe("removeField", () => {
    beforeEach(() => {
      dynamicForm.addField(mockTemplate);
      dynamicForm.addField(mockTemplate);
    });

    it("should remove field at specified index", () => {
      const initialLength = dynamicForm.fieldLength;
      dynamicForm.removeField(0);

      expect(dynamicForm.fieldLength).toBe(initialLength - 1);
    });

    it("should not remove field when below minimum limit", () => {
      const singleFieldForm = new DynamicForm([mockTemplate], 1, 3);
      singleFieldForm.removeField(0);

      expect(singleFieldForm.fieldLength).toBe(1);
    });

    it("should handle invalid index without throwing error", () => {
      expect(() => {
        dynamicForm.removeField(-1);
        dynamicForm.removeField(100);
      }).not.toThrow();
    });

    it("should remove correct field by index", () => {
      const firstFieldId = dynamicForm.fields[0].id;
      const secondFieldId = dynamicForm.fields[1].id;

      dynamicForm.removeField(0);

      expect(dynamicForm.fields[0].id).toBe(secondFieldId);
      expect(
        dynamicForm.fields.find((f) => f.id === firstFieldId),
      ).toBeUndefined();
    });
  });

  describe("removeAllFields", () => {
    beforeEach(() => {
      dynamicForm.addField(mockTemplate);
      dynamicForm.addField(mockTemplate);
    });

    it("should remove all fields", () => {
      dynamicForm.removeAllFields();

      expect(dynamicForm.fieldLength).toBe(0);
      expect(dynamicForm.fields).toEqual([]);
    });

    it("should be safe to execute on empty state", () => {
      dynamicForm.removeAllFields();
      dynamicForm.removeAllFields();

      expect(dynamicForm.fieldLength).toBe(0);
    });
  });

  describe("getters", () => {
    it("should return correct reference for fields property", () => {
      dynamicForm.addField(mockTemplate);

      const fields = dynamicForm.fields;
      expect(fields).toBe(dynamicForm.fields);
    });

    it("should return current array length for fieldLength", () => {
      expect(dynamicForm.fieldLength).toBe(0);

      dynamicForm.addField(mockTemplate);
      expect(dynamicForm.fieldLength).toBe(1);

      dynamicForm.addField(mockTemplate);
      expect(dynamicForm.fieldLength).toBe(2);
    });
  });

  describe("boundary value tests", () => {
    it("should handle fieldMin = 0, fieldMax = 0", () => {
      const zeroForm = new DynamicForm([], 0, 0);
      zeroForm.addField(mockTemplate);

      expect(zeroForm.fieldLength).toBe(0);
    });

    it("should handle fieldMin = fieldMax", () => {
      const equalForm = new DynamicForm([], 2, 2);
      equalForm.addField(mockTemplate);
      equalForm.addField(mockTemplate);
      equalForm.addField(mockTemplate);

      expect(equalForm.fieldLength).toBe(2);

      equalForm.removeField(0);
      expect(equalForm.fieldLength).toBe(2);
    });
  });
});
