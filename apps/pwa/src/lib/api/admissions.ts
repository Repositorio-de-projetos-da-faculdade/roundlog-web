import { apiFetch } from "./client";
import type { Admission, Visit, FamilyContact } from "@/lib/types";

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

/**
 * Tipo retornado por GET /admissions/my — listagem leve pro PWA.
 * Médico vê todas as ACTIVE do hospital; enfermeiro só as da ward do shift aberto.
 */
export interface MyAdmissionItem {
  id: string;
  diagnosis: string | null;
  admittedAt: string;
  patient: { id: string; name: string };
  bed: { id: string; code: string; ward: { id: string; name: string } };
  lastVisitAt: string | null;
}

export interface MyAdmissionsResponse {
  items: MyAdmissionItem[];
  /** True se o usuário é NURSE/TECHNICIAN sem plantão aberto. */
  requiresShift: boolean;
  activeShiftWardId: string | null;
}

/**
 * Lista as internações relevantes pro usuário logado.
 * Usado pela tela inicial /beds do PWA — substitui o boot direto pro
 * gravador (que caía sem admissionId).
 */
export const getMyAdmissions = () =>
  apiFetch<MyAdmissionsResponse>(`/admissions/my`);

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
