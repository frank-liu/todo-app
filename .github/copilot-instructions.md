---
description: "Copilot instructions for todo app"
applyTo: "**"
---

# Copilot instructions for todo-app

This file tells Copilot how to behave when editing or generating code in this repository. Keep suggestions small, well-tested, and aligned with the repository conventions.

## Summary

- Project: Create React App (react-scripts 5). React 19 functional components with Hooks.
- Purpose: Small Todo app demonstrating add/toggle/delete behaviors, unit tests using Testing Library.

## Naming Conventions

- Use function component
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Use ALL_CAPS for constants

## Quick rules

- Use existing patterns: named exports for components (e.g., `export const App` in `src/App.js`).
- Do NOT add React default import; use named imports only (project relies on new JSX transform).
- Use unique stable IDs for lists (`id` field), never use array index as React key.
- Keep dependencies minimal; avoid adding new libraries unless necessary.

Files to inspect when changing behavior

- `src/App.js` — main component; handlers: `handleAddTodo`, `handleToggleTodo`, `handleDeleteTodo`.
- `src/App.test.js` — canonical tests for add/delete behaviors and user interactions. When changing behavior, update/add tests here.
- `.vscode/launch.json` and `.vscode/tasks.json` — local debug setup (Attach vs Launch). Respect attach-based debugging on macOS.

## Testing

- Tests use `@testing-library/react` and `@testing-library/user-event` v13 style (no userEvent.setup()).
- Preserve existing test style and avoid async timing races; re-query DOM elements after state-changing actions (e.g., refetch delete buttons after deleting).

## Debugging notes

- Prefer `Attach to Chrome` when debugging locally (start Chrome with `--remote-debugging-port=9222`). There is also a `CRA: Debug in Chrome` launch config that runs `npm start` as a preLaunchTask.
- If breakpoints don't bind, place breakpoints on executable statements (inside blocks) or use `debugger;` temporarily.

Conventions & patterns

- Handlers are pure and trigger state changes via `setTodos`. Follow existing naming: `handleAddTodo`, `handleKeyDown`, `handleToggleTodo`, `handleDeleteTodo`.
- Input clearing and whitespace handling: trim input before adding and clear input on whitespace-only.
- Styling: class toggles use simple conditional strings (e.g., `className={todo.completed ? "completed" : ""}`) — no `classnames` dependency.

## What NOT to do

- Don't introduce `classnames` or other small utilities without explicit need.
- Don't change export style from named to default without updating imports/tests.
- Don't use array index as keys for list items.

If you change public behavior

- Add or update tests in `src/App.test.js` (prefer small focused tests). Run `npm test` locally.
- Run `npm start` and verify app in browser; ensure `Compiled successfully` before attaching debugger.

If anything is unclear, ask for:

- Which test should be updated and expected behavior (include acceptance criteria).
- Whether a new dependency is approved.

---

Edge examples:

- Adding a todo: update `handleAddTodo` to push `{ id: nextId++, text, completed: false }` then `setTaskInputValue("")`.
- Deleting: use `setTodos(todos.filter(t => t.id !== id))` and re-query delete buttons in tests.
