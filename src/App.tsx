// No need to import React with the new JSX transform
import { useTodos } from "./hooks/useTodos";
import "./App.css";

export const App = () => {
  const {
    todos,
    taskInputValue,
    handleInputChange,
    handleKeyDown,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
  } = useTodos();

  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div className="input-container">
        <label htmlFor="todo-input" className="visually-hidden">
          Enter a new to-do item
        </label>
        <input
          id="todo-input"
          type="text"
          value={taskInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a new to-do..."
        />
        <button type="button" onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <button
              type="button"
              className="toggle-button"
              onClick={() => handleToggleTodo(todo.id)}
              aria-label={`Mark "${todo.text}" as ${
                todo.completed ? "incomplete" : "complete"
              }`}
              aria-pressed={todo.completed}
            >
              {todo.text}
            </button>
            <button
              type="button"
              onClick={() => handleDeleteTodo(todo.id)}
              aria-label={`Delete "${todo.text}"`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
