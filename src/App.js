import { useState } from "react";
import "./App.css";

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [taskInputValue, setTaskInputValue] = useState("");

  const handleInputChange = (e) => {
    setTaskInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleAddTodo = () => {
    if (taskInputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now() + Math.random(), // Generate unique ID
          text: taskInputValue,
          completed: false,
        },
      ]);
      setTaskInputValue("");
    } else {
      // Clear input if it contains only whitespace
      setTaskInputValue("");
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a new to-do..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => handleToggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
