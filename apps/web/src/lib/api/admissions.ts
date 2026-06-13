import { apiFetch } from "./client";
import type { Admission, AdmissionStatus, Visit, FamilyContact } from "@/lib/types";

export interface ListAdmissionsParams {
  status?: AdmissionStatus;
  wardId?: string;
  skip?: number;
  take?: number;
}

export interface PaginatedAdmissions {
  total: number;
  skip: number;
  take: number;
  items: Array<Admission & {
    patient: { id: string; name: string; cpf: string };
    bed: { id: string; code: string; ward: { id: string; name: string } };
  }>;
}

/** Lista internações do hospital com filtros opcionais. */
export const getAdmissions = (params: ListAdmissionsParams = {}) => {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.wardId) qs.set("wardId", params.wardId);
  if (params.skip != null) qs.set("skip", String(params.skip));
  if (params.take != null) qs.set("take", String(params.take));
  const suffix = qs.toString() ? `?${qs}` : "";
  return apiFetch<PaginatedAdmissions>(`/admissions${suffix}`);
};

/** Abre uma internação (ocupa o leito) — apenas PHYSICIAN, ADMIN. */
export const createAdmission = (data: {
  patientId: string;
  bedId: string;
  diagnosis?: string;
}) =>
  apiFetch<Admission>(`/admissions`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Dá alta — libera o leito. */
export const dischargeAdmission = (id: string) =>
  apiFetch<Admission>(`/admissions/${id}/discharge`, { method: "PATCH" });

/** Adiciona contato familiar à internação. Gera accessToken (cuid) único. */
export const createFamilyContact = (
  admissionId: string,
  data: { name: string; relationship: string; phone: string },
) =>
  apiFetch<FamilyContact>(`/admissions/${admissionId}/family-contacts`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Detalhe de uma internação com paciente, leito, visitas e contatos familiares. */
export const getAdmission = (id: string) =>
  apiFetch<
    Admission & {
      patient: { id: string; name: string; cpf: string; dob: string; allergies: string[] };
      bed: { id: string; code: string; ward: { id: string; name: string } };
      visits: Array<Pick<Visit, "id" | "status" | "startedAt" | "finishedAt">>;
      familyContacts: FamilyContact[];
    }
  >(`/admissions/${id}`);
