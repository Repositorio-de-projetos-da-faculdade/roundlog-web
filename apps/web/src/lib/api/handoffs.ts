import { apiFetch } from "./client";
import type { ShiftHandoff } from "@/lib/types";

/** Gera um novo handoff com summary via LLM — apenas NURSE, ADMIN. */
export const generateHandoff = (data: { wardId: string; fromShiftId: string }) =>
  apiFetch<ShiftHandoff>(`/handoffs/generate`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Detalhe de um handoff (ward, turnos, acks). */
export const getHandoff = (id: string) =>
  apiFetch<ShiftHandoff>(`/handoffs/${id}`);

/** Registra ciência do próximo turno. */
export const acknowledgeHandoff = (id: string) =>
  apiFetch<{ id: string; handoffId: string; userId: string }>(
    `/handoffs/${id}/acknowledge`,
    { method: "POST" },
  );
