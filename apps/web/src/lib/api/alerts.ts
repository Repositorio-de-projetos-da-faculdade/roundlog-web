import { apiFetch } from "./client";
import type { ClinicalAlert } from "@/lib/types";

/** Dá ciência a um alerta clínico. */
export const acknowledgeAlert = (alertId: string) =>
  apiFetch<ClinicalAlert>(`/alerts/${alertId}/acknowledge`, { method: "PATCH" });
