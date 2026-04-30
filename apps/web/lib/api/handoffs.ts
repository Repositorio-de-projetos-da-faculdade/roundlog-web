import { apiFetch } from "./client";
import type { Handoff } from "@/lib/types";

/** Busca passagem de plantão ativa de uma ala */
export const getActiveHandoff = (wardId: string) =>
  apiFetch<Handoff>(`/wards/${wardId}/handoffs/active`);

/** Lista histórico de passagens de plantão */
export const getHandoffHistory = (wardId: string) =>
  apiFetch<Handoff[]>(`/wards/${wardId}/handoffs`);

/** Cria nova passagem de plantão */
export const createHandoff = (wardId: string) =>
  apiFetch<Handoff>(`/wards/${wardId}/handoffs`, {
    method: "POST",
  });

/** Confirma recebimento de passagem de plantão */
export const acknowledgeHandoff = (handoffId: string) =>
  apiFetch<void>(`/handoffs/${handoffId}/acknowledge`, {
    method: "PATCH",
  });
