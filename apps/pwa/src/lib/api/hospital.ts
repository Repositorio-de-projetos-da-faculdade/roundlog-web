import { apiFetch } from "./client";

export interface Hospital {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
  wards: Array<{ id: string; name: string; floor?: string | null; specialty?: string | null }>;
}

/** Dados do hospital do usuário autenticado. */
export const getMyHospital = () => apiFetch<Hospital>(`/hospital`);
