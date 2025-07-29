import { setActivePinia, createPinia } from "pinia";
import { useFormStore } from "@/stores/formStore";

describe("useFormStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("initial state", () => {
    it("should initialize with empty formValues array", () => {
      const store = useFormStore();

      expect(store.formValues).toEqual([]);
      expect(store.formValues).toHaveLength(0);
    });
  });

  describe("addForm", () => {
    it("should add new form with default values", () => {
      const store = useFormStore();

      store.addForm();

      expect(store.formValues).toHaveLength(1);
      expect(store.formValues[0]).toEqual({
        name: "",
        email: "",
      });
    });

    it("should add multiple forms correctly", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      expect(store.formValues).toHaveLength(3);
      store.formValues.forEach((form) => {
        expect(form).toEqual({
          name: "",
          email: "",
        });
      });
    });

    it("should create independent form objects", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();

      store.formValues[0].name = "Test Name";
      store.formValues[0].email = "test@example.com";

      expect(store.formValues[1]).toEqual({
        name: "",
        email: "",
      });
    });
  });

  describe("removeForm", () => {
    it("should remove form at specified index", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      const initialLength = store.formValues.length;

      store.removeForm(1);

      expect(store.formValues).toHaveLength(initialLength - 1);
    });

    it("should remove correct form by index", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      store.formValues[0].name = "First";
      store.formValues[1].name = "Second";
      store.formValues[2].name = "Third";

      store.removeForm(1);

      expect(store.formValues).toHaveLength(2);
      expect(store.formValues[0].name).toBe("First");
      expect(store.formValues[1].name).toBe("Third");
    });

    it("should handle invalid index gracefully", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      expect(() => {
        store.removeForm(-1);
      }).not.toThrow();

      // splice(-1, 1) removes the last element
      expect(store.formValues).toHaveLength(2);

      expect(() => {
        store.removeForm(100);
      }).not.toThrow();

      // splice(100, 1) on array of length 2 does nothing
      expect(store.formValues).toHaveLength(2);
    });

    it("should handle removing from empty array", () => {
      const store = useFormStore();

      expect(() => {
        store.removeForm(0);
      }).not.toThrow();

      expect(store.formValues).toHaveLength(0);
    });

    it("should handle removing last element", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      store.removeForm(store.formValues.length - 1);

      expect(store.formValues).toHaveLength(2);
    });
  });

  describe("resetStore", () => {
    it("should reset formValues to empty array", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.formValues[0].name = "Test";
      store.formValues[0].email = "test@example.com";

      store.resetStore();

      expect(store.formValues).toEqual([]);
      expect(store.formValues).toHaveLength(0);
    });

    it("should be safe to call on empty store", () => {
      const store = useFormStore();

      expect(() => {
        store.resetStore();
      }).not.toThrow();

      expect(store.formValues).toEqual([]);
    });

    it("should reset completely filled store", () => {
      const store = useFormStore();

      for (let i = 0; i < 5; i++) {
        store.addForm();
        store.formValues[i].name = `Name ${i}`;
        store.formValues[i].email = `email${i}@example.com`;
      }

      store.resetStore();

      expect(store.formValues).toEqual([]);
    });
  });

  describe("reactivity", () => {
    it("should maintain reactive state when adding forms", () => {
      const store = useFormStore();

      expect(store.formValues).toHaveLength(0);

      store.addForm();
      expect(store.formValues).toHaveLength(1);

      store.addForm();
      expect(store.formValues).toHaveLength(2);
    });

    it("should maintain reactive state when removing forms", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();

      expect(store.formValues).toHaveLength(2);

      store.removeForm(0);
      expect(store.formValues).toHaveLength(1);
    });

    it("should maintain reactive state when resetting store", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();

      expect(store.formValues).toHaveLength(2);

      store.resetStore();
      expect(store.formValues).toHaveLength(0);
    });
  });

  describe("form value mutations", () => {
    it("should allow direct modification of form values", () => {
      const store = useFormStore();

      store.addForm();

      store.formValues[0].name = "John Doe";
      store.formValues[0].email = "john@example.com";

      expect(store.formValues[0]).toEqual({
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should preserve modifications during operations", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.addForm();

      store.formValues[0].name = "First";
      store.formValues[1].name = "Second";
      store.formValues[2].name = "Third";

      store.removeForm(1);

      expect(store.formValues[0].name).toBe("First");
      expect(store.formValues[1].name).toBe("Third");
    });
  });

  describe("edge cases", () => {
    it("should handle concurrent operations", () => {
      const store = useFormStore();

      store.addForm();
      store.addForm();
      store.removeForm(0);
      store.addForm();
      store.resetStore();
      store.addForm();

      expect(store.formValues).toHaveLength(1);
      expect(store.formValues[0]).toEqual({
        name: "",
        email: "",
      });
    });

    it("should maintain correct indices after multiple operations", () => {
      const store = useFormStore();

      // Add 5 forms
      for (let i = 0; i < 5; i++) {
        store.addForm();
        store.formValues[i].name = `Form ${i}`;
      }

      // Remove middle forms
      store.removeForm(2); // Remove "Form 2"
      store.removeForm(1); // Remove "Form 1"

      expect(store.formValues).toHaveLength(3);
      expect(store.formValues[0].name).toBe("Form 0");
      expect(store.formValues[1].name).toBe("Form 3");
      expect(store.formValues[2].name).toBe("Form 4");
    });
  });
});
