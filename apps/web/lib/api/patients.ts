import { apiFetch } from "./client";
import type { Patient, Admission } from "@/lib/types";

/** Busca um paciente por ID */
export const getPatient = (id: string) =>
  apiFetch<Patient>(`/patients/${id}`);

/** Lista pacientes com filtro opcional */
export const getPatients = (search?: string) => {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch<Patient[]>(`/patients${params}`);
};

/** Busca internação por ID */
export const getAdmission = (id: string) =>
  apiFetch<Admission>(`/admissions/${id}`);

/** Lista internações ativas de um paciente */
export const getActiveAdmissions = (patientId: string) =>
  apiFetch<Admission[]>(`/patients/${patientId}/admissions?status=active`);
