import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";

// Reset localStorage entre testes pra evitar interferência
beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
});

afterEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
});
