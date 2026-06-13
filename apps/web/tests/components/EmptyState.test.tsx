import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../../src/components/layout/EmptyState";

describe("EmptyState", () => {
  it("renderiza título e descrição", () => {
    render(<EmptyState title="Nada aqui" description="Tente outra busca" />);
    expect(screen.getByText("Nada aqui")).toBeInTheDocument();
    expect(screen.getByText("Tente outra busca")).toBeInTheDocument();
  });

  it("renderiza action quando fornecida", () => {
    render(<EmptyState title="Vazio" action={<button>Criar</button>} />);
    expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
  });

  it("tem role=status para acessibilidade", () => {
    render(<EmptyState title="x" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
