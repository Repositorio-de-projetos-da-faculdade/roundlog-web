import { apiFetch } from "./client";
import type { Visit } from "@/lib/types";

/** Busca uma visita por ID */
export const getVisit = (id: string) =>
  apiFetch<Visit>(`/visits/${id}`);

/** Lista visitas de uma internação */
export const getVisitsByAdmission = (admissionId: string) =>
  apiFetch<Visit[]>(`/admissions/${admissionId}/visits`);

/** Cria nova visita para uma internação */
export const createVisit = (admissionId: string) =>
  apiFetch<Visit>(`/visits`, {
    method: "POST",
    body: JSON.stringify({ admissionId }),
  });

/** Envia áudio gravado para transcrição */
export const uploadAudio = async (visitId: string, blob: Blob) => {
  const form = new FormData();
  form.append("audio", blob, "visit.webm");
  return apiFetch<{ status: string }>(`/visits/${visitId}/audio`, {
    method: "POST",
    body: form,
    headers: {}, // sem Content-Type: deixa o browser setar o boundary
  });
};

/** Marca uma conduta como resolvida */
export const resolveConduct = (conductId: string, notes: string) =>
  apiFetch<void>(`/conducts/${conductId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });

/** Reconhece (acknowledges) um alerta clínico */
export const acknowledgeAlert = (alertId: string) =>
  apiFetch<void>(`/alerts/${alertId}/acknowledge`, {
    method: "PATCH",
  });
