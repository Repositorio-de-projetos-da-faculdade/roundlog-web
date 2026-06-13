import { apiFetch } from "./client";
import type { NearMiss } from "@/lib/types";

export interface NearMissSummary {
  total: number;
  byCategory: Array<{ category: string; _count: number }>;
  bySeverity: Array<{ severity: string; _count: number }>;
}

/** Registra um near-miss (anônimo ou identificado). */
export const createNearMiss = (data: {
  wardId?: string;
  category: NearMiss["category"];
  severity: NearMiss["severity"];
  description: string;
  isAnonymous?: boolean;
}) =>
  apiFetch<NearMiss>(`/near-misses`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Resumo agregado — apenas MANAGER, ADMIN. */
export const getNearMissSummary = () =>
  apiFetch<NearMissSummary>(`/near-misses/summary`);

/** Padrões dos últimos 30 dias — apenas MANAGER, ADMIN. */
export const getNearMissPatterns = () =>
  apiFetch<NearMiss[]>(`/near-misses/patterns`);
