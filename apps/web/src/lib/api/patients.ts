import { apiFetch } from "./client";
import type { Patient, Admission } from "@/lib/types";

export interface ListPatientsParams {
  search?: string;
  skip?: number;
  take?: number;
}

export interface PaginatedPatients {
  total: number;
  skip: number;
  take: number;
  items: Array<Patient & {
    admissions: Array<{
      id: string;
      status: "ACTIVE" | "DISCHARGED";
      admittedAt: string;
      diagnosis: string | null;
      bed: { id: string; code: string; wardId: string };
    }>;
  }>;
}

/** Lista pacientes do hospital com busca opcional por nome ou CPF. */
export const getPatients = (params: ListPatientsParams = {}) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.skip != null) qs.set("skip", String(params.skip));
  if (params.take != null) qs.set("take", String(params.take));
  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<PaginatedPatients>(`/patients${suffix}`);
};

/** Cadastra paciente (CPF único globalmente). */
export const createPatient = (data: {
  name: string;
  cpf: string;
  dob: string;
  bloodType?: string;
  allergies?: string[];
}) =>
  apiFetch<Patient>(`/patients`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Detalhe do paciente com histórico de internações. */
export const getPatient = (id: string) =>
  apiFetch<Patient & { admissions: Admission[] }>(`/patients/${id}`);
