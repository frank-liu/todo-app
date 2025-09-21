import { useState, useCallback, useRef } from "react";

/**
 * useTodos - Manages todo list state and handlers
 *
 * Exposes the same behaviors as previously implemented in App:
 * - Add with trim + input clearing for whitespace-only
 * - Toggle by id
 * - Delete by id
 * - Enter key adds
 */
export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [taskInputValue, setTaskInputValue] = useState("");
  // Mirror of the input value to avoid stale-closure issues during rapid clicks
  const inputValueRef = useRef("");
  // Instance-scoped ID counter to avoid cross-instance/HMR leakage
  const nextIdRef = useRef(1);

  // Helpers to avoid duplication
  const clearInput = useCallback(() => {
    inputValueRef.current = "";
    setTaskInputValue("");
  }, []);

  const nextId = useCallback(() => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    return id;
  }, []);

  const handleInputChange = useCallback((e) => {
    const v = e.target.value;
    inputValueRef.current = v;
    setTaskInputValue(v);
  }, []);

  const handleAddTodo = useCallback(() => {
    const current = inputValueRef.current;
    const trimmed = current.trim();
    if (!trimmed) {
      clearInput();
      return;
    }
    setTodos((prev) => [
      ...prev,
      {
        id: nextId(),
        text: current,
        completed: false,
      },
    ]);
    clearInput();
  }, [clearInput, nextId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleAddTodo();
      }
    },
    [handleAddTodo]
  );

  const handleToggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return {
    todos,
    taskInputValue,
    setTaskInputValue, // exposed for completeness (tests might set directly)
    handleInputChange,
    handleKeyDown,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
  };
};
