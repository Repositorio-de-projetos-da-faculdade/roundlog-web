import { apiFetch } from "./client";
import type { Ward, Bed, DashboardBed } from "@/lib/types";

/** Lista alas do hospital do usuário autenticado. */
export const getWards = () => apiFetch<Ward[]>(`/wards`);

/** Cria nova ala — apenas ADMIN, MANAGER. */
export const createWard = (data: {
  name: string;
  floor?: string;
  specialty?: string;
}) =>
  apiFetch<Ward>(`/wards`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Cria leito em uma ala — apenas ADMIN, MANAGER. */
export const createBed = (
  wardId: string,
  data: { code: string; status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" },
) =>
  apiFetch<Bed>(`/wards/${wardId}/beds`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/**
 * Dashboard da ala: array de leitos com internações ativas, pacientes,
 * últimas visitas e condutas/pendências/alertas abertos. Usado pela enfermagem.
 */
export const getWardDashboard = (wardId: string) =>
  apiFetch<DashboardBed[]>(`/wards/${wardId}/dashboard`);
