import { useState, useCallback, useRef } from "react";

// Internal ID generator scoped to this module
let nextId = 1;

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

  const handleInputChange = useCallback((e) => {
    const v = e.target.value;
    inputValueRef.current = v;
    setTaskInputValue(v);
  }, []);

  const handleAddTodo = useCallback(() => {
    const current = inputValueRef.current;
    const trimmed = current.trim();
    if (trimmed) {
      setTodos((prev) => [
        ...prev,
        {
          id: nextId++,
          text: current,
          completed: false,
        },
      ]);
      inputValueRef.current = "";
      setTaskInputValue("");
    } else {
      inputValueRef.current = "";
      setTaskInputValue("");
    }
  }, []);

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
