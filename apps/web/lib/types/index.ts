export * from "./user";
export * from "./patient";
export * from "./visit";
export * from "./ward";
export * from "./handoff";

// Tipo auxiliar para itens pendentes (usado no PendingCard)
export interface Pending {
  id: string;
  type: "exam" | "procedure" | "medication" | "other";
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "resolved";
  createdAt: string;
}
