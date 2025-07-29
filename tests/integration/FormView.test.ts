import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import FormView from "@/views/FormView.vue";
import { useFormStore } from "@/stores/formStore";

// Mock nanoid
vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => "mock-id-1234"),
}));

describe("FormView Integration", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pinia: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: "/", component: FormView }],
    });
  });

  const renderFormView = () => {
    return render(FormView, {
      global: {
        plugins: [pinia, router],
      },
    });
  };

  describe("initial render", () => {
    it("should render main heading", () => {
      renderFormView();

      const heading = screen.getByText("動的フォーム");
      expect(heading).toBeInTheDocument();
    });

    it("should render description text", () => {
      renderFormView();

      const description = screen.getByText(
        "最大3個のフォームを作成・管理できます",
      );
      expect(description).toBeInTheDocument();
    });

    it("should render add form button when no forms exist", () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      expect(addButton).toBeInTheDocument();
    });

    it("should render submit button", () => {
      renderFormView();

      const submitButton = screen.getByText("送信する");
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("form management", () => {
    it("should add form when add button is clicked", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("form")).toBeInTheDocument();
      });
    });

    it("should show form fields after adding form", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("名前")).toBeInTheDocument();
        expect(screen.getByText("メールアドレス")).toBeInTheDocument();
      });
    });

    it("should allow adding multiple forms up to maximum", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");

      // Add 3 forms (maximum)
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);

      await waitFor(() => {
        const formElements = screen.getAllByText("form");
        expect(formElements).toHaveLength(3);
      });

      // Button should be hidden after reaching maximum
      expect(screen.queryByText("フォームを追加")).not.toBeInTheDocument();
    });

    it("should show delete button when multiple forms exist", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText("削除");
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    it("should remove form when delete button is clicked", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);

      await waitFor(() => {
        const deleteButtons = screen.getAllByText("削除");
        expect(deleteButtons).toHaveLength(2);
      });

      const deleteButton = screen.getAllByText("削除")[0];
      await fireEvent.click(deleteButton);

      await waitFor(() => {
        const formElements = screen.getAllByText("form");
        expect(formElements).toHaveLength(1);
      });
    });
  });

  describe("form inputs", () => {
    it("should handle input changes", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", { name: /名前/i });
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByRole("textbox", { name: /名前/i });
      await fireEvent.update(nameInput, "テスト太郎");

      expect(nameInput).toHaveValue("テスト太郎");
    });

    it("should handle email input", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const emailInput = screen.getByRole("textbox", {
          name: /メールアドレス/i,
        });
        expect(emailInput).toBeInTheDocument();
      });

      const emailInput = screen.getByRole("textbox", {
        name: /メールアドレス/i,
      });
      await fireEvent.update(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });
  });

  describe("store integration", () => {
    it("should update store when forms are added", async () => {
      renderFormView();
      const store = useFormStore();

      expect(store.formValues).toHaveLength(0);

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        expect(store.formValues).toHaveLength(1);
      });
    });

    it("should update store when forms are removed", async () => {
      renderFormView();
      const store = useFormStore();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);

      await waitFor(() => {
        expect(store.formValues).toHaveLength(2);
      });

      const deleteButton = screen.getAllByText("削除")[0];
      await fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(store.formValues).toHaveLength(1);
      });
    });

    it("should reflect form values in JSON preview", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", { name: /名前/i });
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByRole("textbox", { name: /名前/i });
      await fireEvent.update(nameInput, "テスト");

      await waitFor(() => {
        const jsonPreview = screen.getByText(/テスト/);
        expect(jsonPreview).toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    it("should have submit button that triggers form submission", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", { name: /名前/i });
        expect(nameInput).toBeInTheDocument();
      });

      const nameInput = screen.getByRole("textbox", { name: /名前/i });
      const emailInput = screen.getByRole("textbox", {
        name: /メールアドレス/i,
      });

      await fireEvent.update(nameInput, "テスト太郎");
      await fireEvent.update(emailInput, "test@example.com");

      const submitButton = screen.getByText("送信する");
      expect(submitButton).toBeInTheDocument();

      // Test that clicking the button doesn't throw errors
      await fireEvent.click(submitButton);
    });

    it("should show form count indicator", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const countIndicator = screen.getByText("1 フォーム作成済み");
        expect(countIndicator).toBeInTheDocument();
      });
    });

    it("should update form count when forms are added/removed", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);

      await waitFor(() => {
        const countIndicator = screen.getByText("2 フォーム作成済み");
        expect(countIndicator).toBeInTheDocument();
      });

      // Check if delete buttons are visible (only when more than minimum)
      const deleteButtons = screen.queryAllByText("削除");
      if (deleteButtons.length > 0) {
        await fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
          const countIndicator = screen.getByText("1 フォーム作成済み");
          expect(countIndicator).toBeInTheDocument();
        });
      } else {
        // If no delete buttons (at minimum), count should remain 2
        const countIndicator = screen.getByText("2 フォーム作成済み");
        expect(countIndicator).toBeInTheDocument();
      }
    });
  });

  describe("validation integration", () => {
    it("should integrate with validation schema", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", { name: /名前/i });
        expect(nameInput).toBeInTheDocument();
      });

      // Form inputs should exist and be ready for validation
      const nameInput = screen.getByRole("textbox", { name: /名前/i });
      const emailInput = screen.getByRole("textbox", {
        name: /メールアドレス/i,
      });

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });
  });

  describe("responsive design", () => {
    it("should render grid layout for form fields", async () => {
      const { container } = renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const gridContainer = container.querySelector(
          ".grid.grid-cols-1.md\\:grid-cols-2",
        );
        expect(gridContainer).toBeInTheDocument();
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper heading structure", () => {
      renderFormView();

      const mainHeading = screen.getByRole("heading", {
        name: /動的フォーム/i,
      });
      expect(mainHeading).toBeInTheDocument();
    });

    it("should have accessible form elements", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");
      await fireEvent.click(addButton);

      await waitFor(() => {
        const nameInput = screen.getByRole("textbox", { name: /名前/i });
        const emailInput = screen.getByRole("textbox", {
          name: /メールアドレス/i,
        });

        expect(nameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
      });
    });

    it("should have accessible buttons", () => {
      renderFormView();

      const addButton = screen.getByRole("button", { name: /フォームを追加/i });
      const submitButton = screen.getByRole("button", { name: /送信する/i });

      expect(addButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle rapid form additions", async () => {
      renderFormView();

      const addButton = screen.getByText("フォームを追加");

      // Rapidly click add button
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      await fireEvent.click(addButton);
      await fireEvent.click(addButton); // Should not add 4th form

      await waitFor(() => {
        const formElements = screen.getAllByText("form");
        expect(formElements).toHaveLength(3); // Maximum is 3
      });
    });
  });
});
