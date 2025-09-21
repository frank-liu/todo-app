import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";

describe("useTodos hook", () => {
    test("initializes with empty todos and input", () => {
        const { result } = renderHook(() => useTodos());
        expect(result.current.todos).toEqual([]);
        expect(result.current.taskInputValue).toBe("");
    });

    test("handleInputChange updates input value", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "Task A" },
            } as React.ChangeEvent<HTMLInputElement>);
        });
        expect(result.current.taskInputValue).toBe("Task A");
    });

    test("does not add todo for whitespace-only and clears input", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "   " },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
        });
        expect(result.current.todos).toHaveLength(0);
        expect(result.current.taskInputValue).toBe("");
    });

    test("adds a new todo with valid input and clears input", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "First todo" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
        });
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].text).toBe("First todo");
        expect(typeof result.current.todos[0].id).toBe("number");
        expect(result.current.todos[0].completed).toBe(false);
        expect(result.current.taskInputValue).toBe("");
    });

    test("Enter key triggers add", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "Enter add" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleKeyDown({ key: "Enter" } as React.KeyboardEvent<HTMLInputElement>);
        });
        expect(result.current.todos.map((t) => t.text)).toContain("Enter add");
        expect(result.current.taskInputValue).toBe("");
    });

    test("non-Enter key does not add", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "No add" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleKeyDown({ key: "a" } as React.KeyboardEvent<HTMLInputElement>);
        });
        expect(result.current.todos).toHaveLength(0);
        expect(result.current.taskInputValue).toBe("No add");
    });

    test("toggle todo completed state by id", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "Toggle me" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
        });
        const id = result.current.todos[0].id;
        act(() => {
            result.current.handleToggleTodo(id);
        });
        expect(result.current.todos[0].completed).toBe(true);
        act(() => {
            result.current.handleToggleTodo(id);
        });
        expect(result.current.todos[0].completed).toBe(false);
    });

    test("delete todo by id", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "A" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
            result.current.handleInputChange({
                target: { value: "B" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
        });
        const ids = result.current.todos.map((t) => t.id);
        act(() => {
            result.current.handleDeleteTodo(ids[0]);
        });
        expect(result.current.todos.map((t) => t.text)).toEqual(["B"]);
    });

    test("rapid double add only adds once (input clears after first add)", () => {
        const { result } = renderHook(() => useTodos());
        act(() => {
            result.current.handleInputChange({
                target: { value: "Rapid" },
            } as React.ChangeEvent<HTMLInputElement>);
            result.current.handleAddTodo();
            // Immediately try to add again without changing input
            result.current.handleAddTodo();
        });
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].text).toBe("Rapid");
    });
});
