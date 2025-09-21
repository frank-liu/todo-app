import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

test("renders My To-Do List heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/My To-Do List/i);
  expect(headingElement).toBeInTheDocument();
});

describe("Add button functionality", () => {
  test("renders Add button", () => {
    render(<App />);
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeInTheDocument();
  });

  test("adds a new todo when Add button is clicked with valid input", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Test todo item");
    await userEvent.click(addButton);

    expect(screen.getByText("Test todo item")).toBeInTheDocument();
  });

  test("clears input field after adding a todo", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(
      /add a new to-do/i
    ) as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Test todo item");
    await userEvent.click(addButton);

    expect(input.value).toBe("");
  });

  test("does not add todo when input is empty", async () => {
    render(<App />);

    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.click(addButton);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("does not add todo when input contains only whitespace", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "   ");
    await userEvent.click(addButton);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });

  test("adds multiple todos", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "First todo");
    await userEvent.click(addButton);

    await userEvent.type(input, "Second todo");
    await userEvent.click(addButton);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.getByText("Second todo")).toBeInTheDocument();
  });
});

describe("Delete button functionality", () => {
  test("renders Delete button for each todo item", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Test todo");
    await userEvent.click(addButton);

    const deleteButton = screen.getByRole("button", {
      name: /Delete "Test todo"/i,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  test("removes todo when Delete button is clicked", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Todo to delete");
    await userEvent.click(addButton);

    expect(screen.getByText("Todo to delete")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: /Delete "Todo to delete"/i,
    });
    await userEvent.click(deleteButton);

    expect(screen.queryByText("Todo to delete")).not.toBeInTheDocument();
  });

  test("removes correct todo when multiple todos exist", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "First todo");
    await userEvent.click(addButton);

    await userEvent.type(input, "Second todo");
    await userEvent.click(addButton);

    await userEvent.type(input, "Third todo");
    await userEvent.click(addButton);

    const deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[1]);

    expect(screen.getByText("First todo")).toBeInTheDocument();
    expect(screen.queryByText("Second todo")).not.toBeInTheDocument();
    expect(screen.getByText("Third todo")).toBeInTheDocument();
  });

  test("handles deleting all todos", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "First todo");
    await userEvent.click(addButton);

    await userEvent.type(input, "Second todo");
    await userEvent.click(addButton);

    let deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[0]);

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[0]);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});

describe("Advanced button interactions", () => {
  test("Add button works with Enter key press", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);

    await userEvent.type(input, "Todo via Enter key{enter}");

    expect(screen.getByText("Todo via Enter key")).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
  });

  test("Add button handles rapid clicks", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Rapid click test");

    await userEvent.click(addButton);
    await userEvent.click(addButton);
    await userEvent.click(addButton);

    const todoItems = screen.getAllByRole("listitem");
    expect(todoItems).toHaveLength(1);
    expect(screen.getByText("Rapid click test")).toBeInTheDocument();
  });

  test("Delete button works immediately after adding todo", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Quick delete test");
    await userEvent.click(addButton);

    const deleteButton = screen.getByRole("button", {
      name: /Delete "Quick delete test"/i,
    });
    await userEvent.click(deleteButton);

    expect(screen.queryByText("Quick delete test")).not.toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("Add button preserves focus after adding todo", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(
      /add a new to-do/i
    ) as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Focus test");
    await userEvent.click(addButton);
    await userEvent.type(input, "Second todo");

    expect(input.value).toBe("Second todo");
  });

  test("Delete buttons maintain correct functionality after reordering", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Todo A");
    await userEvent.click(addButton);

    await userEvent.type(input, "Todo B");
    await userEvent.click(addButton);

    await userEvent.type(input, "Todo C");
    await userEvent.click(addButton);

    let deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[1]);

    expect(screen.getByText("Todo A")).toBeInTheDocument();
    expect(screen.queryByText("Todo B")).not.toBeInTheDocument();
    expect(screen.getByText("Todo C")).toBeInTheDocument();

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[0]);

    expect(screen.queryByText("Todo A")).not.toBeInTheDocument();
    expect(screen.getByText("Todo C")).toBeInTheDocument();
  });

  test("Add button handles special characters and symbols", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    const specialTodo =
      "Buy groceries @ 5pm! (includes: milk, eggs & bread) - $25";

    await userEvent.type(input, specialTodo);
    await userEvent.click(addButton);

    expect(screen.getByText(specialTodo)).toBeInTheDocument();
  });

  test("Add button handles very long todo text", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    const longTodo =
      "This is a very long todo item that contains many words and should test how the application handles lengthy text input that users might enter when they want to be very descriptive about their tasks";

    await userEvent.type(input, longTodo);
    await userEvent.click(addButton);

    expect(screen.getByText(longTodo)).toBeInTheDocument();
  });

  test("Multiple delete operations in sequence", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    for (let i = 1; i <= 5; i++) {
      await userEvent.type(input, `Todo ${i}`);
      await userEvent.click(addButton);
    }

    expect(screen.getAllByRole("listitem")).toHaveLength(5);

    let deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[4]);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[3]);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[2]);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[1]);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    deleteButtons = screen.getAllByRole("button", { name: /Delete / });
    await userEvent.click(deleteButtons[0]);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("toggle button has proper accessibility attributes", async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add a new to-do/i);
    const addButton = screen.getByRole("button", { name: /add/i });

    await userEvent.type(input, "Accessibility test");
    await userEvent.click(addButton);

    const toggleButton = screen.getByRole("button", {
      name: /Mark "Accessibility test" as complete/i,
    });
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");
    expect(toggleButton).toHaveClass("toggle-button");

    await userEvent.click(toggleButton);

    const toggledButton = screen.getByRole("button", {
      name: /Mark "Accessibility test" as incomplete/i,
    });
    expect(toggledButton).toHaveAttribute("aria-pressed", "true");

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveClass("completed");
  });

  test("input has proper label association", () => {
    render(<App />);

    const input = screen.getByLabelText(/Enter a new to-do item/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "todo-input");

    const label = screen.getByLabelText(/Enter a new to-do item/i);
    expect(label).toHaveAttribute("placeholder", "Add a new to-do...");
  });
});
