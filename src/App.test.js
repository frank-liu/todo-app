import { render, screen } from "@testing-library/react";
import { App } from "./App";

// TODO: fix this test
test("renders My To-Do List heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/My To-Do List/i);
  expect(headingElement).toBeInTheDocument();
});
