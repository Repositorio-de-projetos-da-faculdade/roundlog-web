import { apiFetch } from "./client";
import type { Patient, Admission } from "@/lib/types";

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
