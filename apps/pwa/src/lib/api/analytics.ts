import { apiFetch } from "./client";

export interface AnalyticsOverview {
  totalVisits: number;
  totalPatients: number;
  avgVisitDuration: number; // em segundos
  conductComplianceRate: number; // percentual
  nearMissCount: number;
  topDiagnoses: { diagnosis: string; count: number }[];
  visitsByDay: { date: string; count: number }[];
  conductsByPriority: { priority: string; count: number }[];
}

export interface NearMiss {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedBy: string;
  reportedAt: string;
  category: string;
  resolution: string | null;
  resolvedAt: string | null;
}

/** Busca dados consolidados para o painel de gestão */
export const getAnalyticsOverview = (period?: string) => {
  const params = period ? `?period=${period}` : "";
  return apiFetch<AnalyticsOverview>(`/analytics/overview${params}`);
};

/** Lista near-misses */
export const getNearMisses = () =>
  apiFetch<NearMiss[]>(`/near-misses`);

/** Reporta um near-miss */
export const reportNearMiss = (data: Omit<NearMiss, "id" | "reportedAt" | "resolution" | "resolvedAt">) =>
  apiFetch<NearMiss>(`/near-misses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
