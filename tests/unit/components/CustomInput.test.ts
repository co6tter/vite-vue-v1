// vitest globals are automatically available
import { render, screen, fireEvent } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import CustomInput from "@/components/CustomInput.vue";

describe("CustomInput", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const defaultProps = {
    id: "test-input",
    name: "testField",
    type: "text",
    label: "テストラベル",
    modelValue: "",
  };

  describe("component rendering", () => {
    it("should render input with correct attributes", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "test-input");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should render label with correct text", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const label = screen.getByText("テストラベル");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "test-input");
    });

    it("should display model value in input", () => {
      render(CustomInput, {
        props: {
          ...defaultProps,
          modelValue: "initial value",
        },
      });

      const input = screen.getByDisplayValue("initial value");
      expect(input).toBeInTheDocument();
    });

    it("should handle different input types", () => {
      const types = ["text", "email", "number", "password"];

      types.forEach((type) => {
        const { unmount } = render(CustomInput, {
          props: {
            ...defaultProps,
            type,
          },
        });

        const input = document.querySelector(`input[type="${type}"]`);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", type);
        unmount();
      });
    });
  });

  describe("user interactions", () => {
    it("should emit update:modelValue on input change", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      await fireEvent.update(input, "new value");

      expect(emitted()["update:modelValue"]).toBeTruthy();
      expect(emitted()["update:modelValue"][0]).toEqual(["new value"]);
    });

    it("should emit multiple updates correctly", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      await fireEvent.update(input, "first");
      await fireEvent.update(input, "second");
      await fireEvent.update(input, "third");

      const updateEvents = emitted()["update:modelValue"];
      expect(updateEvents).toHaveLength(3);
      expect(updateEvents[0]).toEqual(["first"]);
      expect(updateEvents[1]).toEqual(["second"]);
      expect(updateEvents[2]).toEqual(["third"]);
    });

    it("should handle empty string input", async () => {
      const { emitted } = render(CustomInput, {
        props: {
          ...defaultProps,
          modelValue: "initial",
        },
      });

      const input = screen.getByRole("textbox");
      await fireEvent.update(input, "");

      expect(emitted()["update:modelValue"][0]).toEqual([""]);
    });

    it("should handle special characters", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const input = screen.getByRole("textbox");
      await fireEvent.update(input, specialChars);

      expect(emitted()["update:modelValue"][0]).toEqual([specialChars]);
    });
  });

  describe("validation integration", () => {
    it("should not display error message initially", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const errorElement = screen.queryByText(/エラー/);
      expect(errorElement).not.toBeInTheDocument();
    });

    it("should have proper input structure", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("peer");
      expect(input).toHaveClass("w-full");
      expect(input).toHaveClass("px-4");
      expect(input).toHaveClass("py-3");
    });

    it("should apply correct label styles", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const label = screen.getByText("テストラベル");
      expect(label).toHaveClass("absolute");
      expect(label).toHaveClass("duration-300");
      expect(label).toHaveClass("transform");
    });
  });

  describe("accessibility", () => {
    it("should associate label with input via for/id", () => {
      render(CustomInput, {
        props: {
          ...defaultProps,
          id: "accessible-input",
        },
      });

      const input = screen.getByRole("textbox");
      const label = screen.getByText("テストラベル");

      expect(input).toHaveAttribute("id", "accessible-input");
      expect(label).toHaveAttribute("for", "accessible-input");
    });

    it("should have proper input structure for screen readers", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id");
      expect(input).toHaveAttribute("type");
    });

    it("should maintain focus styling", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("focus:outline-none");
      expect(input).toHaveClass("focus:ring-0");
    });
  });

  describe("styling behavior", () => {
    it("should have floating label animation classes", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const label = screen.getByText("テストラベル");
      expect(label).toHaveClass("peer-placeholder-shown:scale-100");
      expect(label).toHaveClass("peer-placeholder-shown:translate-y-0");
      expect(label).toHaveClass("peer-focus:scale-75");
      expect(label).toHaveClass("peer-focus:-translate-y-6");
    });

    it("should have transition classes", () => {
      render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");
      const label = screen.getByText("テストラベル");

      expect(input).toHaveClass("transition-all");
      expect(input).toHaveClass("duration-300");
      expect(label).toHaveClass("duration-300");
    });

    it("should have proper container structure", () => {
      const { container } = render(CustomInput, {
        props: defaultProps,
      });

      const containerDiv = container.querySelector(".relative.group");
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe("props validation", () => {
    it("should handle all required props", () => {
      const requiredProps = {
        id: "required-test",
        name: "requiredField",
        type: "email",
        label: "必須フィールド",
        modelValue: "test@example.com",
      };

      render(CustomInput, {
        props: requiredProps,
      });

      const input = screen.getByRole("textbox");
      const label = screen.getByText("必須フィールド");

      expect(input).toHaveAttribute("id", "required-test");
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveValue("test@example.com");
      expect(label).toBeInTheDocument();
    });

    it("should handle empty modelValue", () => {
      render(CustomInput, {
        props: {
          ...defaultProps,
          modelValue: "",
        },
      });

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("should handle different label texts", () => {
      const labels = ["名前", "メールアドレス", "電話番号", "住所"];

      labels.forEach((label) => {
        const { unmount } = render(CustomInput, {
          props: {
            ...defaultProps,
            label,
          },
        });

        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very long input values", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const longValue = "a".repeat(1000);
      const input = screen.getByRole("textbox");
      await fireEvent.update(input, longValue);

      expect(emitted()["update:modelValue"][0]).toEqual([longValue]);
    });

    it("should handle Unicode characters", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const unicodeValue = "こんにちは🌸";
      const input = screen.getByRole("textbox");
      await fireEvent.update(input, unicodeValue);

      expect(emitted()["update:modelValue"][0]).toEqual([unicodeValue]);
    });

    it("should handle rapid input changes", async () => {
      const { emitted } = render(CustomInput, {
        props: defaultProps,
      });

      const input = screen.getByRole("textbox");

      // Simulate rapid typing
      await fireEvent.update(input, "a");
      await fireEvent.update(input, "ab");
      await fireEvent.update(input, "abc");
      await fireEvent.update(input, "abcd");

      const updateEvents = emitted()["update:modelValue"];
      expect(updateEvents).toHaveLength(4);
      expect(updateEvents[3]).toEqual(["abcd"]);
    });

    it("should handle number input type", async () => {
      const { emitted } = render(CustomInput, {
        props: {
          ...defaultProps,
          type: "number",
        },
      });

      const input = screen.getByRole("spinbutton");
      await fireEvent.update(input, "123");

      expect(emitted()["update:modelValue"][0]).toEqual(["123"]);
    });
  });
});
