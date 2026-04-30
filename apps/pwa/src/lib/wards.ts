import { apiFetch } from "./client";
import type { Ward, WardDashboard, ConductExecution } from "@/lib/types";

/** Lista alas do hospital */
export const getWards = () => apiFetch<Ward[]>(`/wards`);

/** Busca uma ala por ID */
export const getWard = (id: string) => apiFetch<Ward>(`/wards/${id}`);

/** Busca dashboard completo de uma ala */
export const getWardDashboard = (wardId: string) =>
  apiFetch<WardDashboard>(`/wards/${wardId}/dashboard`);

/** Registra execução de conduta pela enfermagem */
export const executeConductInWard = (data: ConductExecution) =>
  apiFetch<void>(`/conducts/${data.conductId}/execute`, {
    method: "POST",
    body: JSON.stringify(data),
  });
