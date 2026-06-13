import { apiFetch } from "./client";
import type { Conduct, ConductExecutionInput } from "@/lib/types";

/** Resolve uma conduta (qualquer role autenticada). */
export const resolveConduct = (conductId: string) =>
  apiFetch<Conduct>(`/conducts/${conductId}/resolve`, { method: "PATCH" });

/** Registra a execução de uma conduta pela enfermagem — NURSE, TECHNICIAN. */
export const executeConduct = (conductId: string, data: ConductExecutionInput) =>
  apiFetch<{ id: string; conductId: string; status: string }>(
    `/conducts/${conductId}/execute`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
