import { apiFetch } from "./client";
import type {
  ComplianceMetrics,
  HandoffMetrics,
  WardAnalytics,
} from "@/lib/types";

export interface DateRange {
  from?: string; // ISO datetime
  to?: string;   // ISO datetime
}

function rangeQS(range?: DateRange): string {
  if (!range) return "";
  const qs = new URLSearchParams();
  if (range.from) qs.set("from", range.from);
  if (range.to) qs.set("to", range.to);
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/** Ocupação da ala — apenas MANAGER, ADMIN. (Estado instantâneo, sem filtro temporal.) */
export const getWardAnalytics = (wardId: string) =>
  apiFetch<WardAnalytics>(`/analytics/ward/${wardId}`);

/** Taxa de resolução de condutas no período. Default: últimos 30 dias. */
export const getComplianceMetrics = (range?: DateRange) =>
  apiFetch<ComplianceMetrics & { from: string; to: string }>(
    `/analytics/compliance${rangeQS(range)}`,
  );

/** Taxa de ciência dos plantões no período. Default: últimos 30 dias. */
export const getHandoffMetrics = (range?: DateRange) =>
  apiFetch<HandoffMetrics & { from: string; to: string }>(
    `/analytics/handoffs${rangeQS(range)}`,
  );
